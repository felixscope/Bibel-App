import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { verseText, reference, question } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY nicht konfiguriert" },
        { status: 500 }
      );
    }

    // Erstelle den Prompt für Claude
    const systemPrompt = `Du bist ein hilfreicher Assistent für Bibelstudien. Du hilfst Benutzern dabei, Bibelverse zu verstehen und Fragen zu beantworten. Antworte auf Deutsch und sei präzise, aber hilfreich.`;

    const userPrompt = question
      ? `Frage zu ${reference}: ${question}\n\nVers: ${verseText}`
      : `Erkläre mir diesen Bibelvers:\n\n${reference}\n${verseText}\n\nGib eine kurze, hilfreiche Erklärung.`;

    // Claude API Call
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API Error:", errorData);
      return NextResponse.json(
        { error: "Fehler beim Aufruf der Claude API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "Keine Antwort erhalten";

    return NextResponse.json({ response: content });
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
