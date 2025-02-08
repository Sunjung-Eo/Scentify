import {
  GroupInfoResponse,
  DeleteMemberRequest,
  DeleteGroupRequest,
} from "../groupTypes";
import React, { useState, useEffect } from "react";
import MemberCard from "./MemberCard";
import { useUserStore } from "../../../stores/useUserStore"; // 유저 상태 관리(사용자 기기정보)
import { useAuthStore } from "../../../stores/useAuthStore"; // 인증 정보 관리(토큰)
import { getGroupByDeviceId } from "../../../apis/group/getGroupByDeviceId"; // 그룹 정보 조회 API
import { deleteGroupMember } from "../../../apis/group/deleteGroupMember"; // 개별 멤버 삭제 API
import { deleteGroup } from "../../../apis/group/deleteGroup"; // 그룹 삭제 API
import { Link } from "react-router-dom";

export const GroupList = () => {
  // 사용자가 소유한 기기 ID 목록 가져오기 (등록된 디바이스가 없을 경우 빈 배열 사용)
  const deviceIds = useUserStore((state) => state.deviceIds ?? []);
  // 사용자의 대표(메인) 기기 ID 가져오기
  const mainDeviceId = useUserStore((state) => state.mainDeviceId);
  //  선택된 기기 ID (초기값: 메인 기기)
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
    mainDeviceId || null
  );
  // 현재 그룹에 속한 멤버 목록 (초기값: 빈 배열)
  const [members, setMembers] = useState<{ id: string; nickname: string }[]>(
    []
  );
  //현재 그룹의 ID
  const [groupId, setGroupId] = useState<string>("");
  // 에러 메시지 상태
  const [error, setError] = useState<string | null>(null);

  // 인증 관련 정보 가져오기 (토큰, 로그인 여부)
  const { accessToken } = useAuthStore();
  // 그룹의 관리자(Admin ID)정보
  const [adminId, setAdminId] = useState<string>("");

  // 선택한 기기의 그룹 정보를 불러오는 함수
  useEffect(() => {
    const fetchGroupData = async () => {
      if (selectedDeviceId === null) return; //기기가 선택되지 않으면 실행 X
      try {
        // API 요청: 선택한 기기의 그룹 정보 가져오기
        const response: GroupInfoResponse = await getGroupByDeviceId(
          selectedDeviceId,
          accessToken
        );
        const { group } = response;

        // 그룹 ID 저장
        setGroupId(group.id);
        // 그룹의 관리자 ID 저장
        setAdminId(group.adminId);

        // 멤버 목록을 객체 배열로 변환(각 멤버의 ID및 닉네임 저장)
        const formattedMembers = [
          { id: group.adminId, nickname: group.adminNickname || "알 수 없음" }, // 어드민(관리자) 추가
          ...(group.member1Id
            ? [
                {
                  id: group.member1Id,
                  nickname: group.member1Nickname || "알 수 없음",
                },
              ]
            : []),
          ...(group.member2Id
            ? [
                {
                  id: group.member2Id,
                  nickname: group.member2Nickname || "알 수 없음",
                },
              ]
            : []),
          ...(group.member3Id
            ? [
                {
                  id: group.member3Id,
                  nickname: group.member3Nickname || "알 수 없음",
                },
              ]
            : []),
          ...(group.member4Id
            ? [
                {
                  id: group.member4Id,
                  nickname: group.member4Nickname || "알 수 없음",
                },
              ]
            : []),
        ];

        setMembers(formattedMembers); // 멤버 리스트 업데이트
      } catch (err: any) {
        setError(err.message); // 에러 발생 시 메시지 저장
      }
    };

    fetchGroupData();
  }, [selectedDeviceId, accessToken]); //선택한 기기 ID 또는 인증 상태 변경 시 실행

  // 드롭다운에서 기기 선택 시 호출되는 함수
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = parseInt(e.target.value, 10); // 선택한 기기 ID를 숫자로 변환
    setSelectedDeviceId(deviceId); // 상태 업데이트
  };

  // 개별 멤버 삭제 함수
  const handleDeleteMember = async (memberId: string) => {
    try {
      const requestData: DeleteMemberRequest = { groupId, memberId }; // API 요청 데이터 구성
      await deleteGroupMember(requestData, accessToken); // API 호출
      setMembers(members.filter((member) => member.id !== memberId)); // 삭제된 멤버 제외 후 리스트 업데이트
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
    }
  };

  // 그룹 삭제 함수
  const handleDeleteGroup = async () => {
    try {
      const requestData: DeleteGroupRequest = { groupId }; // API 요청 데이터 구성
      await deleteGroup(requestData, accessToken); // API 호출
      setMembers([]); // 멤버 리스트 초기화
      setGroupId(""); // 그룹 ID 초기화
    } catch (error) {
      console.error("그룹 삭제 실패:", error);
    }
  };

  // 오류 발생 시 오류 메시지 표시
  if (error) {
    return <div className="font-pre-light text-12">{error}</div>;
  }

  return (
    <div className="flex flex-col">
      {/* 기기 선택 드롭다운*/}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="font-pre-medium text-12 text-gray">멤버 목록</div>
        <select
          onChange={handleDeviceChange}
          className="px-3 py-2 rounded-lg border border-lightgray focus:outline-none focus:ring-1 focus:ring-brand"
          defaultValue={mainDeviceId || ""}
        >
          {deviceIds.length > 0 ? (
            deviceIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))
          ) : (
            <option value="" disabled>
              -
            </option>
          )}
        </select>
        {/* 초대하기 버튼 */}
        {adminId && (
          <Link to="/my/invite">
            <button className="w-[65px] h-[25px] text-[12px] text-sub font-pre-light rounded-lg border-[1px] border-lightgray focus:outline-none focus:ring-1 focus:ring-brand">
              초대하기
            </button>
          </Link>
        )}
      </div>

      {/* 멤버 리스트 */}
      <div className="mt-4 space-y-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            profileImg=""
            id={member.id}
            nickname={member.nickname}
            onDelete={() => handleDeleteMember(member.id)} //삭제버튼 핸들러
            showDeleteButton={!!adminId} // 삭제 버튼을 관리자만 보이도록 설정
            // onDelete={adminId ? () => handleDeleteMember(member.id) : undefined} //adminId일 경우 삭제 기능 실행,  adminId아닌 경우 undefined (삭제 기능 비활성화)
          />
        ))}
      </div>
      <div className="flex flex-row items-center justify-between mt-4">
        {/* 초대코드입력 버튼 */}
        <Link to="/my/invitecodeinput">
          <button className="text-12 font-pre-light border-lightgray border rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-brand">
            초대코드로 입력
          </button>
        </Link>
        {/* 그룹 삭제 버튼 */}
        {adminId && (
          <button
            className="w-[65px] h-[25px] text-[12px] text-sub font-pre-light rounded-lg border-[1px] border-lightgray focus:outline-none focus:ring-1 focus:ring-brand"
            onClick={handleDeleteGroup}
          >
            그룹 삭제
          </button>
        )}
      </div>
    </div>
  );
};
