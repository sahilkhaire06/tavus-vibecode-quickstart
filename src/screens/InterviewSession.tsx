import React, { useEffect, useState, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { DialogWrapper } from "@/components/DialogWrapper";
import { InterviewAvatar } from "@/components/InterviewAvatar";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { 
  interviewSessionAtom, 
  currentStageAtom, 
  isInterviewActiveAtom,
  showCodeEditorAtom,
  userProfileAtom 
} from "@/store/interview";
import { conversationAtom } from "@/store/conversation";
import { screenAtom } from "@/store/screens";
import { generateInterviewQuestions } from "@/api/generateQuestions";
import { InterviewStage, InterviewQuestion, InterviewResponse } from "@/types/interview";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Code, 
  Clock,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useDaily, useLocalSessionId, useVideoTrack, useAudioTrack } from "@daily-co/daily-react";

const stageOrder: InterviewStage[] = ['introductory', 'reasoning', 'non-reasoning', 'technical', 'behavioral'];

export const InterviewSession: React.FC = () => {
  const [interviewSession, setInterviewSession] = useAtom(interviewSessionAtom);
  const [currentStage, setCurrentStage] = useAtom(currentStageAtom);
  const [isInterviewActive, setIsInterviewActive] = useAtom(isInterviewActiveAtom);
  const [showCodeEditor, setShowCodeEditor] = useAtom(showCodeEditorAtom);
  const [, setScreenState] = useAtom(screenAtom);
  
  const userProfile = useAtomValue(userProfileAtom);
  const conversation = useAtomValue(conversationAtom);
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<InterviewQuestion[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const isCameraEnabled = !localVideo.isOff;
  const isMicEnabled = !localAudio.isOff;

  // Initialize interview session
  useEffect(() => {
    if (userProfile && !interviewSession) {
      const newSession = {
        id: `interview_${Date.now()}`,
        userProfile,
        currentStage: 'introductory' as InterviewStage,
        currentQuestionIndex: 0,
        questions: [],
        responses: [],
        startTime: Date.now()
      };
      setInterviewSession(newSession);
      setIsInterviewActive(true);
    }
  }, [userProfile, interviewSession, setInterviewSession, setIsInterviewActive]);

  // Load questions for current stage
  useEffect(() => {
    const loadQuestionsForStage = async () => {
      if (userProfile && currentStage) {
        try {
          const questions = await generateInterviewQuestions(userProfile, currentStage);
          setCurrentQuestions(questions);
          setCurrentQuestionIndex(0);
        } catch (error) {
          console.error('Failed to load questions:', error);
        }
      }
    };

    loadQuestionsForStage();
  }, [currentStage, userProfile]);

  // Calculate stage progress
  useEffect(() => {
    const currentStageIndex = stageOrder.indexOf(currentStage);
    const progress = ((currentStageIndex + 1) / stageOrder.length) * 100;
    setStageProgress(progress);
  }, [currentStage]);

  const toggleVideo = useCallback(() => {
    daily?.setLocalVideo(!isCameraEnabled);
  }, [daily, isCameraEnabled]);

  const toggleAudio = useCallback(() => {
    daily?.setLocalAudio(!isMicEnabled);
  }, [daily, isMicEnabled]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      // Save current response
      if (userResponse.trim() && interviewSession) {
        const response: InterviewResponse = {
          questionId: currentQuestions[currentQuestionIndex].id,
          response: userResponse,
          timestamp: Date.now(),
          duration: Date.now() - sessionStartTime
        };
        
        setInterviewSession(prev => prev ? {
          ...prev,
          responses: [...prev.responses, response]
        } : null);
      }
      
      setCurrentQuestionIndex(prev => prev + 1);
      setUserResponse("");
    } else {
      // Move to next stage or end interview
      moveToNextStage();
    }
  }, [currentQuestionIndex, currentQuestions, userResponse, interviewSession, setInterviewSession, sessionStartTime]);

  const moveToNextStage = useCallback(() => {
    const currentStageIndex = stageOrder.indexOf(currentStage);
    if (currentStageIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentStageIndex + 1];
      setCurrentStage(nextStage);
      setCurrentQuestionIndex(0);
    } else {
      // End interview
      endInterview();
    }
  }, [currentStage, setCurrentStage]);

  const endInterview = useCallback(() => {
    if (interviewSession) {
      setInterviewSession(prev => prev ? {
        ...prev,
        endTime: Date.now()
      } : null);
    }
    setIsInterviewActive(false);
    daily?.leave();
    setScreenState({ currentScreen: "finalScreen" });
  }, [interviewSession, setInterviewSession, setIsInterviewActive, daily, setScreenState]);

  const handleCodeQuestion = useCallback(() => {
    setShowCodeEditor(true);
  }, [setShowCodeEditor]);

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuestions.length - 1;
  const isLastStage = currentStage === 'behavioral';

  if (!interviewSession || !currentQuestion) {
    return (
      <DialogWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg">Loading interview questions...</p>
          </div>
        </div>
      </DialogWrapper>
    );
  }

  return (
    <>
      <DialogWrapper>
        <div className="flex h-full">
          {/* Avatar Section */}
          <div className="w-1/2 p-4">
            <InterviewAvatar />
          </div>

          {/* Interview Panel */}
          <div className="w-1/2 p-4 flex flex-col">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Interview Progress</span>
                <span>{Math.round(stageProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stageProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                {stageOrder.map((stage, index) => (
                  <span 
                    key={stage}
                    className={index <= stageOrder.indexOf(currentStage) ? 'text-primary' : ''}
                  >
                    {stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Question */}
            <div className="flex-1 flex flex-col">
              <div className="bg-black/20 rounded-lg p-4 mb-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-4 text-primary" />
                  <span className="text-sm text-gray-400">
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                  </span>
                  {currentQuestion.type === 'code' && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                      Coding
                    </span>
                  )}
                </div>
                <p className="text-white text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
                {currentQuestion.expectedDuration && (
                  <p className="text-gray-400 text-sm mt-2">
                    Expected time: {Math.floor(currentQuestion.expectedDuration / 60)}:{(currentQuestion.expectedDuration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>

              {/* Response Area */}
              <div className="flex-1 mb-4">
                {currentQuestion.type === 'code' ? (
                  <div className="text-center">
                    <Button onClick={handleCodeQuestion} className="mb-4">
                      <Code className="size-4 mr-2" />
                      Open Code Editor
                    </Button>
                    <p className="text-gray-400 text-sm">
                      Click above to open the code editor for this programming question
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Speak your answer or type your response here..."
                    className="w-full h-32 bg-black/30 border border-white/20 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    onClick={toggleAudio}
                    variant="outline"
                    size="icon"
                    className={isMicEnabled ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}
                  >
                    {isMicEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                  </Button>
                  <Button
                    onClick={toggleVideo}
                    variant="outline"
                    size="icon"
                    className={isCameraEnabled ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}
                  >
                    {isCameraEnabled ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={endInterview} variant="destructive" size="sm">
                    <PhoneOff className="size-4 mr-2" />
                    End Interview
                  </Button>
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={currentQuestion.type === 'text' && !userResponse.trim()}
                  >
                    {isLastQuestion && isLastStage ? (
                      <>
                        <CheckCircle className="size-4 mr-2" />
                        Complete Interview
                      </>
                    ) : (
                      <>
                        <ArrowRight className="size-4 mr-2" />
                        {isLastQuestion ? 'Next Stage' : 'Next Question'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogWrapper>

      {/* Code Editor Modal */}
      <CodeEditor />
    </>
  );
};