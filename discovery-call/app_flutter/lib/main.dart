// ⚠️ 스캐폴드 — PRD 2장 IA를 라우트로 고정. 실기기 검증 전.
import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'screens/onboarding_screen.dart';
import 'services/call_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  CallService.instance.init(); // PushKit/CallKit 이벤트 리스너 등록
  runApp(const DiscoveryCallApp());
}

class DiscoveryCallApp extends StatelessWidget {
  const DiscoveryCallApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '나를 발견하는 통화',
      routes: {
        '/': (_) => const OnboardingScreen(), // 온보딩 완료 후 홈으로 교체
        '/home': (_) => const HomeScreen(),
      },
    );
  }
}
