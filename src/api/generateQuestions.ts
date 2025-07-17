import { UserProfile, InterviewQuestion, InterviewStage } from "@/types/interview";

export const generateInterviewQuestions = async (
  userProfile: UserProfile,
  stage: InterviewStage
): Promise<InterviewQuestion[]> => {
  const basePrompt = `Generate interview questions for a ${userProfile.profession} candidate named ${userProfile.fullName}.
  
  Candidate Profile:
  - Skills: ${userProfile.skills.join(', ')}
  - Education: ${userProfile.education.degree} from ${userProfile.education.college} (${userProfile.education.year})
  - Projects: ${userProfile.projects.map(p => `${p.name} (${p.techUsed.join(', ')}): ${p.description}`).join('; ')}
  - Certificates: ${userProfile.certificates.map(c => `${c.courseName} from ${c.platform}`).join('; ')}
  
  Stage: ${stage}`;

  const stageSpecificPrompts: Record<InterviewStage, string> = {
    introductory: `${basePrompt}
    
    Generate 3-4 introductory questions that help understand the candidate's background, interests, and career goals. Focus on:
    - Personal introduction and motivation
    - Career aspirations
    - Interest in the role/company
    - General background questions`,

    reasoning: `${basePrompt}
    
    Generate 4-5 logical reasoning questions that test problem-solving abilities. Include:
    - Logical puzzles
    - Pattern recognition
    - Analytical thinking scenarios
    - Mathematical reasoning (if relevant to role)`,

    'non-reasoning': `${basePrompt}
    
    Generate 3-4 general aptitude questions focusing on:
    - Personality assessment
    - Work style preferences
    - General knowledge relevant to the field
    - Situational judgment (non-technical)`,

    technical: `${basePrompt}
    
    Generate 5-6 technical questions specific to their skills and profession. Include:
    - Technology-specific questions based on their skills
    - At least 2 coding problems (mark with type: 'code')
    - System design or architecture questions
    - Best practices and methodologies
    - Questions related to their project experience`,

    behavioral: `${basePrompt}
    
    Generate 4-5 behavioral questions using STAR method scenarios:
    - Teamwork and collaboration
    - Conflict resolution
    - Leadership and initiative
    - Handling pressure and deadlines
    - Adaptability and learning`
  };

  // In a real implementation, this would call your AI service (OpenAI, etc.)
  // For now, we'll return mock questions based on the stage
  return generateMockQuestions(userProfile, stage);
};

const generateMockQuestions = (userProfile: UserProfile, stage: InterviewStage): InterviewQuestion[] => {
  const baseQuestions: Record<InterviewStage, InterviewQuestion[]> = {
    introductory: [
      {
        id: `intro_1_${Date.now()}`,
        stage: 'introductory',
        question: `Hello ${userProfile.fullName}! Please tell me about yourself and what interests you about the ${userProfile.profession} role.`,
        type: 'text',
        expectedDuration: 120
      },
      {
        id: `intro_2_${Date.now() + 1}`,
        stage: 'introductory',
        question: "What motivated you to pursue a career in this field, and where do you see yourself in the next 5 years?",
        type: 'text',
        expectedDuration: 90
      },
      {
        id: `intro_3_${Date.now() + 2}`,
        stage: 'introductory',
        question: `I see you have experience with ${userProfile.skills.slice(0, 3).join(', ')}. Which of these do you enjoy working with most and why?`,
        type: 'text',
        expectedDuration: 60
      }
    ],
    reasoning: [
      {
        id: `reason_1_${Date.now()}`,
        stage: 'reasoning',
        question: "You have 8 balls, and one of them is slightly heavier than the others. Using a balance scale only twice, how would you identify the heavier ball?",
        type: 'text',
        expectedDuration: 180
      },
      {
        id: `reason_2_${Date.now() + 1}`,
        stage: 'reasoning',
        question: "If you're in a room with 3 light switches, and only one controls a light bulb in another room, how would you determine which switch controls the bulb with only one trip to the other room?",
        type: 'text',
        expectedDuration: 120
      },
      {
        id: `reason_3_${Date.now() + 2}`,
        stage: 'reasoning',
        question: "A company's revenue increased by 20% in Q1, decreased by 15% in Q2, and increased by 10% in Q3. What's the overall percentage change from the beginning of Q1 to the end of Q3?",
        type: 'text',
        expectedDuration: 90
      }
    ],
    'non-reasoning': [
      {
        id: `nonreason_1_${Date.now()}`,
        stage: 'non-reasoning',
        question: "How do you typically approach learning a new technology or skill? Can you give me an example?",
        type: 'text',
        expectedDuration: 90
      },
      {
        id: `nonreason_2_${Date.now() + 1}`,
        stage: 'non-reasoning',
        question: "What's your preferred work environment? Do you work better independently or as part of a team?",
        type: 'text',
        expectedDuration: 60
      },
      {
        id: `nonreason_3_${Date.now() + 2}`,
        stage: 'non-reasoning',
        question: "How do you stay updated with the latest trends and developments in your field?",
        type: 'text',
        expectedDuration: 75
      }
    ],
    technical: [
      {
        id: `tech_1_${Date.now()}`,
        stage: 'technical',
        question: `Based on your experience with ${userProfile.skills[0] || 'programming'}, can you explain the key concepts and best practices you follow?`,
        type: 'text',
        expectedDuration: 120
      },
      {
        id: `tech_2_${Date.now() + 1}`,
        stage: 'technical',
        question: "Write a function that finds the two numbers in an array that add up to a specific target sum. Optimize for time complexity.",
        type: 'code',
        expectedDuration: 300,
        keywords: ['algorithm', 'optimization', 'array', 'time complexity']
      },
      {
        id: `tech_3_${Date.now() + 2}`,
        stage: 'technical',
        question: `Tell me about the ${userProfile.projects[0]?.name || 'most challenging project'} you've worked on. What technologies did you use and what challenges did you face?`,
        type: 'text',
        expectedDuration: 180
      },
      {
        id: `tech_4_${Date.now() + 3}`,
        stage: 'technical',
        question: "Implement a function to reverse a linked list. Explain your approach and discuss the time and space complexity.",
        type: 'code',
        expectedDuration: 240,
        keywords: ['data structures', 'linked list', 'algorithms']
      }
    ],
    behavioral: [
      {
        id: `behav_1_${Date.now()}`,
        stage: 'behavioral',
        question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation and what was the outcome?",
        type: 'text',
        expectedDuration: 150,
        keywords: ['teamwork', 'conflict resolution', 'communication']
      },
      {
        id: `behav_2_${Date.now() + 1}`,
        stage: 'behavioral',
        question: "Describe a situation where you had to meet a tight deadline. How did you prioritize your tasks and manage your time?",
        type: 'text',
        expectedDuration: 120,
        keywords: ['time management', 'pressure', 'prioritization']
      },
      {
        id: `behav_3_${Date.now() + 2}`,
        stage: 'behavioral',
        question: "Can you share an example of when you had to learn something completely new for a project? How did you approach it?",
        type: 'text',
        expectedDuration: 135,
        keywords: ['learning', 'adaptability', 'growth mindset']
      },
      {
        id: `behav_4_${Date.now() + 3}`,
        stage: 'behavioral',
        question: "Tell me about a time when you took initiative on a project or proposed an improvement. What was the result?",
        type: 'text',
        expectedDuration: 140,
        keywords: ['leadership', 'initiative', 'innovation']
      }
    ]
  };

  return baseQuestions[stage] || [];
};