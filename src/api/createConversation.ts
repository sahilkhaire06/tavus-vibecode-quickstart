import { IConversation } from "@/types";
import { settingsAtom } from "@/store/settings";
import { userProfileAtom } from "@/store/interview";
import { getDefaultStore } from "jotai";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Default interview context
  const contextString = "You are a professional AI interviewer conducting a comprehensive interview. Ask thoughtful questions across different areas including introductory questions, reasoning, technical skills, and behavioral scenarios. Provide encouraging feedback and maintain a conversational tone.";
  
  const payload = {
    persona_id: "pd43ffef",
    custom_greeting: "Hello! I'm excited to conduct your interview today. I'll be asking you questions across different areas including your background, technical skills, and problem-solving abilities. Are you ready to begin?",
    conversational_context: contextString
  };
  
  console.log('Sending payload to API:', payload);
  
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token ?? "",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
