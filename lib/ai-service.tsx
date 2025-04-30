// import { generateText } from "ai"
// import { xai } from "@ai-sdk/xai"
// import { gemini } from "@ai-sdk/gemini"
 import { env } from '@/data/env/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY});

interface AnalysisResult {
  result: "fake" | "original"
  confidence: number
  drugName?: string
  manufacturer?: string
  indicators: string[]
}

export async function analyzeDrugImage(imageUrl: string): Promise<AnalysisResult> {
  try {
    // Determine which model to use based on environment variable
    // const aiModel = env.AI_MODEL?.toLowerCase() === "gemini" ? gemini("gemini-2.0-flash") : xai("grok-1")
    const aiModel = "gemini-2.0-flash" 

    const prompt = `
      Analyze this medicine image and determine if it appears to be an original or counterfeit drug.
      
      Image URL: ${imageUrl}
      
      Provide your analysis in the following JSON format only:
      {
        "result": "fake" or "original",
        "confidence": number between 1-100,
        "drugName": "name of the drug if identifiable",
        "manufacturer": "manufacturer name if identifiable",
        "indicators": ["list of key indicators that led to this conclusion"]
      }
      
      Focus only on visual characteristics that can be determined from the image.
      If you cannot determine with certainty, provide your best assessment with an appropriate confidence level.
      Do not include any explanations or additional text outside the JSON structure.
    `



    const { text } = await ai.models.generateContent({
      model: aiModel,
      contents: prompt,
    //   maxTokens: 1000,
    })

    // Extract the JSON from the response
    if (!text) {
      console.error("AI response text is undefined");
      throw new Error("AI response text is undefined");
    }
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("Failed to parse AI response, no JSON found:", text.substring(0, 200))
      throw new Error("Failed to parse AI response")
    }

    try {
      const result = JSON.parse(jsonMatch[0]) as AnalysisResult

      // Validate the result
      if (!result.result || !result.confidence || !Array.isArray(result.indicators)) {
        console.error("Invalid AI response format:", result)
        throw new Error("Invalid AI response format")
      }

      // Ensure confidence is within range
      result.confidence = Math.max(1, Math.min(100, result.confidence))

      return result
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw JSON:", jsonMatch[0])
      throw new Error("Failed to parse AI response JSON")
    }
  } catch (error) {
    console.error("Error analyzing drug image:", error)
    // Return a fallback result
    return {
      result: "fake",
      confidence: 50,
      drugName: "Unknown",
      manufacturer: "Unknown",
      indicators: ["Error analyzing image", "Please try again with a clearer image"],
    }
  }
}
