import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { UserVideoSection } from "@/components/UserVideoSection";
import { TavusAvatarSection } from "@/components/TavusAvatarSection";
import { InterviewChat } from "@/components/InterviewChat";
import { conversationAtom } from "@/store/conversation";
import { createConversation } from "@/api";
import { useDaily } from "@daily-co/daily-react";
import { quantum } from 'ldrs';

quantum.register();

export const MainInterviewInterface: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const daily = useDaily();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = "ccf420ac09f648a4a6d2f4035e7d31e9"; // Your Tavus API token
  

  useEffect(() => {
    initializeInterview();
  }, []);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
      if (err instanceof Error && err.message.includes('401')) {
        setError("Invalid API token. Please check your Tavus API token and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to initialize interview");
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <l-quantum
            size="60"
            speed="1.75"
            color="#3B82F6"
          ></l-quantum>
          <p className="text-gray-600 text-xl mt-6">Setting up your interview...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to AI interviewer</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-gray-800 text-2xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={initializeInterview}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Left Panel - User Video */}
        <div className="col-span-1">
          <UserVideoSection />
        </div>

        {/* Middle Panel - Tavus AI Avatar */}
        <div className="col-span-1">
          <TavusAvatarSection />
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="col-span-1">
          <InterviewChat />
        </div>
      </div>
    </div>
  );
};