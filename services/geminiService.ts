import { GoogleGenAI } from "@google/genai";

export const generateTaskDescription = async (title: string): Promise<string> => {
  // FIX: Per Gemini API guidelines, assume API_KEY is always available and remove explicit check.
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Based on the task title "${title}", generate a detailed, professional description for a CRM task. The description should be concise, actionable, and structured with clear objectives. Do not use markdown.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // FIX: Per Gemini API guidelines, access the .text property directly.
    return response.text;
  } catch (error) {
    console.error("Error generating task description:", error);
    return "Failed to generate description due to an API error.";
  }
};