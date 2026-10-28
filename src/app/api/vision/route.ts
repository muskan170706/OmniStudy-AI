import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = (process.env.META_API_KEY || process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "META_API_KEY is not configured in environment variables.",
        },
        { status: 500 }
      );
    }

    let base64Data = "";
    let mimeType = "image/jpeg";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = (formData.get("image") || formData.get("file")) as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No image file provided in form data." },
          { status: 400 }
        );
      }

      mimeType = file.type || "image/jpeg";
      const arrayBuffer = await file.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString("base64");
    } else {
      const body = await request.json().catch(() => ({}));
      const rawImage = body.image || body.base64 || body.data;

      if (!rawImage) {
        return NextResponse.json(
          { success: false, error: "No image or base64 data provided." },
          { status: 400 }
        );
      }

      // Handle Data URL format (e.g. data:image/png;base64,...)
      if (typeof rawImage === "string" && rawImage.includes("base64,")) {
        const parts = rawImage.split("base64,");
        base64Data = parts[1];
        const mimeMatch = parts[0].match(/:(.*?);/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
      } else if (typeof rawImage === "string") {
        base64Data = rawImage;
        if (body.mimeType) {
          mimeType = body.mimeType;
        }
      }
    }

    // Clean and validate base64 string
    base64Data = base64Data.replace(/[\r\n\s]/g, "");

    if (!base64Data) {
      return NextResponse.json(
        { success: false, error: "Could not extract valid base64 image data." },
        { status: 400 }
      );
    }

    // Normalize MIME type supported by Gemini Vision
    const supportedMimes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    const normalizedMime = supportedMimes.includes(mimeType.toLowerCase())
      ? mimeType.toLowerCase()
      : "image/png";

    // Initialize official Google Gemini API SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are OmniStudy AI, an intelligent lecture assistant and whiteboard transcriber.
Analyze the provided image of a lecture whiteboard, presentation slide, or handwritten diagram.

Return a JSON object with this exact structure:
{
  "transcription": "Comprehensive, clean transcription of all visible text, formulas, diagrams, and notes",
  "analysis": "Educational summary explaining the concepts, equations, and key takeaways from the board",
  "flashcards": [
    "Question: ... | Answer: ...",
    "Question: ... | Answer: ..."
  ]
}`;

    const contents = [
      {
        inlineData: {
          mimeType: normalizedMime,
          data: base64Data,
        },
      },
      prompt,
    ];

    // Use strictly gemini-1.5-pro
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(contents);

    const response = await result.response;
    const responseText = response.text() || "";

    // Parse the generated JSON response
    try {
      const cleanedText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      return NextResponse.json({
        success: true,
        transcription: parsed.transcription || responseText,
        analysis: parsed.analysis || "",
        flashcards: parsed.flashcards || [],
      });
    } catch {
      return NextResponse.json({
        success: true,
        transcription: responseText,
        analysis: responseText,
        flashcards: [],
      });
    }
  } catch (error: unknown) {
    console.error("Gemini Vision API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: `Gemini API Error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
