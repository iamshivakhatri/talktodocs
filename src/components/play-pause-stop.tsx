import {
  Mic,
  PauseCircle,
  StopCircle,
  PlayCircle,
  XCircle,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

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
  audioUrl?: string | null;
};

type FileDetails = {
  file_key: string;
  file_name: string;
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
  transcript = "",
  audioUrl = "",
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const router = useRouter();
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [uploadButton, setUploadButton] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMediaRecording) {
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

      const response = await axios.post("/api/transcript-chat", {
        transcript, // sending the transcript in the request body
      });
      const data = response.data;

      if (!data?.file_key || !data?.file_name) {
        toast.error("Failed to upload file");
        return;
      }
      mutate(data, {
        onSuccess: ({ chatId }) => {
          toast.success("Chat created successfully");
          router.push(`/chat/${chatId}`);
          setIsUploading(false);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to create chat");
          setIsUploading(false);
        },
      });
    } catch (error) {
      toast.error("Failed to upload transcript");
    }
  };

  return (
    <div>
      {isUploading? (
        <div className="flex gap-4 items-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
          <p className="text-white">Uploading...</p>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          {isMediaRecording ? (
            <>
              <button
                onClick={() => {
                  handleStopMediaRecording();
                  setUploadButton(true);
                  setElapsedTime(0);
                }}
                className="hover:bg-red-500 p-2 rounded-full transition ease-in-out duration-300"
              >
                <StopCircle className="w-8 h-8" />
              </button>
              <button
                onClick={() => {
                  handlePauseMediaRecording();
                  setUploadButton(false);
                }}
                className={`hover:bg-yellow-500 p-2 rounded-full transition ease-in-out duration-300 ${
                  !isMediaRecording ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isPaused ? (
                  <PlayCircle className="w-8 h-8" />
                ) : (
                  <PauseCircle className="w-8 h-8" />
                )}
              </button>
              <button
                onClick={handleCancelMediaRecording}
                className="hover:bg-gray-500 p-2 rounded-full transition ease-in-out duration-300"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </>
          ) : (
            <button
              onClick={handleStartMediaRecording}
              className="hover:bg-green-500 p-2 rounded-full transition ease-in-out duration-300"
            >
              <Mic className="w-8 h-8" />
            </button>
          )}

          {isMediaRecording ? (
            <div className="relative">
              <p className="text-white">
                {isPaused
                  ? "Paused"
                  : `Recording... ${formatTime(elapsedTime)}`}
              </p>
            </div>
          ) : (
            uploadButton &&
            transcript && (
              <>
                <Button
                  onClick={()=>{
                    handleUploadTranscript()
                    setIsUploading(true);
                    handleCancelMediaRecording()
                }}
                  className="hover:bg-blue-500 p-3 rounded-md transition ease-in-out duration-300"
                >
                  Create Chat
                </Button>

                <button
                  onClick={() => {
                    setUploadButton(false);
                  }}
                  className="cursor-pointer"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </>
            )
          )}
        </div>
      )}

      {/* Animated Chat Icon (Message Icon) that appears after recording */}
      {isMediaRecording && !isTranscriptOpen && (
        <button
          onClick={() => setIsTranscriptOpen(true)}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
        >
          <div className="relative w-6 h-6 flex justify-center items-center">
            {/* Pulsing effect to indicate recording */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            {/* Message Circle Icon */}
            <div className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 text-center">
              <Mic className="w-6 h-6 text-white" /> {/* Chat/Message icon */}
            </div>
          </div>
        </button>
      )}

      {/* Transcript Box with Close Button */}
      {isMediaRecording && isTranscriptOpen && (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-lg max-w-xs max-h-24 overflow-y-auto transition-opacity duration-300 ease-in-out shadow-lg">
          <div className="flex justify-between items-center mb-2">
            {transcript ? (
              <p className="text-white text-sm">Transcript</p>
            ) : (
              <p className="text-white text-sm">No Transcript Available</p>
            )}
            <button
              onClick={() => setIsTranscriptOpen(false)}
              className="hover:bg-red-500 p-1 rounded-full"
            >
              <XCircle className="w-6 h-6 text-white" /> {/* Close icon */}
            </button>
          </div>
          <div className="text-white text-sm">
            <p>{transcript}</p>
          </div>
        </div>
      )}

      {/* TODO: ADD LOADING KIND OF SIGN AND REMOVE THE AUDIO ONCE UPLOADED */}

      {/*** 
            {isMediaRecording && !isTranscriptOpen && (
            <button onClick={() => setIsTranscriptOpen(true)} className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" /> 
            </button>
            )}

            {isMediaRecording && isTranscriptOpen && (
            <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-lg max-w-xs max-h-24 overflow-y-auto transition-opacity duration-300 ease-in-out shadow-lg">
                <div className="flex justify-between items-center mb-2">
                <p className="text-white text-sm">Transcript</p>
                <button onClick={() => setIsTranscriptOpen(false)} className="hover:bg-red-500 p-1 rounded-full">
                    <XCircle className="w-4 h-4 text-white" /> 
                </button>
                </div>
                <div className="text-white text-sm">
                <p>{transcript}</p>
                </div>
            </div>
            )}

          **/}

      {/* Transcript Box - ABSOLUTE positioning
            {transcript && (
            <div className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-lg max-w-xs max-h-24 overflow-y-auto transition-opacity duration-300 ease-in-out  shadow-lg">
                <p className="text-white text-sm">{transcript}</p>
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
