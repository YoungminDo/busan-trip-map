// /call/lab — R1 웹 VoIP 통화 페이지 (알림톡 링크 진입점)
// 링크 형식: /call/lab?code=P01&persona=bora
// PRD S2 원칙: 통화 중 화면엔 페르소나 이름·경과 시간·종료 버튼 외 아무것도 두지 않는다.

import { Suspense } from "react";
import type { Metadata } from "next";
import CallClient from "./call-client";

export const metadata: Metadata = {
  title: "나를 발견하는 통화",
  robots: { index: false, follow: false },
};

export default function CallLabPage() {
  return (
    <Suspense>
      <CallClient />
    </Suspense>
  );
}
