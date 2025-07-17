import React, { useEffect, useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import { DailyVideo, useVideoTrack, useAudioTrack, useDailyEvent, useParticipantIds } from "@daily-co/daily-react";
import { conversationAtom } from "@/store/conversation";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { quantum } from 'ldrs';

quantum.register();

interface AvatarExpression {
  type: 'listening' | 'speaking' | 'thinking' | 'encouraging' | 'neutral';
  intensity: number;
}

export const AvatarVideoPanel: React.FC = () => {
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

  const getStatusIndicator = () => {
    return (
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-2">
        <div 
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-300",
            {
              'bg-green-400 animate-pulse': avatarExpression.type === 'listening',
              'bg-blue-400 animate-pulse': avatarExpression.type === 'speaking',
              'bg-yellow-400 animate-pulse': avatarExpression.type === 'thinking',
              'bg-purple-400 animate-pulse': avatarExpression.type === 'encouraging',
              'bg-gray-400': avatarExpression.type === 'neutral'
            }
          )}
        />
        <span className="text-white text-xs font-medium capitalize">
          {avatarExpression.type}
        </span>
      </div>
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would mute the avatar audio
  };

  if (!conversation?.conversation_url || !remoteParticipantIds.length) {
    return (
      <div className="flex flex-col h-full bg-black/20 rounded-lg border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-white font-semibold">AI Interviewer</h3>
          <p className="text-gray-400 text-sm">Connecting to avatar...</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-white text-lg mt-4">Initializing AI Interviewer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">AI Interviewer</h3>
            <p className="text-gray-400 text-sm">Professional Interview Assistant</p>
          </div>
          <Button onClick={toggleMute} variant="ghost" size="icon">
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Avatar Video */}
      <div className="flex-1 relative bg-black">
        <DailyVideo
          sessionId={remoteParticipantIds[0]}
          type="video"
          className="w-full h-full object-cover"
        />
        
        {/* Expression Overlay */}
        {getAvatarOverlay()}
        
        {/* Status Indicators */}
        {getStatusIndicator()}
        
        {/* Avatar Frame Enhancement */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-lg pointer-events-none" />
        
        {/* Subtle Animation Ring */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg transition-all duration-500",
            {
              'shadow-[0_0_30px_rgba(34,197,254,0.3)]': isAvatarSpeaking,
              'shadow-[0_0_15px_rgba(34,197,254,0.1)]': !isAvatarSpeaking
            }
          )}
        />
        
        {/* Microphone Indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div 
            className={cn(
              "w-3 h-3 rounded-full transition-colors duration-300",
              {
                'bg-red-400 animate-pulse': isAvatarSpeaking,
                'bg-gray-400': !isAvatarSpeaking
              }
            )}
          />
          <span className="text-white text-xs">
            {isAvatarSpeaking ? 'Speaking' : 'Listening'}
          </span>
        </div>

        {/* Interview Stage Indicator */}
        <div className="absolute top-4 right-4 bg-black/50 rounded-full px-4 py-2">
          <span className="text-white text-sm font-medium">
            Interview Active
          </span>
        </div>
      </div>
    </div>
  );
};