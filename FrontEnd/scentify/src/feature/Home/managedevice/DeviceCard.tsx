import React, { useState } from "react";
import cuttingdeviceImg from "../../../assets/images/cuttingdevice2.svg";
import crownIcon from "../../../assets/icons/crown-icon.svg";

// 초기 더미 데이터
const initialDevices = [
  {
    deviceId: 1,
    name: "우리 방",
    slot1: "레몬",
    slot2: "자스민",
    slot3: "화이트머스크",
    slot4: "유칼립투스",
    isRepresentative: true,
  },
  {
    deviceId: 2,
    name: "거실",
    slot1: "라벤더",
    slot2: "시트러스",
    slot3: "로즈",
    slot4: "샌달우드",
    isRepresentative: false,
  },
  {
    deviceId: 3,
    name: "침실",
    slot1: "민트",
    slot2: "페퍼민트",
    slot3: "유칼립투스",
    slot4: "티트리",
    isRepresentative: false,
  },
];
// useState를 통한 상태관리(초기 devices 데이터는 배열로 저장.삭제 버튼 클릭 시 filter 메서드를 사용해 선택된 deviceId를 제외.)
//일단 모든 기기의 isRepresentative를 false로 설정. 선택된 기기의 isRepresentative를 true로 업데이트.
//기기 삭제(handleDelete 함수로 deviceId를 받아 filter로 해당 deviceId를 제외한 새로운 배열을 상태로 저장.)

//cards에서 space-y-4: 카드 컴포넌트간의 수직 간격을 조정.
//card에서  개별 카드 내부의 자식 요소들 간의 간격을 조정.
//deviceImg는 map내부에 위치하면서 초록색 박스에 relative를 추가하고 deviceImg에 absolute -left-6적용(경계에 걸쳐보임)
const DeviceCard = () => {
  const [devices, setDevices] = useState(initialDevices); // 디바이스 상태 관리

  // 삭제 버튼 클릭 핸들러
  const handleDelete = (deviceId: number) => {
    setDevices((prevDevices) =>
      prevDevices.filter((d) => d.deviceId !== deviceId)
    );
  };

  // 대표기기 설정 핸들러
  const handleSetRepresentative = (deviceId: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d.deviceId === deviceId
          ? { ...d, isRepresentative: true }
          : { ...d, isRepresentative: false }
      )
    );
  };
  return (
    <div className="cards space-y-4">
      {devices.map((device) => (
        // 오른쪽으로 정렬하기 위해 초록색박스와 기기img묶어둠
        <div key={device.deviceId} className="relative mt-4 flex justify-end">
          <div className="card relative flex h-[120px] w-[290px] flex-col rounded-3xl bg-sub px-4 py-2 shadow-md">
            {/* 디바이스사진 */}
            <img
              src={cuttingdeviceImg}
              alt="Device Icon"
              className="absolute -left-11 bottom-0"
            />

            {/* Text and Content묶기*/}
            <div className="ml-12 flex flex-col gap-1">
              {/* 디바이스 이름과 왕관 */}
              <div className="text-pre-bold text-sm flex items-center gap-1 text-white">
                {device.name}{" "}
                {device.isRepresentative && (
                  <img
                    src={crownIcon}
                    alt="Crown Icon"
                    className="ml-1 h-4 w-4"
                  />
                )}
              </div>

              {/* 디바이스 장착 향 */}
              <div className="text-pre-regular text-[9px] text-gray">
                <p>
                  {device.slot1}, {device.slot2}, {device.slot3}, {device.slot4}
                </p>
              </div>

              {/* 예약모드 */}
              <div className="flex items-center">
                <div className="border flex items-center rounded-full border-component px-3 py-0.5 text-[8px] text-component">
                  예약 모드
                  <span className="ml-1 h-1 w-1 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="mt-auto flex justify-end gap-2">
              <button
                onClick={() => handleSetRepresentative(device.deviceId)} // 대표기기로 설정
                className={`text-pre-medium rounded-lg px-2 py-1 text-[10px] ${
                  device.isRepresentative
                    ? "bg-brand text-white"
                    : "border border-brand bg-component text-sub"
                }`}
              >
                대표기기로 설정
              </button>
              <button
                onClick={() => handleDelete(device.deviceId)} // 삭제
                className="text-pre-medium rounded-lg bg-component px-2 py-1 text-[10px] text-sub"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceCard;
