import { IConversation } from "@/types";
import { settingsAtom } from "@/store/settings";
import { userProfileAtom } from "@/store/interview";
import { getDefaultStore } from "jotai";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  // Get settings from Jotai store
  const settings = getDefaultStore().get(settingsAtom);
  const userProfile = getDefaultStore().get(userProfileAtom);
  
  // Add debug logs
  console.log('Creating conversation with settings:', settings);
  console.log('User profile:', userProfile);
  console.log('Greeting value:', settings.greeting);
  console.log('Context value:', settings.context);
  
  // Build the context string
  let contextString = "";
  if (userProfile?.fullName) {
    contextString = `You are conducting an AI interview with ${userProfile.fullName}, a ${userProfile.profession}. `;
    contextString += `Their skills include: ${userProfile.skills.join(', ')}. `;
    if (userProfile.projects.length > 0) {
      contextString += `They have worked on projects like: ${userProfile.projects.map(p => p.name).join(', ')}. `;
    }
    contextString += "Act as a professional interviewer, ask thoughtful questions, provide encouraging feedback, and maintain a conversational tone. ";
  } else if (settings.name) {
    contextString = `You are talking with the user, ${settings.name}. `;
  }
  contextString += settings.context || "";
  
  const payload = {
    persona_id: settings.persona || "pd43ffef",
    custom_greeting: userProfile 
      ? `Hello ${userProfile.fullName}! I'm excited to conduct your interview today. I'll be asking you questions across different areas to better understand your background and capabilities. Are you ready to begin?`
      : settings.greeting !== undefined && settings.greeting !== null 
      ? settings.greeting 
      : "Hey there! I'm your technical co-pilot! Let's get get started building with Tavus.",
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
