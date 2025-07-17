import React, { useState, useRef, useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { conversationAtom } from "@/store/conversation";
import { useDaily } from "@daily-co/daily-react";

interface ChatMessage {
  id: string;
  type: 'avatar' | 'user';
  content: string;
  timestamp: number;
}

const responseSuggestions = [
  {
    type: 'positive',
    icon: ThumbsUp,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    responses: [
      "That's a great point!",
      "Excellent answer!",
      "I'm impressed by your approach.",
      "Very well explained!",
      "That shows good thinking.",
    ]
  },
  {
    type: 'negative',
    icon: ThumbsDown,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    responses: [
      "Let's think about this differently.",
      "Can you elaborate on that?",
      "I'm not sure I follow.",
      "That might need more consideration.",
      "Could you clarify your approach?",
    ]
  },
  {
    type: 'neutral',
    icon: Minus,
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    responses: [
      "Tell me more about that.",
      "What's your reasoning behind this?",
      "How would you handle edge cases?",
      "What other approaches did you consider?",
      "Can you walk me through your process?",
    ]
  }
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'avatar',
      content: "Hello! I'm excited to conduct your interview today. Let's start with a simple question - can you tell me about yourself and your background?",
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversation = useAtomValue(conversationAtom);
  const daily = useDaily();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSuggestionClick = (response: string) => {
    setInputMessage(response);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Toggle microphone
    daily?.setLocalAudio(!isRecording);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-lg border border-white/10">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-white font-semibold">Interview Chat</h3>
        <p className="text-gray-400 text-sm">Real-time conversation with AI interviewer</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Response Suggestions */}
      <div className="p-4 border-t border-white/10">
        <h4 className="text-white text-sm font-medium mb-3">Quick Responses</h4>
        <div className="space-y-2">
          {responseSuggestions.map((suggestion) => (
            <div key={suggestion.type} className="space-y-1">
              <div className={`flex items-center gap-2 p-2 rounded border ${suggestion.color}`}>
                <suggestion.icon className="size-4" />
                <span className="text-xs font-medium capitalize">{suggestion.type}</span>
              </div>
              <div className="grid grid-cols-1 gap-1 ml-6">
                {suggestion.responses.slice(0, 2).map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(response)}
                    className="text-left text-xs text-gray-300 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your response or speak..."
            className="flex-1 bg-black/30 border-white/20 text-white"
          />
          <Button
            onClick={toggleRecording}
            variant="outline"
            size="icon"
            className={isRecording ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500'}
          >
            {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>
          <Button onClick={handleSendMessage} size="icon">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};