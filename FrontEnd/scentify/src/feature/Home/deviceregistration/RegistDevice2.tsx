import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerDevice } from '../../../apis/home/registdevice';
import { useAuthStore } from '../../../stores/useAuthStore';

function RegistDevice() {
  const [serial, setSerial] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 디바이스 등록 버튼 요청
  const handleRegisterDevice = async () => {
    setErrorMessage(''); // 기존 에러 메시지 초기화

    // 필수 입력값 검증
    if (!serial.trim() || !ipAddress.trim()) {
      setErrorMessage('시리얼 번호와 IP 주소를 입력해주세요.');
      return;
    }

    try {
      // `/home/registconnecting`으로 이동하여 로딩 화면 표시
      navigate('/home/registconnecting', {
        state: { serial, ipAddress, accessToken },
      });
    } catch (error: any) {
      // 백엔드 응답 상태 코드에 따라 에러 메시지 표시
      if (error.status === 409) {
        setErrorMessage('이미 등록된 기기입니다.');
      } else if (error.status === 403) {
        setErrorMessage('핸드셰이크 실패. 다시 시도해주세요.');
      } else if (error.status === 400) {
        setErrorMessage('요청이 잘못되었습니다.');
      }
    }
  };

  return (
    <div className="content px-4 pt-6 pb-8 h-full flex flex-col justify-between">
      {/* 입력 필드 영역 */}
      <div>
        <div className="text-center text-20 font-pre-bold mb-8">
          추가할 기기의 상세 정보를 <br />
          입력해주세요
        </div>

        {/* 시리얼 번호 입력 */}
        <div className="mb-6">
          <label className="text-sm font-pre-regular mb-2 block">
            시리얼 번호 (S/N)
          </label>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="시리얼 번호 입력"
            className="w-full px-4 py-3 rounded-lg bg-component font-pre-regular"
          />
        </div>

        {/* IP 주소 입력 */}
        <div className="mb-6">
          <label className="text-sm font-pre-regular mb-2 block">IP 주소</label>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="IP 주소 입력 (예: 192.168.1.1)"
            className="w-full px-4 py-3 rounded-lg bg-component font-pre-regular"
          />
        </div>

        {/* 에러 메시지 출력 */}
        {errorMessage && (
          <div className="text-red-500 text-sm font-pre-regular mb-4">
            {errorMessage}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div>
        <button
          onClick={handleRegisterDevice}
          className="w-full h-[48px] rounded-lg text-gray font-pre-bold border-[1px] border-lightgray"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default RegistDevice;
