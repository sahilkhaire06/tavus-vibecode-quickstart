import React, { useState, useRef, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Download, CheckCircle, Info, AlertCircle } from "lucide-react";
import { conversationAtom } from "@/store/conversation";
import { useDaily, useDailyEvent } from "@daily-co/daily-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  type: 'avatar' | 'user';
  content: string;
  timestamp: number;
  stage?: string;
}

const responseGuidelines = [
  {
    type: 'Strong Response',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: "That's a great systematic approach! A strong answer would involve a methodical process like checking the network requests, examining browser console logs for errors, verifying the database connection and queries, and then potentially looking at server logs or the search algorithm itself. Thinking about user impact, like displaying a friendly error message, is also a great plus. 👍"
  },
  {
    type: 'Acceptable Response',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: "Checking the code related to the search functionality is a good starting point. An acceptable answer might focus on a specific area like the backend code or the frontend JavaScript, but ideally would mention a few key areas to investigate."
  },
  {
    type: 'Avoid in Response',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: "Avoid simply saying \"I'd Google it\" or \"I'd ask a senior developer.\" While collaboration is important, this scenario is about demonstrating *your* problem-solving process. Also, avoid jumping to conclusions without a systematic approach. 🤔"
  }
];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'avatar',
    content: "Hello! 👋 I'm excited to conduct your interview today! I'll be asking you questions across different areas to better understand your background and capabilities. Could you start by telling me about yourself and what drives you in your career?",
    timestamp: Date.now() - 300000,
    stage: 'Introductory'
  },
];

export const InterviewChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentStage, setCurrentStage] = useState("Reasoning");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversation = useAtomValue(conversationAtom);
  const daily = useDaily();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for avatar messages
  useDailyEvent(
    "app-message",
    React.useCallback((event: any) => {
      if (event.data?.event_type === "avatar_message") {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'avatar',
          content: event.data.content,
          timestamp: Date.now(),
          stage: event.data.stage || currentStage
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }, [currentStage])
  );

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage("");
      
      // Send message to avatar via Daily
      if (conversation?.conversation_id) {
        daily?.sendAppMessage({
          message_type: "conversation",
          event_type: "conversation.echo",
          conversation_id: conversation.conversation_id,
          properties: {
            modality: "text",
            text: inputMessage,
          },
        });
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    daily?.setLocalAudio(!isRecording);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Interview Chat</h2>
          <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
            {currentStage}
          </span>
        </div>
        <Button variant="ghost" size="icon">
          <Download className="size-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === 'avatar' && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  AI
                </div>
                <div className="flex-1">
                  {message.stage && (
                    <div className="text-xs font-medium text-purple-600 mb-1">
                      {message.stage}
                    </div>
                  )}
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 max-w-[90%]">
                    <p className="text-gray-800 text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {message.type === 'user' && (
              <div className="flex justify-end">
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="bg-gray-800 text-white rounded-lg p-3">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-gray-300 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                    👤
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Response Guidelines */}
      <div className="p-4 bg-white border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Response Guidelines</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {responseGuidelines.map((guideline, index) => (
            <div key={index} className={cn(
              "p-3 rounded-lg border",
              guideline.bgColor,
              guideline.borderColor
            )}>
              <div className="flex items-center gap-2 mb-2">
                <guideline.icon className={cn("size-4", guideline.color)} />
                <span className={cn("text-sm font-medium", guideline.color)}>
                  {guideline.type}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                {guideline.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak your response..."
            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button
            onClick={toggleRecording}
            variant="outline"
            size="icon"
            className={cn(
              "border-2",
              isRecording 
                ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100" 
                : "bg-green-50 border-green-300 text-green-600 hover:bg-green-100"
            )}
          >
            {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};