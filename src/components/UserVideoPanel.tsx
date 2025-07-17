import React from "react";
import { useLocalSessionId, useVideoTrack, useAudioTrack } from "@daily-co/daily-react";
import Video from "@/components/Video";
import { Button } from "@/components/ui/button";
import { Video as VideoIcon, VideoOff, Mic, MicOff, Settings } from "lucide-react";
import { useDaily } from "@daily-co/daily-react";
import { cn } from "@/lib/utils";

export const UserVideoPanel: React.FC = () => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);

  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;

  const toggleVideo = () => {
    daily?.setLocalVideo(!isCameraEnabled);
  };

  const toggleAudio = () => {
    daily?.setLocalAudio(!isMicEnabled);
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Your Video</h3>
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-900">
        {localSessionId ? (
          <Video
            id={localSessionId}
            className="w-full h-full"
            tileClassName="!object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <VideoOff className="size-12 text-gray-500 mb-2 mx-auto" />
              <p className="text-gray-400">Camera not available</p>
            </div>
          </div>
        )}

        {/* Video Status Overlay */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
            isCameraEnabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isCameraEnabled ? "bg-green-400 animate-pulse" : "bg-red-400"
            )} />
            {isCameraEnabled ? "Live" : "Camera Off"}
          </div>
        </div>

        {/* Audio Status */}
        <div className="absolute top-4 right-4">
          <div className={cn(
            "p-2 rounded-full",
            isMicEnabled ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            {isMicEnabled ? (
              <Mic className="size-4 text-green-400" />
            ) : (
              <MicOff className="size-4 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-white/10">
        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleVideo}
            variant="outline"
            size="icon"
            className={cn(
              "border-2",
              isCameraEnabled 
                ? "bg-green-500/20 border-green-500 hover:bg-green-500/30" 
                : "bg-red-500/20 border-red-500 hover:bg-red-500/30"
            )}
          >
            {isCameraEnabled ? (
              <VideoIcon className="size-4" />
            ) : (
              <VideoOff className="size-4" />
            )}
          </Button>
          
          <Button
            onClick={toggleAudio}
            variant="outline"
            size="icon"
            className={cn(
              "border-2",
              isMicEnabled 
                ? "bg-green-500/20 border-green-500 hover:bg-green-500/30" 
                : "bg-red-500/20 border-red-500 hover:bg-red-500/30"
            )}
          >
            {isMicEnabled ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400">
            {isCameraEnabled && isMicEnabled ? "Ready for interview" : "Check your camera and microphone"}
          </p>
        </div>
      </div>
    </div>
  );
};