import { Link } from "react-router-dom";
import { useDeviceStore } from "../../../stores/useDeviceStore";

function RegistDevice2() {
  const { serial, ip_address, setSerial, setIPAddress } = useDeviceStore();

  // IP 주소 블록 분할
  const ipBlocks = ip_address.split("."); // "192.168.1.1" → ["192", "168", "1", "1"]

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    console.log("저장된 시리얼 번호:", serial);
    console.log("저장된 IP 주소:", ip_address);
    // 여기서 서버로 데이터를 전송하거나 추가 로직을 처리할 수 있습니다.
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
            value={serial} // 전역 상태의 serial 값을 바인딩
            onChange={(e) => setSerial(e.target.value)} // 상태 업데이트
            placeholder="시리얼 번호 입력"
            className="w-full px-4 py-3 rounded-lg bg-component font-pre-regular"
          />
        </div>

        {/* IP 주소 입력 */}
        <div>
          <label className="text-sm font-pre-regular mb-2 block">IP 주소</label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={ipBlocks[index] || ""} // 해당 블록 값 설정
                  onChange={(e) => {
                    const updatedBlock = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
                    const updatedIP = [...ipBlocks]; // 기존 블록 복사
                    updatedIP[index] = updatedBlock; // 해당 블록 업데이트
                    setIPAddress(updatedIP.join(".")); // 업데이트된 IP 주소 상태 저장
                  }}
                  maxLength={3}
                  className="w-16 px-2 py-2 rounded-lg text-center bg-component"
                />
                {index < 3 && <span className="text-gray-500">.</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 영역 */}
      <div>
        <Link to="/home/registconnecting">
          <button
            onClick={handleSave} // 저장 버튼 클릭 시 handleSave 호출
            className="w-full h-[48px] rounded-lg text-gray font-pre-bold border-[1px] border-lightgray"
          >
            저장
          </button>
        </Link>
      </div>
    </div>
  );
}

export default RegistDevice2;
