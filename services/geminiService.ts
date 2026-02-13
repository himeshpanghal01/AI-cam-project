
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideo = async (videoBase64: string, mimeType: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const prompt = `Analyze this CCTV footage comprehensively. Extract the following information:
1. Total count of distinct people appearing.
2. A list of specific actions/behaviors with rough timestamps (e.g. "0:02: Man enters through door").
3. Descriptions of clothing or physical attributes (e.g. "Person in yellow jacket").
4. Any notable objects (e.g. "Red backpack", "White SUV").
5. A brief transcription of any significant audio or speech.

Return the result as a JSON object matching this schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: videoBase64, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          crowdCount: { type: Type.INTEGER },
          actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                description: { type: Type.STRING },
                intensity: { type: Type.STRING, description: "low, medium, or high" }
              }
            }
          },
          attributes: { type: Type.ARRAY, items: { type: Type.STRING } },
          objects: { type: Type.ARRAY, items: { type: Type.STRING } },
          audioTranscription: { type: Type.STRING }
        },
        required: ["crowdCount", "actions", "attributes", "objects", "audioTranscription"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid response format from AI");
  }
};

export const chatWithVideo = async (
  videoBase64: string, 
  mimeType: string, 
  history: { role: 'user' | 'model', text: string }[],
  newQuestion: string
): Promise<string> => {
  const ai = getAI();
  
  // Note: For simplicity in this demo, we re-send the video with the conversation context.
  // In a real-world high-volume app, we might use the File API handles or persistent sessions.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: videoBase64, mimeType } },
          { text: "This is a CCTV recording for analysis. Use it to answer the following questions accurately." }
        ],
        role: 'user'
      },
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: newQuestion }] }
    ]
  });

  return response.text || "I'm sorry, I couldn't process that question.";
};
