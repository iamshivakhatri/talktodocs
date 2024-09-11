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
    // const [elapsedTime, setElapsedTime] = useState(0);
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

    // useEffect(() => {
    //     if (isMediaRecording) {
    //         timerRef.current = setInterval(() => {
    //             setElapsedTime(prevTime => prevTime + 1);
    //         }, 1000);
    //     } else {
    //         if (timerRef.current) {
    //             clearInterval(timerRef.current);
    //             timerRef.current = null;
    //         }
    //     }
    //     return () => {
    //         if (timerRef.current) {
    //             clearInterval(timerRef.current);
    //         }
    //     };
    // }, [isMediaRecording]);

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
         

                {/* <PlayPauseStop
                isMediaRecording={isMediaRecording}
                isPaused={isPaused}
                elapsedTime={elapsedTime}
                handleStartMediaRecording={handleStartMediaRecording}
                handleStopMediaRecording={handleStopMediaRecording}
                handlePauseMediaRecording={handlePauseMediaRecording}
                handleCancelMediaRecording={handleCancelMediaRecording}
                formatTime={formatTime}
                audioUrl={audioUrl}
                /> */}


            <PlayPauseStop
                isMediaRecording={isSpeechRecording}
                isPaused={isSpeechPaused}
                // elapsedTime={elapsedTime}
                handleStartMediaRecording={handleStartSpeechRecognition}
                handleStopMediaRecording={handleStopSpeechRecognition}
                handlePauseMediaRecording={handlePauseSpeechRecognition}
                handleCancelMediaRecording={handleCancelSpeechRecognition}
                formatTime={formatTime}
                transcript={transcript}
                />

        </div>
    );
};

export default RecordAndPlayAudio;
