import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { DialogWrapper } from "@/components/DialogWrapper";
import { UserVideoPanel } from "@/components/UserVideoPanel";
import { AvatarVideoPanel } from "@/components/AvatarVideoPanel";
import { ChatInterface } from "@/components/ChatInterface";
import { conversationAtom } from "@/store/conversation";
import { screenAtom } from "@/store/screens";
import { createConversation } from "@/api";
import { apiTokenAtom } from "@/store/tokens";
import { useDaily } from "@daily-co/daily-react";
import { Button } from "@/components/ui/button";
import { PhoneOff, Settings } from "lucide-react";
import { quantum } from 'ldrs';

quantum.register();

export const InterviewInterface: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const token = useAtomValue(apiTokenAtom);
  const daily = useDaily();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      
      if (!token) {
        throw new Error("API token is required");
      }

      // Create conversation
      const newConversation = await createConversation(token);
      setConversation(newConversation);

      // Join Daily room
      if (newConversation.conversation_url) {
        await daily?.join({
          url: newConversation.conversation_url,
          startVideoOff: false,
          startAudioOff: false,
        });
        
        // Enable camera and microphone
        daily?.setLocalVideo(true);
        daily?.setLocalAudio(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to initialize interview:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize interview");
      setIsLoading(false);
    }
  };

  const handleEndInterview = () => {
    daily?.leave();
    daily?.destroy();
    setConversation(null);
    setScreenState({ currentScreen: "intro" });
  };

  const handleSettings = () => {
    setScreenState({ currentScreen: "settings" });
  };

  if (isLoading) {
    return (
      <DialogWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <l-quantum
              size="45"
              speed="1.75"
              color="white"
            ></l-quantum>
            <p className="text-white text-lg mt-4">Setting up your interview...</p>
          </div>
        </div>
      </DialogWrapper>
    );
  }

  if (error) {
    return (
      <DialogWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-white text-xl mb-2">Connection Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={initializeInterview}>Try Again</Button>
          </div>
        </div>
      </DialogWrapper>
    );
  }

  return (
    <DialogWrapper>
      <div className="absolute inset-0 p-4">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-xl font-semibold">AI Interview Session</h1>
          <div className="flex gap-2">
            <Button onClick={handleSettings} variant="outline" size="icon">
              <Settings className="size-4" />
            </Button>
            <Button onClick={handleEndInterview} variant="destructive" size="icon">
              <PhoneOff className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-80px)]">
          {/* Left Column - User Video */}
          <div className="col-span-1">
            <UserVideoPanel />
          </div>

          {/* Middle Column - Avatar Video */}
          <div className="col-span-1">
            <AvatarVideoPanel />
          </div>

          {/* Right Column - Chat Interface */}
          <div className="col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
};