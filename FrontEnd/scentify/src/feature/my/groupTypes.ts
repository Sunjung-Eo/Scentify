export interface Group {
  id: string;
  adminId: string;
  adminNickname: string;
  member1Id?: string;
  member1Nickname?: string;
  member2Id?: string;
  member2Nickname?: string;
  member3Id?: string;
  member3Nickname?: string;
  member4Id?: string;
  member4Nickname?: string;
}

export interface GroupInfoResponse {
  group: Group;
}

export interface DeleteMemberRequest {
  groupId: string;
  memberId: string;
}

export interface DeleteGroupRequest {
  groupId: string;
}

// 삭제 모달 props 타입
export interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// 멤버카드 props 타입
export type MemberCardProps = {
  id: string;
  nickname: string;
  onDelete: () => void; // 삭제 버튼 클릭 후 확인 시 실행할 함수
  showDeleteButton?: boolean; // 삭제 버튼 표시 여부
  isAdmin?: boolean; // 관리자인 경우 true
};
