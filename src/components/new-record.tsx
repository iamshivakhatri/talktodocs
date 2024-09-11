"use client";
import React, { useState, useRef } from 'react';
import { Mic, StopCircle, Download } from 'lucide-react';

const RecordAndPlayAudio: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            setAudioBlob(audioBlob);
            audioChunksRef.current = []; // Clear chunks for future recordings
        };

        mediaRecorder.start();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-4 items-center mb-4">
                {isRecording ? (
                    <button onClick={handleStopRecording} className="hover:bg-red-500">
                        <StopCircle className="w-8 h-8" />
                    </button>
                ) : (
                    <button onClick={handleStartRecording} className="hover:bg-green-500">
                        <Mic className="w-8 h-8" />
                    </button>
                )}
            </div>

            {audioUrl && (
                <div className="mt-4">
                    <h2 className="text-black mb-2">Recorded Audio:</h2>
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                    {audioBlob && (
                        <a
                            href={audioUrl}
                            download="recorded_audio.webm"
                            className="mt-2 inline-block text-blue-500 hover:underline"
                        >
                            <Download className="inline-block w-6 h-6 mr-1" />
                            Download Audio
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecordAndPlayAudio;
