// ⚠️ 스캐폴드 — CallKit 수신·거절 3옵션 처리의 골격 (PRD S1, F2).
// PushKit 토큰 등록/수신은 iOS AppDelegate 네이티브 구현이 별도로 필요하다
// (flutter_callkit_incoming PUSHKIT.md 참고) — Week 1–2 스파이크 범위.
import 'package:flutter_callkit_incoming/entities/entities.dart';
import 'package:flutter_callkit_incoming/flutter_callkit_incoming.dart';

class CallService {
  CallService._();
  static final instance = CallService._();

  Future<void> init() async {
    FlutterCallkitIncoming.onEvent.listen((CallEvent? event) async {
      switch (event?.event) {
        case Event.actionCallAccept:
          // TODO(Week 3–4): LiveKit 룸 연결 → 통화 화면 진입
          break;
        case Event.actionCallDecline:
          // 거절 → 로컬 알림으로 3옵션 제공: 10분 뒤 / 오늘 밤 / 오늘은 패스
          // 어떤 옵션도 페널티 없음 (죄책감 제로 설계 — 서버 scheduler.decline_followup)
          break;
        case Event.actionCallTimeout:
          // 부재중 → 서버가 5분 후 1회 재시도, 이후 부재중 폴백 알림
          break;
        default:
          break;
      }
    });
  }

  /// VoIP push payload 수신 시 CallKit 수신 화면 표시 (persona 이름이 발신자명)
  Future<void> showIncoming({required String personaName, required String callId}) {
    return FlutterCallkitIncoming.showCallkitIncoming(CallKitParams(
      id: callId,
      nameCaller: personaName,
      handle: '나를 발견하는 통화',
      type: 0, // audio
      duration: 45000, // 벨 울림 45초
      ios: const IOSParams(supportsVideo: false, maximumCallGroups: 1),
    ));
  }
}
