import { createInviteCode } from "../../apis/invite/createInviteCode";
import { useAuthStore } from "../../stores/useAuthStore";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// 초대 코드 생성 페이지
function Invite() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuthStore();
  const location = useLocation(); // GroupList에서 전달된 데이터 받기
  const selectedDeviceId = location.state?.deviceId; // 선택된 기기 ID

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        if (!selectedDeviceId) {
          throw new Error("기기가 선택되지 않았습니다.");
        }

        const result = await createInviteCode(selectedDeviceId, accessToken);
        if (result) {
          setInviteCode(result.inviteCode);
        } else {
          throw new Error("초대 코드 생성에 실패했습니다.");
        }
      } catch (err: any) {
        setError(err.message || "초대 코드 생성에 실패했습니다.");
      }
    };

    fetchInviteCode();
  }, [selectedDeviceId, accessToken]); // 선택된 기기 ID가 변경될 때마다 실행

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-20 font-pre-bold mb-12">초대하기</h1>
      <div className="bg-white p-6 rounded-2xl w-[260px] h-[300px] border-[1px] border-gray flex justify-center items-center">
        {inviteCode ? (
          <div className="text-center">
            {/* 초대 코드가 성공적으로 생성된 경우 */}
            <p className="font-pre-regular text-12 mb-3 block">
              나의 초대 코드
            </p>
            <p className="font-pre-regular text-[32px]">{inviteCode}</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 ">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-pre-medium">
              초대 코드를 생성 중입니다...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Invite;
