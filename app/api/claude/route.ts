import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("ANTHROPIC_API_KEY nicht konfiguriert", {
        status: 500,
      });
    }

    // System-Prompt dynamisch aus Kontext bauen
    let contextInfo = `Der Nutzer liest gerade: ${context.bookName} Kapitel ${context.chapter}.`;
    if (context.selectedVerses?.length > 0) {
      const verseTexts = context.selectedVerses
        .map((v: { verse: number; text: string }) => `Vers ${v.verse}: "${v.text}"`)
        .join("\n");
      contextInfo += `\nMarkierte Verse:\n${verseTexts}`;
    }

    const systemPrompt = `Du bist ein theologisch fundierter Bibelstudium-Begleiter.

Theologische Ausrichtung:
- Überkonfessionell, aber auf dem Grund der katholischen Lehre und Tradition
- Beziehe dich auf die Kirchenväter, das Lehramt und die katholische Exegese, wo relevant
- Bei Themen, die konfessionell umstritten sind, nenne die katholische Position als Ausgangspunkt und erwähne andere Perspektiven fair
- Stütze jede Aussage auf konkrete Bibelstellen — nenne Buch, Kapitel und Vers
- Keine spekulativen oder freien Interpretationen — bleibe bei der Überlieferung und dem Textbefund
- Wenn du dir bei einer Auslegung unsicher bist, sage es ehrlich

Antwortformat:
- Antworte auf Deutsch, prägnant und fachlich korrekt
- Bei einfachen Fragen 2-3 Sätze, bei komplexen theologischen Fragen einen kurzen Absatz
- Verwende einen respektvollen, einladenden Ton — du bist ein Studienbegleiter, kein Prediger
- Erwähne NICHT explizit, welches Kapitel oder Buch der Nutzer gerade liest. Nutze den Kontext stillschweigend, um relevante Antworten zu geben, ohne es auszusprechen.
- Beginne nicht mit Begrüßungen oder Smalltalk. Antworte direkt auf die Frage.
- Kommentiere NIEMALS, ob eine Frage zum aktuellen Text passt oder nicht. Der Nutzer darf alles fragen — beantworte jede Frage direkt und ohne Einleitung.
- Verwende KEIN Markdown für Überschriften (kein #, ##, ###) und keine horizontalen Linien (---). Strukturiere deine Antwort nur mit Fettdruck, Kursiv und Absätzen.

Kontext (intern, nicht erwähnen):
${contextInfo}
Beziehe dich stillschweigend auf den Kontext des gelesenen Textes.`;

    // Claude API Call mit Streaming
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2048,
        stream: true,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Claude API Error:", errorData);
      return new Response(errorData, {
        status: response.status,
      });
    }

    // SSE-Stream parsen und nur delta.text weiterleiten
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.type === "text_delta" &&
                  parsed.delta?.text
                ) {
                  controller.enqueue(encoder.encode(parsed.delta.text));
                }
              } catch {
                // Skip unparseable lines
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return new Response("Interner Serverfehler", { status: 500 });
  }
}
