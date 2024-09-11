"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, PauseCircle, StopCircle, PlayCircle, Download, XCircle } from 'lucide-react';
import PlayPauseStop from './play-pause-stop';

const RecordAndPlayAudio: React.FC = () => {
    const [isMediaRecording, setIsMediaRecording] = useState(false);
    const [isSpeechRecording, setIsSpeechRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isSpeechPaused, setIsSpeechPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (isSpeechRecording) {
            SpeechRecognition.startListening({ continuous: true });
        } else {
            SpeechRecognition.stopListening();
        }
    }, [isSpeechRecording]);

    useEffect(() => {
        if (isMediaRecording) {
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
    }, [isMediaRecording]);

    const handleStartMediaRecording = async () => {
        if (isSpeechRecording) {
            SpeechRecognition.stopListening();
            setIsSpeechRecording(false);
        }

        setIsMediaRecording(true);
        setIsPaused(false);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            setAudioBlob(audioBlob);
            audioChunksRef.current = [];
            // Upload audio to the server for MP3 conversion
            // await uploadAudio(audioBlob);

        };

        mediaRecorder.start();
    };

    const handleStopMediaRecording = () => {
        setIsMediaRecording(false);
        setIsPaused(false);
        mediaRecorderRef.current?.stop();
    };

    const handlePauseMediaRecording = () => {
        if (mediaRecorderRef.current) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                setIsPaused(false);
            } else {
                mediaRecorderRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const handlePauseSpeechRecognition = ()=>{
        if (listening) {
            SpeechRecognition.stopListening();
            setIsSpeechPaused(true);
        } else {
            SpeechRecognition.startListening({ continuous: true });
            setIsSpeechPaused(false);
        }

    }

    const handleCancelMediaRecording = () => {
        setIsMediaRecording(false);
        setIsPaused(false);
        mediaRecorderRef.current?.stop();
        setAudioUrl(null);
        audioChunksRef.current = [];
    };

    const handleStartSpeechRecognition = () => {
        if (isMediaRecording) {
            mediaRecorderRef.current?.stop();
            setIsMediaRecording(false);
        }

        setIsSpeechRecording(true);
        setIsSpeechPaused(false);
    };

    const handleStopSpeechRecognition = () => {
        setIsSpeechRecording(false);
    };

    const handleCancelSpeechRecognition = () => {
        setIsSpeechRecording(false);
        resetTranscript();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const uploadAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('audio', blob, 'recorded_audio.webm');

        try {
            const response = await axios.post('/api/assembly', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response from AssemblyAI:', response.data);
            const mp3data = response.data;
            console.log('Data from AssemblyAI:', mp3data.filepath);

        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="flex flex-col items-center">
            {/* <div className="flex gap-4 items-center mb-4">
                {isMediaRecording ? (
                    <>
                        <button onClick={handleStopMediaRecording} className="hover:bg-red-500">
                            <StopCircle className="w-8 h-8" />
                        </button>
                        <button onClick={handlePauseMediaRecording} className={`hover:bg-yellow-500 ${!isMediaRecording ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isPaused ? (
                                <PlayCircle className='w-8 h-8' />
                            ) : (
                                <PauseCircle className='w-8 h-8' />
                            )}
                        </button>
                        <button onClick={handleCancelMediaRecording} className="hover:bg-gray-500">
                            <XCircle className="w-8 h-8" />
                        </button>
                    </>
                ) : (
                    <button onClick={handleStartMediaRecording} className="hover:bg-green-500">
                        <Mic className="w-8 h-8" />
                    </button>
                )}
            </div> */}

            {/* <div className="flex gap-4 items-center mb-4">
                {isSpeechRecording ? (
                    <>
                        <button onClick={handleStopSpeechRecognition} className="hover:bg-red-500">
                            <StopCircle className="w-8 h-8" />
                        </button>
                        <button onClick={handlePauseSpeechRecognition} className={`hover:bg-yellow-500 ${!isSpeechRecording ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isSpeechPaused ? (
                                <PlayCircle className='w-8 h-8' />
                            ) : (
                                <PauseCircle className='w-8 h-8' />
                            )}
                        </button>
                        <button onClick={handleCancelSpeechRecognition} className="hover:bg-gray-500">
                            <XCircle className="w-8 h-8" />
                        </button>
                    </>
                ) : (
                    <button onClick={handleStartSpeechRecognition} className="hover:bg-green-500">
                        <Mic className="w-8 h-8" />
                    </button>
                )}
            </div> */}

            {/* {isMediaRecording && (
                <div className='relative'>
                    <p className='text-white'>
                        {isPaused ? 'Paused' : `Recording... ${formatTime(elapsedTime)}`}
                    </p>
                </div>
            )} */}

            {/* {audioUrl && (
                <div className="mt-4">
                    <h2 className="text-black mb-2">Recorded Audio:</h2>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                    <a
                        href={audioUrl}
                        download="recorded_audio.webm" // Change extension to .webm
                        className="mt-2 inline-block text-blue-500 hover:underline"
                    >
                        <Download className="inline-block w-6 h-6 mr-1" />
                        Download Audio
                    </a>
                </div>
            )} */}

            {/* {transcript && (
                <div className='mt-4'>
                    <h2 className='text-black'>Transcription:</h2>
                    <p className='text-black'>{transcript}</p>
                </div>
            )} */}

                <PlayPauseStop
                isMediaRecording={isMediaRecording}
                isPaused={isPaused}
                elapsedTime={elapsedTime}
                handleStartMediaRecording={handleStartMediaRecording}
                handleStopMediaRecording={handleStopMediaRecording}
                handlePauseMediaRecording={handlePauseMediaRecording}
                handleCancelMediaRecording={handleCancelMediaRecording}
                formatTime={formatTime}
                audioUrl={audioUrl}
                />


            {/* <PlayPauseStop
                isMediaRecording={isSpeechRecording}
                isPaused={isSpeechPaused}
                elapsedTime={elapsedTime}
                handleStartMediaRecording={handleStartSpeechRecognition}
                handleStopMediaRecording={handleStopSpeechRecognition}
                handlePauseMediaRecording={handlePauseSpeechRecognition}
                handleCancelMediaRecording={handleCancelSpeechRecognition}
                formatTime={formatTime}
                transcript={transcript}
                /> */}

        </div>
    );
};

export default RecordAndPlayAudio;
