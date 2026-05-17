import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { sessions = [], profile = {}, muscleScores = {} } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500, headers: CORS });

    // Build a compact training summary (last 10 sessions max)
    const recent = sessions.slice(0, 10);
    const sessionSummary = recent.length === 0
      ? "No sessions logged yet."
      : recent.map((s: { name: string; sets: number; vol: number; date: string }) =>
          `${s.date}: ${s.name} — ${s.sets} sets, ${s.vol} lbs`
        ).join("\n");

    // Top 3 most trained / least trained muscles
    const sorted = Object.entries(muscleScores as Record<string, number>).sort(([, a], [, b]) => b - a);
    const topMuscles = sorted.slice(0, 3).map(([k]) => k).join(", ") || "none";
    const underMuscles = sorted.slice(-3).map(([k]) => k).join(", ") || "none";

    const prompt = `You are an elite personal trainer AI coach. Analyze this athlete's data and give sharp, personalized advice.

Athlete: ${profile.username || "ATHLETE"} | ${profile.sessions_count || 0} total sessions | ${profile.streak || 0}-day streak | ${profile.points || 0} pts

Recent training (newest first):
${sessionSummary}

Most trained muscles: ${topMuscles}
Undertrained muscles: ${underMuscles}

Reply with ONLY a JSON object, no other text:
{
  "greeting": "<one energetic sentence greeting them by name, referencing their streak or recent work>",
  "todayFocus": "<2-3 word muscle group to train today, e.g. LEGS & CORE or UPPER PULL or ACTIVE RECOVERY>",
  "recommendations": [
    {"type": "workout", "icon": "🏋️", "title": "<short title>", "text": "<specific actionable advice based on their history, 1-2 sentences>"},
    {"type": "recovery", "icon": "🧊", "title": "<short title>", "text": "<recovery tip based on their most trained muscles, 1-2 sentences>"},
    {"type": "nutrition", "icon": "🥩", "title": "<short title>", "text": "<nutrition tip relevant to their training volume and goals, 1-2 sentences>"}
  ],
  "motivational": "<one punchy motivational line tailored to where they are in their journey>"
}`;

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
        messages: [{ role: "user", content: prompt }],
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
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
