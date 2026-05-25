import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  // Verify the requesting user's JWT
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  // Use service role to delete all user data and auth record
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await admin.from("sessions").delete().eq("user_id", user.id);
  await admin.from("profiles").delete().eq("id", user.id);
  // Remove profile photo from storage
  await admin.storage.from("avatars").remove([`${user.id}.jpg`]);

  const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
  if (deleteErr) return new Response(JSON.stringify({ error: deleteErr.message }), { status: 500, headers: corsHeaders });

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
});
