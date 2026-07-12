"use client";

// 접힌 전체 대화 전사 (PRD S3-4). 기본 접힘 — 일기가 주인공, 전사는 검증용.

import { useState } from "react";

interface Turn {
  speaker: string;
  text: string;
  at_sec: number;
}

export default function TranscriptToggle({ transcript }: { transcript: Turn[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm text-gray-400 underline underline-offset-2"
      >
        {open ? "대화 전체 닫기" : "대화 전체 보기"}
      </button>
      {open && (
        <ol className="mt-3 space-y-2">
          {transcript.map((t, i) => (
            <li key={i} className="text-sm leading-6">
              <span className={t.speaker === "user" ? "font-medium text-gray-900" : "text-gray-500"}>
                {t.speaker === "user" ? "나" : "AI"}
              </span>
              <span className="ml-2 text-gray-700">{t.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
