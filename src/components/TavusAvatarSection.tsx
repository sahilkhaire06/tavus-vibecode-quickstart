import React, { useEffect, useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import { DailyVideo, useVideoTrack, useAudioTrack, useDailyEvent, useParticipantIds } from "@daily-co/daily-react";
import { conversationAtom } from "@/store/conversation";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarExpression {
  type: 'listening' | 'speaking' | 'thinking' | 'encouraging' | 'neutral';
  intensity: number;
}

export const TavusAvatarSection: React.FC = () => {
  const conversation = useAtomValue(conversationAtom);
  const remoteParticipantIds = useParticipantIds({ filter: "remote" });
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>({
    type: 'neutral',
    intensity: 0.5
  });
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const remoteVideoTrack = useVideoTrack(remoteParticipantIds[0]);
  const remoteAudioTrack = useAudioTrack(remoteParticipantIds[0]);

  // Listen for avatar speech events
  useDailyEvent(
    "participant-updated",
    useCallback((event: any) => {
      if (event.participant?.audio) {
        setIsAvatarSpeaking(true);
        setAvatarExpression({ type: 'speaking', intensity: 0.9 });
      } else {
        setIsAvatarSpeaking(false);
        setAvatarExpression({ type: 'listening', intensity: 0.6 });
      }
    }, [])
  );

  // Handle user speech detection for avatar reactions
  useDailyEvent(
    "app-message",
    useCallback((event: any) => {
      if (event.data?.event_type === "user_speaking") {
        setAvatarExpression({ type: 'listening', intensity: 0.7 });
      } else if (event.data?.event_type === "user_finished_speaking") {
        setAvatarExpression({ type: 'thinking', intensity: 0.5 });
        setTimeout(() => {
          setAvatarExpression({ type: 'speaking', intensity: 0.8 });
        }, 1000);
      } else if (event.data?.event_type === "positive_keyword") {
        setAvatarExpression({ type: 'encouraging', intensity: 0.9 });
      }
    }, [])
  );

  const getAvatarOverlay = () => {
    switch (avatarExpression.type) {
      case 'listening':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none" />
        );
      case 'speaking':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
        );
      case 'thinking':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
        );
      case 'encouraging':
        return (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
        );
      default:
        return null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Always show the avatar interface, even if not connected
  const showMockAvatar = !conversation?.conversation_url || !remoteParticipantIds.length;

  if (showMockAvatar) {
    return (
      <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden relative">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="size-16 text-white" />
            </div>
            <p className="text-white text-lg">AI Interviewer Ready</p>
            <p className="text-gray-300 text-sm mt-2">Interview session active</p>
          </div>
        </div>
        
        {/* AI Interviewer Label */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-white" />
            <span className="text-white text-sm font-medium">AI Interviewer</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-xs font-medium">Active</span>
        </div>

        {/* Audio Control */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="bg-black/70 backdrop-blur-sm hover:bg-black/90"
          >
            {isMuted ? (
              <VolumeX className="size-4 text-white" />
            ) : (
              <Volume2 className="size-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black rounded-lg overflow-hidden relative">
      {/* Avatar Video */}
      <div className="flex-1 relative">
        <DailyVideo
          sessionId={remoteParticipantIds[0]}
          type="video"
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Expression Overlay */}
        {getAvatarOverlay()}
        
        {/* AI Interviewer Label */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-white" />
            <span className="text-white text-sm font-medium">AI Interviewer</span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2">
          <div 
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              {
                'bg-green-500 animate-pulse': avatarExpression.type === 'listening',
                'bg-blue-500 animate-pulse': avatarExpression.type === 'speaking',
                'bg-yellow-500 animate-pulse': avatarExpression.type === 'thinking',
                'bg-purple-500 animate-pulse': avatarExpression.type === 'encouraging',
                'bg-gray-400': avatarExpression.type === 'neutral'
              }
            )}
          />
          <span className="text-white text-xs font-medium capitalize">
            {avatarExpression.type}
          </span>
        </div>

        {/* Audio Control */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="bg-black/70 backdrop-blur-sm hover:bg-black/90"
          >
            {isMuted ? (
              <VolumeX className="size-4 text-white" />
            ) : (
              <Volume2 className="size-4 text-white" />
            )}
          </Button>
        </div>

        {/* Subtle Animation Ring */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none",
            {
              'shadow-[0_0_20px_rgba(59,130,246,0.3)]': isAvatarSpeaking,
              'shadow-[0_0_10px_rgba(59,130,246,0.1)]': !isAvatarSpeaking
            }
          )}
        />
      </div>
    </div>
  );
};