// 캡슐 정보를 위한 타입 정의
export interface Capsule {
  id: string; // UUID 형태의 기본키
  name: string | null; // 기기 이름 (null 허용)
  slot1: number | null; // 1번 슬롯 캡슐 정보 (0~2 범위)
  slot1RemainingRatio: number | null; // 1번 슬롯 잔여량
  slot2: number | null; // 2번 슬롯 캡슐 정보 (3~5 범위)
  slot2RemainingRatio: number | null; // 2번 슬롯 잔여량
  slot3: number | null; // 3번 슬롯 캡슐 정보 (0~8 범위)
  slot3RemainingRatio: number | null; // 3번 슬롯 잔여량
  slot4: number | null; // 4번 슬롯 캡슐 정보 (0~8 범위)
  slot4RemainingRatio: number | null; // 4번 슬롯 잔여량
}

// 캡슐 생성 요청에 사용되는 타입
export interface CreateCapsuleRequest {
  name: string; // 기기 이름
  slot1: number; // 1번 슬롯 캡슐 정보
  slot2: number; // 2번 슬롯 캡슐 정보
  slot3: number; // 3번 슬롯 캡슐 정보
  slot4: number; // 4번 슬롯 캡슐 정보
}

// 서버 응답 타입 정의
export interface CapsuleResponse {
  id: string; // 생성된 디바이스의 UUID
  name: string; // 생성된 기기 이름
  slot1: number; // 1번 슬롯 캡슐 정보
  slot1RemainingRatio: number; // 1번 슬롯 잔여량
  slot2: number; // 2번 슬롯 캡슐 정보
  slot2RemainingRatio: number; // 2번 슬롯 잔여량
  slot3: number; // 3번 슬롯 캡슐 정보
  slot3RemainingRatio: number; // 3번 슬롯 잔여량
  slot4: number; // 4번 슬롯 캡슐 정보
  slot4RemainingRatio: number; // 4번 슬롯 잔여량
}
