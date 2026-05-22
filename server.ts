import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import speech, { SpeechClient } from '@google-cloud/speech';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3010', 10);

// Google Speech-to-Text streaming hard limit is ~305 s (~5 minutes).
// Restart every 4 minutes to stay safely within that limit.
const STREAM_RESTART_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes (within the 5-minute hard limit)
const MAX_RECONNECT_ATTEMPTS = 5;
// Cap the in-memory audio buffer to avoid unbounded growth if a restart is slow.
const MAX_AUDIO_BUFFER_CHUNKS = 200;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

/**
 * Normalise a PEM private key that may have been mangled by deployment
 * platform env-var UIs (same logic used in src/lib/firebase/admin.ts).
 *
 * Handles:
 *   - Double-escaped newlines  \\n  →  \n  (re-encode step)
 *   - Literal two-char sequences \n  →  real newline
 *   - Windows carriage-returns  \r  stripped
 */
function normalisePrivateKey(raw: string): string {
  let key = raw;
  key = key.replace(/\\\\n/g, '\\n'); // \\n  →  \n  (double-escape → single-escape)
  key = key.replace(/\\n/g, '\n');    // \n   →  real newline
  key = key.replace(/\r/g, '');       // strip \r (Windows line-endings)
  return key;
}

/**
 * Build a Google Speech-to-Text client exclusively from explicit JSON
 * credentials stored in GOOGLE_APPLICATION_CREDENTIALS.
 *
 * Design decisions — all required by the deployment constraints:
 *
 *   1. NEVER fall back to Application Default Credentials (ADC).
 *      ADC can silently pick up gcloud-CLI auth, VM metadata credentials,
 *      or a credentials file that belongs to Firebase — causing hard-to-debug
 *      permission errors or, worse, credential cross-contamination.
 *
 *   2. NEVER treat the env-var value as a file path.
 *      In a Docker/Coolify container the filesystem is ephemeral; the only
 *      reliable way to inject credentials is via an env var that holds the
 *      full service-account JSON as a compact string.
 *
 *   3. Validate that the credentials belong to the GCP project used for
 *      Speech (gen-lang-client-0701121471), not the Firebase project
 *      (sunave-17c80).  A mismatch is logged as an error and the client
 *      is not created to prevent silent failures at call time.
 *
 *   4. Normalise the private_key field to handle double-escaped \\n sequences
 *      that some deployment UIs introduce when storing multi-line values.
 */
function buildSpeechClient(): SpeechClient | null {
  console.log('[Speech] Initializing Google Cloud Speech client…');

  const rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!rawCreds || rawCreds.trim() === '') {
    console.warn(
      '[Speech] GOOGLE_APPLICATION_CREDENTIALS is not set. ' +
      'Live transcription will be unavailable. ' +
      'Set it to the compact JSON of your GCP Speech service account to enable it.',
    );
    return null;
  }

  // --- Parse JSON (the ONLY accepted format in this deployment) ---
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawCreds.trim());
  } catch (parseErr) {
    console.error(
      '[Speech] GOOGLE_APPLICATION_CREDENTIALS is not valid JSON. ' +
      'In Docker/Coolify deployments you must paste the compact single-line ' +
      'JSON of your GCP service-account key — NOT a file path. ' +
      'Live transcription disabled. Parse error: ' + String(parseErr),
    );
    return null;
  }

  // --- Validate credential type ---
  if (parsed.type !== 'service_account') {
    console.error(
      '[Speech] GOOGLE_APPLICATION_CREDENTIALS has unexpected type "%s". ' +
      'Expected "service_account". Live transcription disabled.',
      parsed.type,
    );
    return null;
  }

  // --- Project isolation check ---
  // Warn loudly if the credentials look like the Firebase service account.
  // We compare against both the FIREBASE_PROJECT_ID env var and the project_id
  // embedded in FIREBASE_SERVICE_ACCOUNT_JSON (when present) so we catch
  // mis-pastes in either direction.
  const speechProjectId = typeof parsed.project_id === 'string' ? parsed.project_id : '';

  const firebaseProjectIds = new Set<string>();
  if (process.env.FIREBASE_PROJECT_ID) {
    firebaseProjectIds.add(process.env.FIREBASE_PROJECT_ID);
  }
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    firebaseProjectIds.add(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const fbJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as Record<string, unknown>;
      if (typeof fbJson.project_id === 'string') {
        firebaseProjectIds.add(fbJson.project_id);
      }
    } catch {
      // Ignore — Firebase credentials may not be set or parseable here
    }
  }

  if (speechProjectId && firebaseProjectIds.has(speechProjectId)) {
    console.error(
      '[Speech] GOOGLE_APPLICATION_CREDENTIALS contains credentials for project "%s", ' +
      'which is also the Firebase project. Speech-to-Text requires a SEPARATE GCP service ' +
      'account (project: gen-lang-client-0701121471). Using Firebase credentials for Speech ' +
      'will cause API permission errors. Live transcription disabled.',
      speechProjectId,
    );
    return null;
  }

  // --- Normalise private_key multiline encoding ---
  if (typeof parsed.private_key === 'string') {
    parsed = { ...parsed, private_key: normalisePrivateKey(parsed.private_key) };
  } else {
    console.error('[Speech] Credentials JSON is missing a private_key field. Live transcription disabled.');
    return null;
  }

  if (!parsed.client_email) {
    console.error('[Speech] Credentials JSON is missing client_email. Live transcription disabled.');
    return null;
  }

  // --- Startup diagnostics (safe — never logs the private key) ---
  console.log(
    '[Speech] Credentials parsed OK — project_id: %s | client_email: %s | type: %s',
    parsed.project_id ?? '(missing)',
    parsed.client_email,
    parsed.type,
  );

  // Explicit projectId from env var (optional but recommended for clarity)
  const gcpProjectId =
    process.env.GOOGLE_CLOUD_PROJECT_ID || (typeof parsed.project_id === 'string' ? parsed.project_id : undefined);

  try {
    const client = new speech.SpeechClient({
      credentials: parsed as Record<string, unknown>,
      ...(gcpProjectId ? { projectId: gcpProjectId } : {}),
    });
    console.log('[Speech] SpeechClient initialized successfully (projectId: %s)', gcpProjectId ?? 'from credentials');
    return client;
  } catch (err) {
    console.error('[Speech] Failed to initialize SpeechClient:', err);
    return null;
  }
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer(server, {
    cors: { origin: '*' },
    maxHttpBufferSize: 1e8 // 100 MB
  });

  const speechClient = buildSpeechClient();

  if (!speechClient) {
    console.warn('[Speech] Live transcription is disabled — Google Cloud Speech credentials are not configured or invalid.');
  }

  io.on('connection', (socket) => {
    console.log('[Socket] Client connected: %s', socket.id);

    // Per-socket stream state
    let recognizeStream: ReturnType<SpeechClient['streamingRecognize']> | null = null;
    let streamRestartTimer: ReturnType<typeof setTimeout> | null = null;
    let streamConfig: Record<string, unknown> | null = null;
    let chunkCount = 0;
    let audioBuffer: ArrayBuffer[] = [];
    let isRestarting = false;
    let reconnectAttempts = 0;

    // -----------------------------------------------------------------------
    // destroyStream — tear down the current recognizeStream safely
    // -----------------------------------------------------------------------
    function destroyStream(): void {
      if (streamRestartTimer) {
        clearTimeout(streamRestartTimer);
        streamRestartTimer = null;
      }
      if (recognizeStream) {
        console.log(
          '[Speech] Destroying stream for socket %s (chunks processed: %d)',
          socket.id,
          chunkCount,
        );
        try {
          recognizeStream.destroy();
        } catch (err) {
          console.error('[Speech] Error destroying stream for socket %s:', socket.id, err);
        }
        recognizeStream = null;
      }
    }

    // -----------------------------------------------------------------------
    // createStream — open a new streamingRecognize stream
    // -----------------------------------------------------------------------
    function createStream(config: Record<string, unknown>): ReturnType<SpeechClient['streamingRecognize']> | null {
      if (!speechClient) return null;

      chunkCount = 0;
      console.log(
        '[Speech] Creating new stream for socket %s (language: %s, reconnect attempt: %d/%d)',
        socket.id,
        config?.language || 'en-US',
        reconnectAttempts,
        MAX_RECONNECT_ATTEMPTS,
      );

      const stream = speechClient
        .streamingRecognize({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: (config?.language as string) || 'en-US',
            enableAutomaticPunctuation: true,
            enableWordTimeOffsets: true,
            diarizationConfig: {
              enableSpeakerDiarization: true,
              minSpeakerCount: 1,
              maxSpeakerCount: 6,
            },
            model: 'latest_long',
          },
          interimResults: true,
        })
        .on('error', (err) => {
          console.error('[Speech] Stream error for socket %s: %s', socket.id, err.message);
          socket.emit('speechError', err.message);

          // Auto-restart on transient errors unless max attempts exhausted
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(
              '[Speech] Scheduling auto-restart %d/%d for socket %s in 1 s',
              reconnectAttempts,
              MAX_RECONNECT_ATTEMPTS,
              socket.id,
            );
            setTimeout(() => restartStream(), 1000);
          } else {
            console.error(
              '[Speech] Max reconnect attempts (%d) reached for socket %s — giving up',
              MAX_RECONNECT_ATTEMPTS,
              socket.id,
            );
          }
        })
        .on('data', (data) => {
          const result = data.results[0];
          if (result && result.alternatives[0]) {
            socket.emit('transcriptData', {
              isFinal: result.isFinal,
              transcript: result.alternatives[0].transcript,
              confidence: result.alternatives[0].confidence,
              words: result.alternatives[0].words,
            });
          }
        });

      console.log('[Speech] Stream started for socket %s', socket.id);
      return stream;
    }

    // -----------------------------------------------------------------------
    // scheduleStreamRestart — set a timer to proactively restart the stream
    //   before the Google Speech hard 305-second limit is hit
    // -----------------------------------------------------------------------
    function scheduleStreamRestart(): void {
      if (streamRestartTimer) clearTimeout(streamRestartTimer);
      streamRestartTimer = setTimeout(() => {
        console.log(
          '[Speech] Proactive 4-minute restart triggered for socket %s',
          socket.id,
        );
        restartStream();
      }, STREAM_RESTART_INTERVAL_MS);
    }

    // -----------------------------------------------------------------------
    // restartStream — destroy the old stream and open a fresh one, buffering
    //   any audio that arrives while the handover is in progress
    // -----------------------------------------------------------------------
    function restartStream(): void {
      if (!streamConfig || !speechClient) return;

      console.log('[Speech] Restarting stream for socket %s', socket.id);
      isRestarting = true;
      audioBuffer = [];

      destroyStream();

      try {
        recognizeStream = createStream(streamConfig);

        if (recognizeStream) {
          // Flush audio that arrived during the restart window
          if (audioBuffer.length > 0) {
            console.log(
              '[Speech] Flushing %d buffered audio chunks for socket %s',
              audioBuffer.length,
              socket.id,
            );
            audioBuffer.forEach((chunk) => recognizeStream?.write(chunk));
            audioBuffer = [];
          }

          scheduleStreamRestart();
          reconnectAttempts = 0;
          console.log('[Speech] Stream restarted successfully for socket %s', socket.id);
        }
      } catch (err) {
        console.error('[Speech] Failed to restart stream for socket %s:', socket.id, err);
      }

      isRestarting = false;
    }

    // -----------------------------------------------------------------------
    // Socket event handlers
    // -----------------------------------------------------------------------
    socket.on('startGoogleCloudStream', (config) => {
      if (!speechClient) {
        socket.emit(
          'speechError',
          'Speech transcription is not available on this server. Check server logs for credential configuration details.',
        );
        return;
      }

      console.log(
        '[Speech] startGoogleCloudStream received from socket %s (language: %s)',
        socket.id,
        config?.language || 'en-US',
      );

      streamConfig = config;
      reconnectAttempts = 0;

      try {
        recognizeStream = createStream(config);
        if (recognizeStream) {
          reconnectAttempts = 0; // reset explicitly after successful initial stream creation
          scheduleStreamRestart();
        }
      } catch (err) {
        console.error('[Speech] Failed to initialize speech stream for socket %s:', socket.id, err);
        socket.emit('speechError', 'Failed to start speech recognition stream.');
      }
    });

    socket.on('binaryData', (data) => {
      chunkCount++;
      if (isRestarting) {
        // Buffer audio so it is not lost during the stream handover.
        // Drop oldest chunks if the buffer exceeds the cap to avoid unbounded growth.
        if (audioBuffer.length >= MAX_AUDIO_BUFFER_CHUNKS) {
          audioBuffer.shift();
          console.warn(
            '[Speech] Audio buffer cap (%d) reached for socket %s — oldest chunk dropped',
            MAX_AUDIO_BUFFER_CHUNKS,
            socket.id,
          );
        }
        audioBuffer.push(data);
        return;
      }
      if (recognizeStream) {
        recognizeStream.write(data);
      }
    });

    socket.on('endGoogleCloudStream', () => {
      console.log(
        '[Speech] endGoogleCloudStream from socket %s (total chunks: %d)',
        socket.id,
        chunkCount,
      );
      destroyStream();
      streamConfig = null;
      audioBuffer = [];
      isRestarting = false;
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Client disconnected: %s (reason: %s, total chunks: %d)', socket.id, reason, chunkCount);
      destroyStream();
      streamConfig = null;
      audioBuffer = [];
      isRestarting = false;
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
