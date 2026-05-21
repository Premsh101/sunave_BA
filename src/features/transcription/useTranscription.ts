'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useTranscription(language = 'en-US') {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    socketRef.current = io({ path: '/socket.io' });

    socketRef.current.on('transcriptData', (data: any) => {
      if (data.isFinal) {
        setInterimTranscript('');
        setTranscript((prev) => prev + data.transcript + ' ');
      } else {
        setInterimTranscript(data.transcript);
      }
    });

    socketRef.current.on('speechError', (err) => {
      setError(err);
      stopRecording();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = useCallback(async (mode: 'mic' | 'system') => {
    try {
      let stream: MediaStream;
      if (mode === 'mic') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            sampleRate: 16000,
          },
        });

        // Browser or user may not provide an audio track (e.g. user didn't
        // tick "Share tab audio", or the OS doesn't support system capture).
        if (stream.getAudioTracks().length === 0) {
          stream.getTracks().forEach((t) => t.stop());
          setError(
            'No audio track detected. When prompted, make sure to tick "Share tab audio" (or "Share system audio"). ' +
            'Alternatively, use "Capture Microphone Only".'
          );
          return;
        }
      }

      mediaStreamRef.current = stream;

      const audioContext = new window.AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // Secondary guard for the mic path: getUserMedia should always return an
      // audio track on success, but some browser extensions or virtual audio
      // devices can silently strip audio tracks after the promise resolves.
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        audioContext.close();
        stream.getTracks().forEach((t) => t.stop());
        setError('No audio track available. Please check your microphone permissions.');
        return;
      }

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      socketRef.current?.emit('startGoogleCloudStream', { language });

      processor.onaudioprocess = (e) => {
        const audioData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16
        const pcmData = new Int16Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          pcmData[i] = Math.min(1, audioData[i]) * 0x7FFF;
        }
        socketRef.current?.emit('binaryData', pcmData.buffer);
      };

      setIsRecording(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to access audio.');
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    socketRef.current?.emit('endGoogleCloudStream');
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    transcript,
    interimTranscript,
    error,
  };
}
