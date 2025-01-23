import cuttingdeviceImg from "../../../assets/images/cuttingdevice2.svg";
import crownIcon from "../../../assets/icons/crown-icon.svg";

//더미 데이터
const dummyDevices = [
  {
    deviceId: 1,
    name: "우리 방",
    slot1: "레몬",
    slot2: "자스민",
    slot3: "화이트머스크",
    slot4: "유칼립투스",
    isRepresentative: true, // 대표기기 여부
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

//cards에서 space-y-4: 카드 컴포넌트간의 수직 간격을 조정.
//card에서  개별 카드 내부의 자식 요소들 간의 간격을 조정.
//deviceImg는 map내부에 위치하면서 초록색 박스에 relative를 추가하고 deviceImg에 absolute -left-6적용(경계에 걸쳐보임)
const DeviceCard = () => {
  return (
    <div className="cards space-y-4">
      {dummyDevices.map((device) => (
        // 오른쪽으로 정렬하기 위해 초록색박스와 기기img묶어둠
        <div key={device.deviceId} className="relative flex justify-end mt-4">
          <div className="card relative bg-sub rounded-3xl w-[290px] h-[120px] px-4 py-2 shadow-md flex flex-col">
            {/* 디바이스사진 */}
            <img
              src={cuttingdeviceImg}
              alt="Device Icon"
              className="absolute -left-11 bottom-0"
            />

            {/* Text and Content묶기*/}
            <div className="ml-12 flex flex-col gap-1">
              {/* 디바이스 이름과 왕관 */}
              <div className="flex items-center gap-1 text-pre-bold text-white text-sm">
                {device.name}{" "}
                {device.isRepresentative && (
                  <img
                    src={crownIcon}
                    alt="Crown Icon"
                    className="ml-1 w-4 h-4"
                  />
                )}
              </div>

              {/* 디바이스 장착 향 */}
              <div className="text-pre-regular text-gray text-[9px]">
                <p>
                  {device.slot1}, {device.slot2}, {device.slot3}, {device.slot4}
                </p>
              </div>

              {/* 예약모드 */}
              <div className="flex items-center">
                <div className="flex items-center px-3 py-0.5 border border-component rounded-full text-component text-[8px]">
                  예약 모드
                  <span className="ml-1 w-1 h-1 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex justify-end gap-2 mt-auto">
              <button
                className={`px-2 py-1 rounded-lg text-pre-medium text-[10px] ${
                  device.isRepresentative
                    ? "bg-brand text-white"
                    : "bg-component text-sub border border-brand"
                }`}
              >
                대표기기로 설정
              </button>
              <button className="px-2 py-1 bg-component text-sub rounded-lg text-pre-medium text-[10px]">
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
