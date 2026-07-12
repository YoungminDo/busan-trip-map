"use client";

// 통화 클라이언트 — livekit-client로 룸 연결, 마이크 발행, 최소 UI (이름/경과시간/종료).

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Room, RoomEvent } from "livekit-client";

const PERSONA_NAME: Record<string, string> = { bora: "보라", muju: "무주", haena: "해나" };

type Phase = "ready" | "connecting" | "in-call" | "ended" | "error";

export default function CallClient() {
  const params = useSearchParams();
  const code = (params.get("code") ?? "").toUpperCase();
  const persona = params.get("persona") ?? "muju";

  const [phase, setPhase] = useState<Phase>("ready");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    if (phase !== "in-call") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const start = useCallback(async () => {
    setPhase("connecting");
    try {
      const res = await fetch("/api/call-lab/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantCode: code, persona }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "연결에 실패했어요");
      }
      const { url, token } = (await res.json()) as { url: string; token: string };

      const room = new Room();
      roomRef.current = room;
      room.on(RoomEvent.Disconnected, () => setPhase("ended"));
      await room.connect(url, token);
      await room.localParticipant.setMicrophoneEnabled(true); // 마이크 권한 요청 지점
      setPhase("in-call");
    } catch (e) {
      setError(e instanceof Error ? e.message : "연결에 실패했어요");
      setPhase("error");
    }
  }, [code, persona]);

  const end = useCallback(async () => {
    await roomRef.current?.disconnect();
    setPhase("ended");
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const name = PERSONA_NAME[persona] ?? "무주";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-8 bg-gray-950 px-6 text-white">
      <h1 className="text-2xl font-semibold">{name}</h1>

      {phase === "ready" && (
        <>
          <p className="text-center text-sm text-gray-400">
            버튼을 누르면 {name}와의 통화가 시작돼요.
            <br />
            (마이크 권한이 필요해요 · 3–5분)
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-green-500 px-10 py-4 text-lg font-medium"
          >
            통화 시작
          </button>
        </>
      )}

      {phase === "connecting" && <p className="text-gray-400">연결 중…</p>}

      {phase === "in-call" && (
        <>
          <p className="text-4xl tabular-nums">{mm}:{ss}</p>
          <button
            type="button"
            onClick={end}
            className="rounded-full bg-red-500 px-10 py-4 text-lg font-medium"
          >
            통화 종료
          </button>
        </>
      )}

      {phase === "ended" && (
        <p className="text-center text-sm leading-7 text-gray-300">
          오늘도 얘기해줘서 고마워요.
          <br />
          10분 안에 오늘의 일기를 보내드릴게요 ✉️
        </p>
      )}

      {phase === "error" && (
        <>
          <p className="text-sm text-red-400">{error}</p>
          <button type="button" onClick={() => setPhase("ready")} className="text-sm underline">
            다시 시도
          </button>
        </>
      )}
    </main>
  );
}
