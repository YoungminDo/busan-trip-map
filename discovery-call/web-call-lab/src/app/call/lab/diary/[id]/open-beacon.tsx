"use client";

// 일기가 실제로 화면에 뜬 시점에 열람 이벤트를 1회 기록 (R1 핵심 지표: 열람률·열람까지 시간)

import { useEffect, useRef } from "react";

export default function OpenBeacon({ diaryId }: { diaryId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch("/api/call-lab/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diaryId }),
      keepalive: true,
    }).catch(() => {});
  }, [diaryId]);

  return null;
}
