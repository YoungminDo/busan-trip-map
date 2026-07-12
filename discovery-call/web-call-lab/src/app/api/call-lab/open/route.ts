// POST /api/call-lab/open — 일기 열람 이벤트 기록 (페이지 마운트 시 클라이언트 비컨)
// 열람률·열람까지의 시간이 R1의 1차 지표라서 서버 렌더가 아니라 실제 화면 표시 시점에 찍는다.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { diaryId } = (await req.json().catch(() => ({}))) as { diaryId?: string };
  if (!diaryId) return NextResponse.json({ error: "diaryId required" }, { status: 400 });

  const { error } = await supabase.from("call_lab_opens").insert({
    diary_id: diaryId,
    user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  });
  // 열람 기록 실패가 일기 열람을 막으면 안 된다 — 조용히 성공 응답
  if (error) console.error("[call-lab/open]", error.message);
  return NextResponse.json({ ok: true });
}
