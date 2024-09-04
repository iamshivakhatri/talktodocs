"use client"; // Ensures this component is rendered on the client-side

import React, { useState, useRef, useEffect } from 'react';
import { Mic, PauseCircle, StopCircle, PlayCircle } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import { useAuth } from "@clerk/nextjs"; // Client-side authentication hook

type Props = {}

const NavbarComponent = (props: Props) => {
  const { isSignedIn } = useAuth(); // Get authentication status and user info

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (isRecording) {
    timerRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
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

      mediaRecorder.onstop = () => {
        // Handle the recorded audio blob, e.g., upload or process it
        if (audioBlob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('Audio URL:', audioUrl);
          // You can use the audioUrl to play the recording or upload it
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
      setIsPaused(!isPaused);
    }else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(!isPaused);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  return (
    <div className='flex justify-between p-4 px-8 items-center'>
      <div className='flex justify-around gap-6 items-center'>
        {isRecording ? (
          <div className='flex gap-4 items-center'>
            <Button onClick={handlePauseRecording} className='hover:bg-yellow-500' >
                {isPaused ? (
                    <div>
                        <PlayCircle className='w-8 h-8' />
                    </div>
                 ): (
                    <PauseCircle className='w-8 h-8' />
                 )}
             
            </Button>
            <Button onClick={handleStopRecording} className='hover:bg-red-500'>
              <StopCircle className='w-8 h-8' />
            </Button>
            {/* <div className='relative'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-4 h-4 bg-red-500 rounded-full animate-pulse'></div>
              </div>
              <p className='text-gray-700'>{isPaused ? 'Paused' : 'Recording...'}</p>
            </div> */}
            <div className='relative'>
                {/* <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 bg-white-500 rounded-full animate-dot'></div>
                    <div className='w-2 h-2 bg-white-500 rounded-full animate-dot animation-delay-200'></div>
                    <div className='w-2 h-2 bg-white-500 rounded-full animate-dot animation-delay-400'></div>
                    </div>
                </div> */}
                <p className='text-white'>
                    {isPaused ? 'Paused' : `Recording... ${formatTime(elapsedTime)}`}
                </p>
            </div>

          </div>
        ) : (
          <Button onClick={handleStartRecording} variant={'price'}>
            <Mic className='w-4 h-4 mr-2' />
            Start Recording
          </Button>
        )}
      </div>

      <div className='flex   gap-8'>
       <p>Chat</p>
       <p>Dashboard</p>
        {isSignedIn ? <UserButton afterSwitchSessionUrl='/' /> : <p>Please sign in</p>}
      </div>
    </div>
  );
}

export default NavbarComponent;
