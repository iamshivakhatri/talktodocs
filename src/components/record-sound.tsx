import React, { useState, useRef, useEffect } from 'react';
import { Mic, PauseCircle, StopCircle, PlayCircle } from 'lucide-react';

type Props = {};

const RecordSound = (props: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioBlob(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      processAudio();
    }
  };

  const processAudio = async () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL:', audioUrl);

      // Simulate sending the audio to a transcription service
      const transcriptionText = await mockTranscriptionService(audioBlob);
      setTranscription(transcriptionText);
    }
  };

  // Mock function simulating a transcription service
  const mockTranscriptionService = async (audioData: Blob): Promise<string> => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a mock transcription of the recorded audio.");
      }, 2000);
    });
  };

  return (
    <div className='flex flex-col justify-around gap-6 items-center'>
      <div className='flex justify-around gap-6 items-center'>
        {isRecording ? (
          <div className='flex gap-4 items-center'>
            <button onClick={handlePauseRecording} className='hover:bg-yellow-500'>
              {isPaused ? (
                <PlayCircle className='w-8 h-8' />
              ) : (
                <PauseCircle className='w-8 h-8' />
              )}
            </button>
            <button onClick={handleStopRecording} className='hover:bg-red-500'>
              <StopCircle className='w-8 h-8' />
            </button>
            <div className='relative'>
              <p className='text-white'>
                {isPaused ? 'Paused' : `Recording... ${formatTime(elapsedTime)}`}
              </p>
            </div>
          </div>
        ) : (
          <button onClick={handleStartRecording} className='hover:bg-green-500'>
            <Mic className='w-8 h-8' />
          </button>
        )}
      </div>
      {transcription && (
        <div className='mt-4'>
          <p className='text-white'>Transcription: {transcription}</p>
        </div>
      )}
    </div>
  );
};

export default RecordSound;
