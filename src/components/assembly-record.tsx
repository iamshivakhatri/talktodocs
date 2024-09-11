"use client";
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { Mic, PauseCircle, StopCircle, PlayCircle } from 'lucide-react';

type Props = {};

const RecordSound = (props: Props) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcript, setTranscript] = useState<string>('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const {
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

    const handleStartRecording = async () => {
        setIsRecording(true);
        setIsPaused(false);
        resetTranscript();
        
        SpeechRecognition.startListening({ continuous: true });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.start();
    };

    const handlePauseRecording = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            setIsPaused(true);
            mediaRecorderRef.current?.pause();
        } else {
            SpeechRecognition.startListening({ continuous: true });
            setIsPaused(false);
            mediaRecorderRef.current?.resume();
        }
    };

    const handleStopRecording = async () => {
        SpeechRecognition.stopListening();
        setIsRecording(false);
        setIsPaused(false);
        mediaRecorderRef.current?.stop();

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);

        // Save audio file locally or upload to AssemblyAI
        const audioFile = new File([audioBlob], "audio.mp3", {
            type: 'audio/mp3',
        });

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await axios.post('https://api.assemblyai.com/v2/upload', formData, {
                headers: {
                    'authorization': 'your-assemblyai-api-key',  // Replace with your AssemblyAI API key
                },
            });

            const transcriptResponse = await axios.post(
                'https://api.assemblyai.com/v2/transcript',
                {
                    audio_url: response.data.upload_url,
                },
                {
                    headers: {
                        'authorization': 'your-assemblyai-api-key',
                    },
                }
            );

            const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptResponse.data.id}`;

            // Polling for the transcript
            const getTranscript = async () => {
                const res = await axios.get(pollingEndpoint, {
                    headers: {
                        'authorization': 'your-assemblyai-api-key',
                    },
                });

                if (res.data.status === 'completed') {
                    setTranscript(res.data.text);
                    setAudioBlob(null);  // Clear the blob after transcription
                } else {
                    setTimeout(getTranscript, 5000);  // Retry after 5 seconds
                }
            };

            getTranscript();
        } catch (error) {
            console.error('Error uploading audio to AssemblyAI:', error);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
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
