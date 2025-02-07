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
