import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Optionally parse formData or request body if sent
    // const formData = await request.formData();
    // const file = formData.get("image");

    // Dummy delay to simulate model inference (e.g., 600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      transcription: "Dummy text from board",
      flashcards: ["Card 1", "Card 2"],
    });
  } catch (error) {
    console.error("Error processing vision request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process image" },
      { status: 500 }
    );
  }
}
