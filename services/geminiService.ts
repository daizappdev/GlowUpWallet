import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (userQuery: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "Please configure your API Key to access the Glow Up Guide!";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are a Gen Z financial bestie named "GlowUp Guide". 
      Your tone is supportive, trendy, using clear language (no complex jargon without explanation).
      You use emojis occasionally.
      Your goal is to help the user save money, understand budgeting, and reach their lifestyle goals (like concerts, travel, fashion).
      Keep responses concise (under 100 words usually).
      Context about the user: ${context}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userQuery,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Sorry bestie, I couldn't think of anything right now!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain is buffering. Try again later.";
  }
};

export const generateDailyTip = async (theme: string): Promise<string> => {
  if (!apiKey) return "Tip: Save $5 today by making coffee at home!";

  try {
     const model = 'gemini-2.5-flash';
     const prompt = `Give me a very short (1 sentence) financial tip for a Gen Z user. Theme: ${theme}. Make it catchy.`;
     const response = await ai.models.generateContent({
       model,
       contents: prompt,
     });
     return response.text || "Save those coins!";
  } catch (e) {
    return "Tracking your spending is the first step to glowing up!";
  }
}
