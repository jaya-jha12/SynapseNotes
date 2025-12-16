import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBuffer: ArrayBuffer) => void;
  isProcessing?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Convert Blob to ArrayBuffer for the parent to process
        const arrayBuffer = await audioBlob.arrayBuffer();
        onRecordingComplete(arrayBuffer);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex-1 border-2 border-dashed border-purple-400 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-900/20">
      <button 
        onClick={handleToggle} 
        disabled={isProcessing}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isRecording 
            ? 'bg-red-500 animate-pulse ring-4 ring-red-500/30' 
            : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
           <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : isRecording ? (
           <Square className="w-8 h-8 text-white fill-white" />
        ) : (
           <Mic className="w-8 h-8 text-white" />
        )}
      </button>
      <p className="mt-4 font-semibold text-purple-100">
        {isRecording ? 'Recording... (Click to Stop)' : 'Record Live Audio'}
      </p>
      {isRecording && <span className="text-xs text-red-400 mt-1 animate-pulse">● Live</span>}
    </div>
  );
};