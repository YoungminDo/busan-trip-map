// ⚠️ 스캐폴드 — F1 온보딩: 페르소나 선택 → 시간 선택 → 권한 프라이머 → 첫 통화 (5분 내 aha)
import 'package:flutter/material.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  static const personas = [
    ('보라', '반말 · 편하게 들어주는 동갑 친구', '야, 나 보라야! 오늘 하루 어땠는지 나한테만 말해봐.'),
    ('무주', '존댓말 · 판단 없이 정확히 되돌려주는 기록자', '안녕하세요, 무주예요. 오늘 하루를 여기에 남겨두세요.'),
    ('해나', '존댓말 · 따뜻하게 인정하는 코치', '안녕하세요, 해나예요. 오늘도 하루를 잘 건너오셨네요.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(24),
              child: Text('누가 전화해줬으면 좋겠어요?',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            ),
            for (final (name, desc, _) in personas)
              Card(
                margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                child: ListTile(
                  title: Text(name),
                  subtitle: Text(desc),
                  trailing: const Icon(Icons.play_circle_outline), // 5초 인사말 샘플 재생
                  onTap: () {
                    // TODO(Week 7): 선택 저장 → 통화 시간 선택(기본 22:30) → 마이크/알림 프라이머 → 첫 통화
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}
