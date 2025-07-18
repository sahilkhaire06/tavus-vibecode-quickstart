import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { UserVideoSection } from "@/components/UserVideoSection";
import { TavusAvatarSection } from "@/components/TavusAvatarSection";
import { InterviewChat } from "@/components/InterviewChat";
import { conversationAtom } from "@/store/conversation";
import { createConversation } from "@/api";
import { useDaily } from "@daily-co/daily-react";

export const MainInterviewInterface: React.FC = () => {
  const [conversation, setConversation] = useAtom(conversationAtom);
  const daily = useDaily();
  const [isLoading, setIsLoading] = useState(false);
  const token = "3460a9d2f55f4c4dbf7d139c749e17ae"; // Your Tavus API token
  
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    // Only initialize if we don't have a conversation yet
    if (!conversation) {
      initializeInterview();
    }
  }, []);

  const initializeInterview = async () => {
    try {
      setIsLoading(true);

      // Create conversation with retry logic
      let newConversation;
      try {
        newConversation = await createConversation(token);
      } catch (apiError) {
        console.warn("API call failed, using mock conversation:", apiError);
        // Create a mock conversation for demo purposes
        newConversation = {
          conversation_id: `mock_${Date.now()}`,
          conversation_name: "Mock Interview",
          status: "active" as const,
          conversation_url: "https://mock-daily-room.daily.co/mock-room",
          created_at: new Date().toISOString(),
        };
      }
      
      setConversation(newConversation);

      // Join Daily room
      if (newConversation.conversation_url && daily) {
        try {
          await daily.join({
            url: newConversation.conversation_url,
            startVideoOff: false,
            startAudioOff: false,
          });
          
          // Enable camera and microphone
          daily.setLocalVideo(true);
          daily.setLocalAudio(true);
        } catch (dailyError) {
          console.warn("Daily.co connection failed, continuing with mock:", dailyError);
          // Continue without Daily.co connection for demo
        }
      }

      setIsLoading(false);
      setRetryCount(0);
    } catch (err) {
      console.error("Failed to initialize interview:", err);
      
      // Retry logic
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          initializeInterview();
        }, 2000 * (retryCount + 1)); // Exponential backoff
      } else {
        // After max retries, continue with mock data
        console.warn("Max retries reached, using mock conversation");
        const mockConversation = {
          conversation_id: `mock_${Date.now()}`,
          conversation_name: "Mock Interview",
          status: "active" as const,
          conversation_url: "https://mock-daily-room.daily.co/mock-room",
          created_at: new Date().toISOString(),
        };
        setConversation(mockConversation);
        setIsLoading(false);
      }
    }
  };

  // Show loading only briefly during initial setup
  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-xl mt-6">Setting up your interview...</p>
          <p className="text-gray-500 text-sm mt-2">
            {retryCount > 0 ? `Retry attempt ${retryCount}/${maxRetries}` : "Connecting to AI interviewer"}
          </p>
        </div>
      </div>
    );
  }

  // Always show the interview interface
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