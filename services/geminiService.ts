
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';
const MISSING_KEY_PLACEHOLDER = "MISSING_API_KEY"; // Ensure this matches any potential value from process.env

export const analyzeImageWithGemini = async (
  apiKeyToUse: string,
  imageBase64: string,
  mimeType: string,
  detailLevel: number, // 1: Simple, 2: Concise, 3: Moderate, 4: Detailed, 5: Very Detailed
  isModel3D: boolean,
  isModelAsli: boolean,
  isModelAnime: boolean,
  isModelGreenScreen: boolean
): Promise<string> => {

  if (!apiKeyToUse || apiKeyToUse === MISSING_KEY_PLACEHOLDER || apiKeyToUse.trim() === "") {
    throw new Error("API Key tidak valid atau tidak tersedia. Harap periksa konfigurasi API Key Anda.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: imageBase64,
    },
  };

  let detailInstruction: string;
  switch (detailLevel) {
    case 1: 
      detailInstruction = "Focus on 1-2 primary objects and their most obvious simple movements. Keep the prompt very concise and high-level (e.g., 'man walks', 'car drives').";
      break;
    case 2: 
      detailInstruction = "Describe movements for a few key objects (around 2-3). The prompt should be concise but capture essential animations (e.g., 'man walking briskly down the street', 'red car driving past trees').";
      break;
    case 3: 
      detailInstruction = "Identify several key objects or elements (around 3-5) that could plausibly be animated. For each, describe a simple and natural animation. Combine these into a coherent prompt (e.g., 'man walks down a sunlit street, leaves on trees gently sway, a distant bird flies across the sky').";
      break;
    case 4: 
      detailInstruction = "Provide a detailed animation prompt. Describe movements for multiple objects (around 4-6), including some secondary elements. Suggest variations in speed or intensity of movements if appropriate (e.g., 'man strolls casually, his shadow stretching behind him; leaves on the oak tree rustle vigorously in a sudden gust of wind; a flock of birds wheels in the distance; sunlight glints off a passing car window').";
      break;
    case 5: 
      detailInstruction = "Create a very detailed and comprehensive animation prompt. Describe movements for as many plausible objects as possible (5+), including subtle background elements (e.g., distant clouds drifting lazily, subtle fabric rustles on clothing, minor reflections changing on wet pavement, blades of grass swaying individually). If applicable, suggest interactions between moving elements or subtle changes in lighting/shadows caused by movement. The prompt should be rich and evocative, painting a full picture of the animated scene.";
      break;
    default:
      detailInstruction = "Identify several key objects or elements (around 3-5) that could plausibly be animated. For each, describe a simple and natural animation. Combine these into a coherent prompt.";
  }

  let styleModifierInstructions = "";
  if (isModel3D) {
    styleModifierInstructions += "Incorporate a Realistic (Photorealistic) style: This style strives to mimic the look of the real world as realistically as possible. Details in textures, lighting, shadows, and reflections should be carefully considered to create an illusion of depth and authenticity. ";
  }
  if (isModelAsli) {
    styleModifierInstructions += "Emphasize rich visual effects and ensure all movements are particularly smooth and natural. ";
  }
  if (isModelAnime) {
    styleModifierInstructions += "Apply an Anime style: Include static and repetitive movements for hair. Add a soft light particle overlay effect. ";
  }
  if (isModelGreenScreen) {
    styleModifierInstructions += "For a Green Screen mode: Make the primary object's movement very vivid and dynamic. The green screen background itself MUST remain static, unchanged, and clearly identifiable as a standard green screen. ";
  }

  const textPart = {
    text: `Analyze this image meticulously. Your goal is to create an effective 'Text to Video' animation prompt in English.
The prompt MUST begin with the exact phrase: 'animate this image '.

Based on the image, follow this specific instruction for detail:
${detailInstruction}

${styleModifierInstructions ? `Apply the following style modifications: ${styleModifierInstructions}` : ''}

For all described movements, ensure they are smooth and fluid (unless a specific style like Anime or Green Screen mode dictates otherwise, for example, static hair movement or specific object vs. background behavior). Incorporate English phrases like 'with smooth movement', 'slowly drifting', 'gently flowing', 'swaying softly', 'fluidly animating', or similar descriptive terms to emphasize this smoothness where appropriate for the overall requested style.
The final output should be a single string in English, ready to be used as a video animation prompt. Do not add any conversational fluff or explanations outside of the prompt itself.`
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
    });
    
    const text = response.text;
    if (!text) {
      throw new Error('No text content received from Gemini API.');
    }
    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Check for common API key related errors (this is a guess, actual error messages may vary)
      if (error.message.toLowerCase().includes("api key not valid") || 
          error.message.toLowerCase().includes("permission denied") ||
          error.message.toLowerCase().includes("authentication")) {
        throw new Error(`Gemini API error: API Key tidak valid atau tidak memiliki izin. (${error.message})`);
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with Gemini API.");
  }
};
