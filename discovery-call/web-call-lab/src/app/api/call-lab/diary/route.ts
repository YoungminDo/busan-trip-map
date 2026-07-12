// POST /api/call-lab/diary — 일기 생성 (WoZ 운영자/파이프라인 전용, secret 헤더 필요)
// 응답의 url을 카톡으로 발송한다. GET ?code=P01 — 운영자용 참가자별 일기 목록.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ulid } from "ulid";

interface Body {
  participantCode?: string;   // P01~P37
  onDate?: string;            // YYYY-MM-DD
  persona?: string;           // bora | muju | haena
  emotionTag?: string;
  body?: string;
  mirroring?: string | null;
  transcript?: { speaker: string; text: string; at_sec: number }[];
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.CALL_LAB_ADMIN_SECRET;
  return !!secret && req.headers.get("x-call-lab-secret") === secret;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const b = (await req.json()) as Body;
  if (!b.participantCode || !b.onDate || !b.persona || !b.body) {
    return NextResponse.json({ error: "participantCode/onDate/persona/body required" }, { status: 400 });
  }

  const id = ulid();
  const { error } = await supabase.from("call_lab_diaries").insert({
    id,
    participant_code: b.participantCode,
    on_date: b.onDate,
    persona: b.persona,
    emotion_tag: b.emotionTag ?? null,
    body: b.body,
    mirroring: b.mirroring ?? null,
    transcript: b.transcript ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id, url: `/call/lab/diary/${id}` });
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const code = req.nextUrl.searchParams.get("code");
  let q = supabase
    .from("call_lab_diaries")
    .select("id, participant_code, on_date, persona, created_at, call_lab_opens(opened_at)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (code) q = q.eq("participant_code", code);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ diaries: data });
}
