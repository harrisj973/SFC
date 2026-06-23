import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { frames, exercise } = await req.json();
    if (!frames || !Array.isArray(frames) || frames.length === 0) {
      return new Response(JSON.stringify({ error: "No frames provided" }), { status: 400, headers: CORS });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500, headers: CORS });
    }

    const exerciseLabel = (exercise || "the exercise").trim();

    const imageContent = frames.map((frame: string) => ({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: frame },
    }));

    const prompt = `You are an expert strength & conditioning coach analyzing exercise form from video frames.

Exercise being performed: ${exerciseLabel}

These images are frames sampled from a workout video. Analyze the athlete's form across all frames and provide coaching feedback.

Reply with ONLY a JSON object in this exact format, no other text:
{
  "score": <1-10 form quality score>,
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "corrections": [
    {"issue": "<problem>", "fix": "<specific correction cue>"}
  ],
  "cues": ["<short cue 1>", "<short cue 2>", "<short cue 3>"],
  "safety": "<null or one sentence safety warning if there is injury risk>"
}

Keep corrections and cues specific, actionable, and coach-like. If you cannot see a person exercising clearly in the frames, return: {"error": "Cannot analyze form from these frames"}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{
          role: "user",
          content: [
            ...imageContent,
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) throw new Error("Empty response from Claude");

    const result = JSON.parse(text);
    return new Response(JSON.stringify(result), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
