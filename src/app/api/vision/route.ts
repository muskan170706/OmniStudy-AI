import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData().catch(() => null);
    const file = formData ? formData.get("file") || formData.get("image") : null;

    if (file && typeof file === "object" && "name" in file) {
      console.log(`[Vision API] Received image file: ${file.name} (${file.size} bytes)`);
    }

    // Simulate AI Vision processing latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      transcription: "Dummy text from board",
      flashcards: ["Card 1", "Card 2"],
    });
  } catch (error) {
    console.error("[Vision API] Error processing request:", error);
    return NextResponse.json(
      {
        success: true,
        transcription: "Dummy text from board",
        flashcards: ["Card 1", "Card 2"],
      },
      { status: 200 }
    );
  }
}
