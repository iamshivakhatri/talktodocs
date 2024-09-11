import { Mic, PauseCircle, StopCircle, PlayCircle, Download, XCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";


type PlayPauseStopProps = {
    isMediaRecording: boolean;
    isPaused: boolean;
    // elapsedTime: number;
    handleStartMediaRecording: () => void;
    handleStopMediaRecording: () => void;
    handlePauseMediaRecording: () => void;
    handleCancelMediaRecording: () => void;
    formatTime: (seconds: number) => string;
    transcript?: string;
    audioUrl?: string|null;
};

const PlayPauseStop: React.FC<PlayPauseStopProps> = ({
    isMediaRecording,
    isPaused,
    // elapsedTime,
    handleStartMediaRecording,
    handleStopMediaRecording,
    handlePauseMediaRecording,
    handleCancelMediaRecording,
    formatTime,
    transcript="",
    audioUrl= "",

}) => {
    const [elapsedTime, setElapsedTime] = useState(0);


    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    const { mutate, isPending } = useMutation({
        mutationFn: async ({ file_key, file_name }: FileDetails) => {
            const response = await axios.post("/api/create-chat", {
                file_key,
                file_name,
            });
            return response.data;
        },
    });
    

    const handleUploadTranscript = async () => {
        try {
            if (!transcript) {
                toast.error("No transcript available");
                return;
            }

            const data = await uploadTranscriptToS3(transcript);
            mutate(data, {
                onSuccess: ({ chatId }) => {
                    toast.success("Chat created successfully");
                    router.push(`/chat/${chatId}`);
                },
                onError: (error) => {
                    console.error(error);
                    toast.error("Failed to create chat");
                },
            });
        } catch (error) {
            toast.error("Failed to upload transcript");
        }
    };



    return (
        <div>
            <div className="flex gap-4 items-center mb-4">
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

                {isMediaRecording ?(
                <div className='relative'>
                    <p className='text-white'>
                        {isPaused ? 'Paused' : `Recording... ${formatTime(elapsedTime)}`}
                    </p>
                </div>
            ):
            <button onClick={handleUploadTranscript} className="hover:bg-blue-500">
                Upload Transcript and Create Chat
            </button>
            
            }



            </div>

           

            {/* {transcript && (
                <div className='mt-4 p-4 bg-gray-800 rounded-lg'>
                    <p className='text-white'>{transcript}</p>
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
        </div>
    );
};

export default PlayPauseStop;
