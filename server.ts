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

// Build Google Speech client only when credentials are configured.
// If GOOGLE_APPLICATION_CREDENTIALS contains a JSON string, parse it;
// otherwise fall back to application-default credentials (local dev / GCE).
function buildSpeechClient(): SpeechClient | null {
  const rawCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (rawCreds) {
    try {
      const credentials = JSON.parse(rawCreds);
      return new speech.SpeechClient({ credentials });
    } catch {
      // Not valid JSON — treat as a file path (ADC behaviour).
      try {
        return new speech.SpeechClient();
      } catch (err) {
        console.warn('[Speech] Could not create Speech client from credentials path:', err);
        return null;
      }
    }
  }
  // No env var: try application-default credentials (e.g. gcloud auth on dev).
  try {
    return new speech.SpeechClient();
  } catch (err) {
    console.warn('[Speech] No Google credentials found — live transcription will be unavailable. Set GOOGLE_APPLICATION_CREDENTIALS to enable it.');
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
    console.warn('[Speech] Live transcription is disabled because Google Cloud credentials are not configured.');
  }

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let recognizeStream: any = null;

    socket.on('startGoogleCloudStream', (config) => {
      if (!speechClient) {
        socket.emit('speechError', 'Speech transcription is not configured on this server. Please set GOOGLE_APPLICATION_CREDENTIALS.');
        return;
      }
      console.log('Starting Google Cloud Speech Stream');
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
            console.error('Speech API Error:', err);
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
        console.error('Failed to initialize stream:', err);
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
