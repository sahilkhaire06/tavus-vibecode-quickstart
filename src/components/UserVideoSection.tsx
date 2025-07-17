import React from "react";
import { useLocalSessionId, useVideoTrack, useAudioTrack } from "@daily-co/daily-react";
import Video from "@/components/Video";
import { Button } from "@/components/ui/button";
import { Video as VideoIcon, VideoOff, Mic, MicOff, Settings, User } from "lucide-react";
import { useDaily } from "@daily-co/daily-react";
import { cn } from "@/lib/utils";

export const UserVideoSection: React.FC = () => {
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
    <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden relative">
      {/* Video Area */}
      <div className="flex-1 relative bg-black">
        {localSessionId && isCameraEnabled ? (
          <Video
            id={localSessionId}
            className="w-full h-full"
            tileClassName="!object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <User className="size-10 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm">Camera is off</p>
            </div>
          </div>
        )}

        {/* User Label */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <User className="size-4 text-white" />
            <span className="text-white text-sm font-medium">You</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className={cn(
            "p-2 rounded-full backdrop-blur-sm",
            isCameraEnabled ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            {isCameraEnabled ? (
              <VideoIcon className="size-4 text-green-400" />
            ) : (
              <VideoOff className="size-4 text-red-400" />
            )}
          </div>
          <div className={cn(
            "p-2 rounded-full backdrop-blur-sm",
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleVideo}
            variant="outline"
            size="icon"
            className={cn(
              "border-2 bg-black/50 backdrop-blur-sm",
              isCameraEnabled 
                ? "border-green-500 text-green-400 hover:bg-green-500/20" 
                : "border-red-500 text-red-400 hover:bg-red-500/20"
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
              "border-2 bg-black/50 backdrop-blur-sm",
              isMicEnabled 
                ? "border-green-500 text-green-400 hover:bg-green-500/20" 
                : "border-red-500 text-red-400 hover:bg-red-500/20"
            )}
          >
            {isMicEnabled ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="border-2 border-gray-500 text-gray-400 hover:bg-gray-500/20 bg-black/50 backdrop-blur-sm"
          >
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};