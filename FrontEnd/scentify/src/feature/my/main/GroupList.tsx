import {
  GroupInfoResponse,
  DeleteMemberRequest,
  DeleteGroupRequest,
} from "./groupTypes";
import { useState, useEffect, useMemo } from "react"; //useMemo: 객체 사용시 불필요한 렌더링 막기 위함
import MemberCard from "./MemberCard";
import { useUserStore } from "../../../stores/useUserStore"; //유저상태관리(사용자 기기정보)
import { useAuthStore } from "../../../stores/useAuthStore";
import { getGroupByDeviceId } from "../../../apis/group/getGroupByDeviceId"; // 그룹 정보 조회 API
import { deleteGroupMember } from "../../../apis/group/deleteGroupMember"; // 개별 멤버 삭제 API
import { deleteGroup } from "../../../apis/group/deleteGroup"; // 그룹 삭제 API
import { Link, useNavigate } from "react-router-dom";
import rigtarrowIcon from "../../../assets/icons/rightarrow-icon.svg";
import Modal from "../../../components/Alert/Modal";
import MyDeviceSelect from "./MyDeviceSelect";

export const GroupList = () => {
  // 사용자가 등록한 기기 ID 목록 가져오기 (등록된 디바이스가 없을 시 빈 배열 사용)
  const deviceIdsAndNames = useUserStore((state) => state.deviceIdsAndNames);
  const memoizedDeviceIdsAndNames = useMemo(
    () => deviceIdsAndNames ?? {},
    [deviceIdsAndNames]
  );
  const mainDeviceId = useUserStore((state) => state.mainDeviceId);
  const userId = useUserStore((state) => state.id);

  // 기기 리스트 (옵션)
  const deviceList = useMemo(
    () =>
      Object.entries(memoizedDeviceIdsAndNames).map(([id, name]) => ({
        deviceId: Number(id),
        name,
        isRepresentative: Number(id) === mainDeviceId, // 메인 기기 여부
      })),
    [memoizedDeviceIdsAndNames, mainDeviceId]
  );

  // 선택된 기기 ID (초기값: 메인 기기)
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
    mainDeviceId || null
  );
  // 현재 그룹에 속한 멤버 목록 (초기값: 빈 배열)
  const [members, setMembers] = useState<{ id: string; nickname: string }[]>(
    []
  );
  const [groupId, setGroupId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();
  const [adminId, setAdminId] = useState<string>("");
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 선택한 기기의 그룹 정보 가져오기
  useEffect(() => {
    const fetchGroupData = async () => {
      if (selectedDeviceId === null) return;
      try {
        // API 요청: 선택한 기기의 그룹 정보 가져오기
        const response: GroupInfoResponse = await getGroupByDeviceId(
          selectedDeviceId,
          accessToken
        );

        const { group } = response;

        // API응답 데이터를 가져와 상태로 저장하므로 setAdminId와 setGroupId를 명시적으로 호출해야함
        // 해당 기기의 관리자 ID를 상태로 저장
        setAdminId(group.adminId || "");
        // 해당 기기의 그룹 ID 설정
        setGroupId(group.id.toString());

        // 멤버 목록을 객체 배열로 변환(각 멤버의 ID및 닉네임 저장)
        const formattedMembers = [
          { id: group.adminId, nickname: group.adminNickname || "알 수 없음" },
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

        setMembers(formattedMembers.filter((member) => member.id !== userId));
      } catch (err: any) {
        setError(err.message);
        setMembers([]); // 오류 시 멤버 상태 초기화
      }
    };

    fetchGroupData();
  }, [selectedDeviceId, accessToken]);

  // 개별 멤버 삭제
  const handleDeleteMember = async (memberId: string) => {
    try {
      const requestData: DeleteMemberRequest = { groupId, memberId };
      await deleteGroupMember(requestData, accessToken);
      setMembers(members.filter((member) => member.id !== memberId)); // 삭제된 멤버 제외 후 리스트 업데이트
    } catch (error) {}
  };

  // 그룹 삭제
  const handleDeleteGroup = async () => {
    try {
      const requestData: DeleteGroupRequest = { groupId };
      await deleteGroup(requestData, accessToken);
      setMembers([]);
      setGroupId("");
    } catch (error) {}
  };

  // 초대하기 버튼 클릭 시 페이지 이동하면서 selectedDeviceId 전달
  const handleInvite = () => {
    if (selectedDeviceId) {
      navigate("/my/invite", { state: { deviceId: selectedDeviceId } });
    }
  };

  return (
    <>
      <div className="relative">
        <div className="flex flex-row items-center justify-between mt-[10px] mb-[12px]">
          <div className="font-pre-light text-14 text-gray whitespace-nowrap">
            멤버 목록
          </div>
          {/* 드롭다운과 초대하기 버튼 컨테이너 */}
          <div
            className={`flex items-center ${userId === adminId ? "gap-x-4" : "justify-end w-full"}`}
          >
            {/* DeviceSelect 드롭다운 */}
            <div className="relative">
              <MyDeviceSelect
                devices={deviceList}
                selectedDevice={selectedDeviceId}
                onDeviceChange={setSelectedDeviceId}
              />
            </div>
            {/* 초대하기 버튼 */}
            {userId === adminId && (
              <button
                onClick={handleInvite}
                className="w-[65px] h-[30px] text-[12px] font-pre-light rounded-lg border-[0.7px] border-gray active:text-bg active:bg-brand active:border-0"
              >
                초대하기
              </button>
            )}
          </div>
        </div>

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="font-pre-light text-12 text-red-500 mb-2">
            {error}
          </div>
        )}
        {/* 멤버 리스트 */}
        <div className="overflow-y-auto max-h-[calc(100vh-450px)]">
          {!error && (
            <div className="flex flex-col">
              {deviceList.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[210px]">
                  <p className="text-12 font-pre-light text-gray text-center leading-[1.5]">
                    현재 등록된 기기가 없습니다.
                    <br />
                    홈에서 기기 추가를 해보세요.
                  </p>
                </div>
              ) : members.length > 0 ? (
                members.map((member) => (
                  <MemberCard
                    key={member.id}
                    id={member.id}
                    nickname={member.nickname}
                    onDelete={() => handleDeleteMember(member.id)}
                    showDeleteButton={userId === adminId}
                    isAdmin={member.id === adminId}
                  />
                ))
              ) : (
                // userId === adminId && members.length === 0 인 경우,
                userId === adminId && (
                  <div className="flex flex-col justify-center items-center h-[210px]">
                    <p className="text-12 font-pre-light text-gray text-center leading-[1.5]">
                      그룹에 해당하는 멤버가 없습니다.
                      <br />
                      그룹 멤버를 초대해보세요.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* 그룹 삭제 버튼 */}
      <div className="absolute bottom-[40px] w-full flex justify-end">
        {userId === adminId && members.length > 0 && (
          <button
            className="w-[83px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
            onClick={() => setDeleteModalOpen(true)}
          >
            그룹 삭제
          </button>
        )}
      </div>

      {/* 그룹 삭제 모달 */}
      {deleteModalOpen && (
        <Modal
          message="그룹을 삭제하시겠습니까?"
          onConfirm={async () => {
            await handleDeleteGroup();
            setDeleteModalOpen(false);
          }}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};
