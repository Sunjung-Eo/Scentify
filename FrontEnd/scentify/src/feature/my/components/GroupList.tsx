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
import { useMemo } from "react"; //객체 사용시 불필요한 렌더링 막기 위함
import { Link, useNavigate } from "react-router-dom";

export const GroupList = () => {
  // 사용자가 소유한 기기 ID 목록 가져오기 (등록된 디바이스가 없을 경우 빈 배열 사용)
  // deviceIdsAndName는 객체로, 리액트는 객체가 같은 값이어도 새로운 객체가 생성되면 다른 것으로 인식해서 불필요한 리렌더링을 함. 이를 막히위해 useMemo()사용
  const deviceIdsAndNames = useUserStore((state) => state.deviceIdsAndNames);
  const memoizedDeviceIdsAndNames = useMemo(
    () => deviceIdsAndNames ?? {},
    [deviceIdsAndNames]
  );

  // 사용자의 대표(메인) 기기 ID 가져오기
  const mainDeviceId = useUserStore((state) => state.mainDeviceId);

  const userId = useUserStore((state) => state.id); // 현재 로그인한 유저 ID
  console.log("현재 로그인한 유저 ID:", userId);

  //  선택된 기기 ID (초기값: 메인 기기)
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
    mainDeviceId || null
  );
  console.log("현재 선택된 기기 ID:", selectedDeviceId);

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
  console.log("현재 accessToken:", accessToken);

  // 그룹의 관리자(Admin ID)정보
  const [adminId, setAdminId] = useState<string>("");
  console.log("현재 관리자ID:", adminId);

  const navigate = useNavigate();

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
        console.log("API 응답 데이터:", response);

        const { group } = response;

        // adminId와 groupIdsms API응답 데이터를 가져와 상태로 저장하므로 setAdminId와 setGroupId를 명시적으로 호출해야함.
        // Admin ID 설정
        setAdminId(group.adminId || ""); // 관리자 ID를 상태에 저장.
        console.log("Admin ID 설정 완료:", group.adminId);
        // 그룹 ID 설정
        setGroupId(group.id.toString());

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

        // 사용자(userId)를 제외한 멤버 목록 설정
        const filteredMembers = formattedMembers.filter(
          (member) => member.id !== userId
        );

        setMembers(filteredMembers); // 멤버 리스트 업데이트
      } catch (err: any) {
        setError(err.message); // 에러 발생 시 메시지 저장
        setMembers([]); // 오류 시 멤버 상태 초기화
      }
    };

    fetchGroupData();
  }, [selectedDeviceId, accessToken]); //선택한 기기 ID, 인증 상태, 또는 사용자 ID 변경 시 실행

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

  // 초대하기 버튼 클릭 시 Invite 페이지로 이동하면서 selectedDeviceId 전달
  const handleInvite = () => {
    if (selectedDeviceId) {
      navigate("/my/invite", { state: { deviceId: selectedDeviceId } }); // 상태로 전달
    }
  };

  return (
    <div className="flex flex-col">
      {/* 멤버 목록과 기기 선택 드롭다운 + 초대하기 버튼 묶음 */}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="font-pre-medium text-12 text-gray">멤버 목록</div>

        {/* 기기 선택 드롭다운 + 초대하기 버튼 */}
        <div className="flex flex-row items-center gap-x-5">
          {/* 기기 선택 드롭다운 */}
          <select
            onChange={handleDeviceChange}
            className="w-auto min-w-[88px] max-w-[130px] h-[25px] text-center text-12 font-pre-light rounded-lg border-[1px] border-lightgray focus:outline-none focus:ring-1 focus:ring-brand"
            defaultValue={mainDeviceId || ""}
          >
            {Object.entries(memoizedDeviceIdsAndNames).length > 0 ? (
              Object.entries(memoizedDeviceIdsAndNames).map(([id, name]) => (
                <option key={id} value={id} className="text-12 font-pre-light">
                  {name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                -
              </option>
            )}
          </select>

          {/* 초대하기 버튼 */}
          {userId === adminId && (
            <button
              onClick={handleInvite}
              className="w-[65px] h-[25px] text-[12px] text-sub font-pre-light rounded-lg border-[1px] border-lightgray focus:outline-none focus:ring-1 focus:ring-brand -ml-1"
            >
              초대하기
            </button>
          )}
        </div>
      </div>

      {/* 오류 메시지 표시 */}
      {error && (
        <div className="font-pre-light text-12 text-red-500 mb-2">{error}</div>
      )}

      {/* 멤버 리스트 */}
      {!error && (
        <div className="mt-4 space-y-4">
          {members.length > 0 ? (
            members.map((member) => (
              <MemberCard
                key={member.id}
                profileImg=""
                id={member.id}
                nickname={member.nickname}
                onDelete={() => handleDeleteMember(member.id)}
                showDeleteButton={userId === adminId}
              />
            ))
          ) : (
            <p className="text-12 font-pre-light text-gray">
              그룹에 해당하는 멤버가 없습니다. 그룹 멤버를 초대해보세요.
            </p>
          )}
        </div>
      )}
      {/* 초대코드 입력 & 그룹 삭제 버튼 */}
      <div className="absolute bottom-[33px] w-full flex flex-row items-center justify-between">
        {/* 초대코드입력 버튼 */}
        <Link to="/my/invitecodeinput">
          <button className="text-12 font-pre-light border-lightgray border rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-brand">
            초대코드 입력
          </button>
        </Link>

        {/* 그룹 삭제 버튼 */}
        {userId === adminId && members.length > 0 && (
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
