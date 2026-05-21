import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import speech, { SpeechClient } from '@google-cloud/speech';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3010', 10);

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
    console.log('Client connected:', socket.id);
    // streamingRecognize returns a Pumpify stream (the concrete type from google-gax)
    let recognizeStream: ReturnType<SpeechClient['streamingRecognize']> | null = null;

    socket.on('startGoogleCloudStream', (config) => {
      if (!speechClient) {
        socket.emit('speechError', 'Speech transcription is not available on this server. Check server logs for credential configuration details.');
        return;
      }
      console.log('Starting Google Cloud Speech stream (language: %s)', config?.language || 'en-US');
      try {
        recognizeStream = speechClient
          .streamingRecognize({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: config?.language || 'en-US',
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
            console.error('Speech API error:', err);
            socket.emit('speechError', err.message);
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
      } catch (err) {
        console.error('Failed to initialize speech stream:', err);
        socket.emit('speechError', 'Failed to start speech recognition stream.');
      }
    });

    socket.on('binaryData', (data) => {
      if (recognizeStream) {
        recognizeStream.write(data);
      }
    });

    socket.on('endGoogleCloudStream', () => {
      if (recognizeStream) {
        recognizeStream.destroy();
        recognizeStream = null;
      }
    });

    socket.on('disconnect', () => {
      if (recognizeStream) {
        recognizeStream.destroy();
        recognizeStream = null;
      }
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server', err);
  process.exit(1);
});
