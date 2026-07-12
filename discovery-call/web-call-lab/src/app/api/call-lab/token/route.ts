// POST /api/call-lab/token — 통화 룸 생성 + 입장 토큰 발급 (R1 웹 VoIP 베타)
// 참가자 코드가 초대 명단(env CALL_LAB_PARTICIPANTS)에 있어야 발급.
// 룸 메타데이터에 페르소나·참가자 코드를 실어 음성 에이전트(voice_agent.py)가 읽는다.

import { NextRequest, NextResponse } from "next/server";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { ulid } from "ulid";

interface Body {
  participantCode?: string; // P01~P37
  persona?: string;         // bora | muju | haena
}

const PERSONAS = new Set(["bora", "muju", "haena"]);

function invited(code: string): boolean {
  // 간단 명단: env CALL_LAB_PARTICIPANTS="P01,P02,..." — R1 규모(37명)에선 충분
  const list = (process.env.CALL_LAB_PARTICIPANTS ?? "").split(",").map((s) => s.trim());
  return list.includes(code);
}

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => ({}))) as Body;
  const code = b.participantCode?.toUpperCase() ?? "";
  const persona = b.persona ?? "";

  if (!/^P\d{2}$/.test(code) || !invited(code)) {
    return NextResponse.json({ error: "초대되지 않은 코드예요" }, { status: 403 });
  }
  if (!PERSONAS.has(persona)) {
    return NextResponse.json({ error: "persona invalid" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!apiKey || !apiSecret || !url) {
    return NextResponse.json({ error: "LiveKit env missing" }, { status: 500 });
  }

  // 룸을 메타데이터와 함께 먼저 생성 — 에이전트가 ctx.room.metadata로 읽는다
  // (콜백/주간요약은 R1 2주차 콜백 A/B 때 여기서 주입)
  const roomName = `call-lab-${code}-${ulid()}`;
  const svc = new RoomServiceClient(url, apiKey, apiSecret);
  await svc.createRoom({
    name: roomName,
    emptyTimeout: 120,
    maxParticipants: 2,
    metadata: JSON.stringify({ participantCode: code, persona }),
  });

  const at = new AccessToken(apiKey, apiSecret, { identity: code, ttl: "10m" });
  at.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ url, roomName, token: await at.toJwt() });
}
