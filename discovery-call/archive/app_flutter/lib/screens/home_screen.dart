// ⚠️ 스캐폴드 — S4 홈: 다음 통화 예고 배너 + 일기 카드 리스트.
// 금지: 스트릭 UI, "N일 연속", 죄책감 카피 (카피 가이드라인).
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('나를 발견하는 통화'),
        actions: [IconButton(icon: const Icon(Icons.settings), onPressed: () {/* 설정 */})],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              leading: Icon(Icons.phone_in_talk),
              title: Text('오늘 밤 10:30, 보라가 전화할게요'),
            ),
          ),
          SizedBox(height: 16),
          Center(child: Text('첫 통화를 받으면 여기에 일기가 쌓여요.')),
          // TODO(Week 5–6): 일기 카드 리스트 (통화 후 요약 카드 — 유일한 디자인 투자처)
        ],
      ),
    );
  }
}
