"use client";
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, PauseCircle, StopCircle, PlayCircle } from 'lucide-react';

type Props = {};

const RecordSound = (props: Props) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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

    const handleStartRecording = () => {
        SpeechRecognition.startListening({ continuous: true });
        setIsRecording(true);
        setIsPaused(false);
    };

    const handlePauseRecording = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            setIsPaused(true);
        } else {
            SpeechRecognition.startListening({ continuous: true });
            setIsPaused(false);
        }
    };

    const handleStopRecording = () => {
        SpeechRecognition.stopListening();
        setIsRecording(false);
        setIsPaused(false);
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    return (
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
            {transcript && (
                <div className='mt-4'>
                    <h2 className='text-black'>Transcription:</h2>
                    <p className='text-black'>{transcript}</p>
                </div>
            )}
        </div>
    );
};

export default RecordSound;
