export interface UserProfile {
  fullName: string;
  profession: string;
  skills: string[];
  education: {
    degree: string;
    college: string;
    year: string;
  };
  projects: Array<{
    name: string;
    techUsed: string[];
    description: string;
  }>;
  certificates: Array<{
    courseName: string;
    platform: string;
  }>;
}

export interface InterviewQuestion {
  id: string;
  stage: InterviewStage;
  question: string;
  type: 'text' | 'code';
  expectedDuration?: number;
  keywords?: string[];
}

export type InterviewStage = 
  | 'introductory' 
  | 'reasoning' 
  | 'non-reasoning' 
  | 'technical' 
  | 'behavioral';

export interface InterviewResponse {
  questionId: string;
  response: string;
  code?: string;
  language?: string;
  timestamp: number;
  duration: number;
}

export interface InterviewSession {
  id: string;
  userProfile: UserProfile;
  currentStage: InterviewStage;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  startTime: number;
  endTime?: number;
  feedback?: string;
  score?: number;
}