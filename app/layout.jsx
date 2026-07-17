export const metadata = {
  title: "헬로마이미 · 커피챗",
  description: "검증된 커리어 파트너에게 정중하게 질문하는 텍스트 커피챗",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
