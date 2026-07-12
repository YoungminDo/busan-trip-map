// /call/lab/diary/[id] — 통화 후 일기 카드 (W0 R1: 카톡 링크로 전달, R2의 기반 화면)
// PRD S3: 감정 태그 → 일기 본문 → 관찰 한 문장(미러링) → 접힌 전사.
// 링크 id(ulid)가 접근 키. 검색엔진 차단.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OpenBeacon from "./open-beacon";
import TranscriptToggle from "./transcript-toggle";

export const metadata: Metadata = {
  title: "오늘의 일기 — 나를 발견하는 통화",
  robots: { index: false, follow: false },
};

const PERSONA_NAME: Record<string, string> = { bora: "보라", muju: "무주", haena: "해나" };

interface Turn {
  speaker: string;
  text: string;
  at_sec: number;
}

export default async function DiaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: diary } = await supabase
    .from("call_lab_diaries")
    .select("id, on_date, persona, emotion_tag, body, mirroring, transcript")
    .eq("id", id)
    .maybeSingle();

  if (!diary) notFound();

  const date = new Date(`${diary.on_date}T00:00:00`);
  const dateLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const transcript = (diary.transcript ?? []) as Turn[];

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white px-6 py-10 text-gray-900">
      <OpenBeacon diaryId={diary.id} />

      <header className="mb-6">
        <p className="text-sm text-gray-500">
          {dateLabel} · {PERSONA_NAME[diary.persona] ?? diary.persona}와의 통화
        </p>
        {diary.emotion_tag && (
          <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
            {diary.emotion_tag}
          </span>
        )}
      </header>

      <article className="whitespace-pre-wrap text-[17px] leading-8">{diary.body}</article>

      {diary.mirroring && (
        <aside className="mt-8 rounded-xl bg-gray-50 p-4">
          <p className="mb-1 text-xs font-medium text-gray-400">오늘의 관찰</p>
          <p className="text-[15px] leading-7 text-gray-700">{diary.mirroring}</p>
        </aside>
      )}

      {transcript.length > 0 && <TranscriptToggle transcript={transcript} />}

      <footer className="mt-12 text-center text-xs text-gray-400">
        이 페이지는 나에게만 보여요 · 삭제를 원하면 운영진에게 말해주세요
      </footer>
    </main>
  );
}
