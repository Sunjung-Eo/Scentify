import React, { useState, useEffect } from 'react';
import { createInviteCode } from '../../apis/invite/createInviteCode';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUserStore } from '../../stores/useUserStore';

// 초대 코드를 생성하고 화면에 표시하는 컴포넌트
function Invite() {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authStore = useAuthStore();
  const accessToken = authStore.accessToken; // 사용자 인증 토큰
  const { deviceIdsAndNames } = useUserStore();

  const deviceIds = deviceIdsAndNames
    ? Object.keys(deviceIdsAndNames).map(Number)
    : [];

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        // deviceIds가 비어있지 않은 경우에만 첫 번째 디바이스 ID 사용
        if (deviceIds.length > 0) {
          const deviceId = deviceIds[0]; // 첫 번째 디바이스 ID 사용
          const result = await createInviteCode(deviceId, accessToken);

          if (result) {
            setInviteCode(result.inviteCode);
          } else {
            throw new Error('초대 코드 생성에 실패했습니다.');
          }
        } else {
          throw new Error('등록된 디바이스가 없습니다.');
        }
      } catch (err: any) {
        setError(err.message || '초대 코드 생성에 실패했습니다.');
      }
    };
    fetchInviteCode();
  }, [accessToken]);

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
