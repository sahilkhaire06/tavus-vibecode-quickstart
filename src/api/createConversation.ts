import { IConversation } from "@/types";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  const contextString = "You are a professional AI interviewer conducting a comprehensive interview. Ask thoughtful questions across different areas including introductory questions, reasoning, technical skills, and behavioral scenarios. Provide encouraging feedback and maintain a conversational tone. Keep responses concise and engaging.";
  
  const payload = {
    persona_id: "pd43ffef",
    custom_greeting: "Hello! I'm excited to conduct your interview today. I'll be asking you questions across different areas including your background, technical skills, and problem-solving abilities. Let's begin with some introductory questions. Could you tell me about yourself and what drives you in your career?",
    conversational_context: contextString,
    properties: {
      max_call_duration: 3600,
      participant_left_timeout: 60,
      participant_absent_timeout: 300
    }
  };
  
  console.log('Sending payload to API:', payload);
  
  try {
    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Success Response:', data);
    return data;
  } catch (error) {
    console.error('Create conversation error:', error);
    throw error;
  }
};
