import { useState } from "react";
import AlarmIcon from "../../../assets/icons/alarm-icon.svg";
import DeviceSelect from "../../../components/Button/DeviceSelect";

export default function ReservationManager() {
  // 대표기기, 기기 명, 각 기기 별 예약 목록 - api나 저장소, 상위 컴포넌트에서 가져오기
  const [selectedDevice, setSelectedDevice] = useState("기기A");
  const reservations: Record<string, string[]> = {
    기기A: [],
    기기B: ["예약 1", "예약 2"],
    기기C: ["예약 3"],
  };
  const devices = Object.keys(reservations);
  // 디바이스 선택
  const handleDeviceChange = (device: string) => {
    setSelectedDevice(device);
  };
  return (
    <div>
      <div className="relative">
        <div className="flex items-start gap-1">
          <img src={AlarmIcon} alt="알람 이미지" />
          <h2>예약 관리</h2>
        </div>
        <div className="absolute top-[-4px] left-[209px]">
          <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={handleDeviceChange}
          />
        </div>
      </div>
    </div>
  );
}
