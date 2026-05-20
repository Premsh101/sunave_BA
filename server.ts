import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import speech from '@google-cloud/speech';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3010', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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

  const speechClient = new speech.SpeechClient({
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS) 
      : undefined
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    let recognizeStream: any = null;

    socket.on('startGoogleCloudStream', (config) => {
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
              enableSpeakerDiarization: true,
              minSpeakerCount: 1,
              maxSpeakerCount: 6,
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
