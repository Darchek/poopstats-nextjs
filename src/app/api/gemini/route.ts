import { NextRequest,NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const MODEL_FLASH = "gemini-2.5-flash";
const MODEL_FLASH_LITE = "gemini-2.5-flash-lite";


export async function GET(request: NextRequest) {
  // const body = await request.json();
  // const prompt = body.prompt;
  const genText = await fetchGemini("prompt");
  return NextResponse.json({
    success: true,
    text: genText,
    message: 'Generated text successfully',
  }, { status: 200 });
}



async function fetchGemini(prompt: string) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
    
        const model = genAI.getGenerativeModel({ 
            model: MODEL_FLASH_LITE,
            systemInstruction: `You are a comedian.
            You are integrated in a app to register every time a person goes to the bathroom to make a poop.
            The user can measure the time of the poop and it is same in a database.
            You will generate a joke about this situation and congratulate the user for the achievement.
            You will only generate the joke and nothing else.
            `
        });
    
    
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: "Generate" }]
            }]
        });
        
        const response = await result.response;
        const text = response.text();
        return text;
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to generate text' },
          { status: 500 }
        );
    }
}
