import DoneRing from '../../../assets/images/Done_ring_round.svg';
import { Link, useLocation } from 'react-router-dom';
import { useDeviceStore } from '../../../stores/useDeviceStore';
import { useEffect } from 'react';

function ConnectSuccess() {
  const location = useLocation();
  const { id } = location.state || {};
  const { setMainDevice } = useDeviceStore();

  // 디바이스 id 전역 상태 업데이트
  useEffect(() => {
    if (id) {
      setMainDevice(id); // ✅ 기기 ID를 전역 상태에 반영
    }
  }, [id, setMainDevice]);

  return (
    <div className="content h-full px-4 pt-6 pb-8 flex flex-col justify-between">
      {/* 연결 성공 메시지 영역 */}
      <div className="flex flex-col mt-6 items-center text-center">
        <div className="mt-20">
          <img src={DoneRing} alt="image" />
        </div>
        <p className="mt-16 text-20 font-pre-light">연결에 성공했습니다!</p>
        <p className="mt-4 text-12 font-pre-light text-gray">
          다음 단계로 넘어가주세요.
        </p>
      </div>

      {/* 다음 버튼 영역 */}
      <div>
        <Link to="/home/registcapsule" state={{ id: id }}>
          <button className="w-full h-[48px] rounded-lg text-gray font-pre-bold border-[1px] border-lightgray">
            다음
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ConnectSuccess;
