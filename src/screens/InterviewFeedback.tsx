import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { AnimatedWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { interviewSessionAtom } from "@/store/interview";
import { screenAtom } from "@/store/screens";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Target
} from "lucide-react";

interface FeedbackSection {
  stage: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const InterviewFeedback: React.FC = () => {
  const interviewSession = useAtomValue(interviewSessionAtom);
  const [, setScreenState] = useAtom(screenAtom);
  const [overallScore, setOverallScore] = useState(0);
  const [stageFeedback, setStageFeedback] = useState<FeedbackSection[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(true);

  useEffect(() => {
    if (interviewSession) {
      generateFeedback();
    }
  }, [interviewSession]);

  const generateFeedback = async () => {
    setIsGeneratingFeedback(true);
    
    // Simulate AI feedback generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock feedback data - in real implementation, this would come from AI analysis
    const mockFeedback: FeedbackSection[] = [
      {
        stage: "Introductory",
        score: 85,
        feedback: "Great introduction! You clearly articulated your background and career goals.",
        strengths: ["Clear communication", "Confident presentation", "Well-structured responses"],
        improvements: ["Could provide more specific examples", "Elaborate on future goals"]
      },
      {
        stage: "Reasoning",
        score: 78,
        feedback: "Good logical thinking approach. You worked through problems systematically.",
        strengths: ["Systematic approach", "Clear problem breakdown", "Good analytical skills"],
        improvements: ["Consider edge cases", "Optimize solution approaches"]
      },
      {
        stage: "Non-Reasoning",
        score: 82,
        feedback: "Excellent personality fit and work style awareness.",
        strengths: ["Self-awareness", "Team collaboration mindset", "Learning attitude"],
        improvements: ["More specific examples of adaptability"]
      },
      {
        stage: "Technical",
        score: 75,
        feedback: "Solid technical knowledge with room for optimization in coding solutions.",
        strengths: ["Good coding fundamentals", "Problem understanding", "Clean code structure"],
        improvements: ["Algorithm optimization", "Time complexity analysis", "Edge case handling"]
      },
      {
        stage: "Behavioral",
        score: 88,
        feedback: "Outstanding behavioral responses with excellent STAR method usage.",
        strengths: ["STAR method application", "Real examples", "Leadership qualities", "Conflict resolution"],
        improvements: ["More quantified results"]
      }
    ];

    setStageFeedback(mockFeedback);
    const avgScore = Math.round(mockFeedback.reduce((sum, section) => sum + section.score, 0) / mockFeedback.length);
    setOverallScore(avgScore);
    setIsGeneratingFeedback(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <Trophy className="size-5 text-green-400" />;
    if (score >= 70) return <Star className="size-5 text-yellow-400" />;
    return <AlertCircle className="size-5 text-red-400" />;
  };

  const handleReturnHome = () => {
    setScreenState({ currentScreen: "intro" });
  };

  const handleRetakeInterview = () => {
    setScreenState({ currentScreen: "instructions" });
  };

  if (isGeneratingFeedback) {
    return (
      <AnimatedWrapper>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <AnimatedTextBlockWrapper>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Analyzing Your Performance</h2>
            <p className="text-gray-300">Our AI is evaluating your responses and generating personalized feedback...</p>
          </div>
        </AnimatedTextBlockWrapper>
      </AnimatedWrapper>
    );
  }

  const interviewDuration = interviewSession?.endTime && interviewSession?.startTime 
    ? Math.round((interviewSession.endTime - interviewSession.startTime) / 1000 / 60)
    : 0;

  return (
    <AnimatedWrapper>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
      <AnimatedTextBlockWrapper>
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getScoreIcon(overallScore)}
              <h1 className="text-3xl font-bold text-white">Interview Complete!</h1>
            </div>
            <p className="text-gray-300">
              Thank you for completing the AI interview. Here's your detailed performance analysis.
            </p>
          </div>

          {/* Overall Score */}
          <div className="bg-black/20 rounded-lg p-6 mb-6 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </div>
                <p className="text-gray-400">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="size-5" />
                  {interviewDuration}m
                </div>
                <p className="text-gray-400">Duration</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="size-5" />
                  {interviewSession?.responses.length || 0}
                </div>
                <p className="text-gray-400">Questions Answered</p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  overallScore >= 85 ? 'bg-green-400' : 
                  overallScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>

          {/* Stage-by-Stage Feedback */}
          <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto">
            {stageFeedback.map((section, index) => (
              <div key={index} className="bg-black/20 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="size-5 text-primary" />
                    {section.stage} Stage
                  </h3>
                  <div className={`text-xl font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{section.feedback}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="size-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {section.strengths.map((strength, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                      <Target className="size-4" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {section.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-gray-300 text-sm">• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleReturnHome} variant="outline">
              Return to Home
            </Button>
            <Button onClick={handleRetakeInterview} className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Take Another Interview
            </Button>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </AnimatedWrapper>
  );
};