import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/queries";

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Sem banco configurado, aceita silenciosamente (modo demonstração).
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, status: "active" });

  // 23505 = unique_violation: e-mail já inscrito. Tratamos como sucesso.
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "Não foi possível concluir a inscrição." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
