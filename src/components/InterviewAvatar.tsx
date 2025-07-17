import React, { useEffect, useState, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { DailyVideo, useVideoTrack, useAudioTrack, useDailyEvent } from "@daily-co/daily-react";
import { conversationAtom } from "@/store/conversation";
import { currentStageAtom, isInterviewActiveAtom } from "@/store/interview";
import { cn } from "@/lib/utils";
import { InterviewStage } from "@/types/interview";

interface AvatarExpression {
  type: 'listening' | 'speaking' | 'thinking' | 'encouraging' | 'neutral';
  intensity: number;
}

const stageIntroductions: Record<InterviewStage, string> = {
  introductory: "Hello! I'm excited to get to know you better. Let's start with some introductory questions about yourself, your interests, and your career goals.",
  reasoning: "Great! Now let's move on to some reasoning questions. I'll present you with logical scenarios and problem-solving challenges.",
  'non-reasoning': "Perfect! Let's shift to some general aptitude questions. These will help me understand your thought process and personality.",
  technical: "Excellent! Now we're entering the technical phase. I'll ask questions specific to your profession and skills. For coding questions, I'll open a code editor for you.",
  behavioral: "Finally, let's discuss some behavioral scenarios. I'll ask about teamwork, conflict resolution, and how you handle various workplace situations."
};

export const InterviewAvatar: React.FC = () => {
  const conversation = useAtomValue(conversationAtom);
  const currentStage = useAtomValue(currentStageAtom);
  const isInterviewActive = useAtomValue(isInterviewActiveAtom);
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>({
    type: 'neutral',
    intensity: 0.5
  });
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [lastStage, setLastStage] = useState<InterviewStage>('introductory');

  // Get remote participant (avatar) video/audio tracks
  const remoteVideoTrack = useVideoTrack(conversation?.conversation_id || '');
  const remoteAudioTrack = useAudioTrack(conversation?.conversation_id || '');

  // Handle stage transitions
  useEffect(() => {
    if (currentStage !== lastStage && isInterviewActive) {
      setLastStage(currentStage);
      announceStageTransition(currentStage);
    }
  }, [currentStage, lastStage, isInterviewActive]);

  const announceStageTransition = useCallback((stage: InterviewStage) => {
    const introduction = stageIntroductions[stage];
    setIsAvatarSpeaking(true);
    setAvatarExpression({ type: 'speaking', intensity: 0.8 });
    
    // Send stage introduction to avatar
    if (conversation?.conversation_id) {
      // This would integrate with your Daily/Tavus API to make avatar speak
      console.log(`Avatar announcing: ${introduction}`);
    }
  }, [conversation]);

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

  const getStageIndicator = () => {
    return (
      <div className="absolute top-4 right-4 bg-black/50 rounded-full px-4 py-2">
        <span className="text-white text-sm font-medium capitalize">
          {currentStage.replace('-', ' ')} Stage
        </span>
      </div>
    );
  };

  if (!conversation?.conversation_url) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Initializing AI Interviewer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-primary/30">
      {/* Main Avatar Video */}
      <DailyVideo
        sessionId={conversation.conversation_id}
        type="video"
        className="w-full h-full object-cover"
      />
      
      {/* Expression Overlay */}
      {getAvatarOverlay()}
      
      {/* Status Indicators */}
      {getStatusIndicator()}
      {getStageIndicator()}
      
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
    </div>
  );
};