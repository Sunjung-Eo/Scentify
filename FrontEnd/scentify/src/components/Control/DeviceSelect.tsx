import { useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon.svg";

// 기기 선택 타입
export interface DeviceSelectItem {
  deviceId: number;
  name: string | null;
  roomType: number | null;
  isRepresentative: boolean;
  defaultScentId: number;
}

export interface DeviceSelectProps {
  devices: DeviceSelectItem[];
  selectedDevice: number | null;
  onDeviceChange: (deviceId: number) => void;
}

// 기기 선택
export default function DeviceSelect({
  devices,
  selectedDevice,
  onDeviceChange,
}: DeviceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 현재 선택된 기기
  const selected = devices.find((device) => device.deviceId === selectedDevice);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[120px] h-[36px] p-3 border-0.2 border-lightgray font-pre-light text-12 justify-between items-center rounded-lg"
      >
        <div>
          <span
            className={`flex-grow text-left ${
              selected?.isRepresentative ? "pl-[0px]" : "pl-[19px]"
            }`}
          ></span>
          {selected?.isRepresentative ? `👑 ${selected.name}` : selected?.name}
        </div>
        <img src={ArrowDownIcon} alt="아래 화살표 이미지" />
      </button>
      {isOpen && (
        <div className="w-[120px] h-[36px] font-pre-light text-12">
          <div className="border-0.2 border-lightgray bg-white rounded-lg">
            {devices.map((device, index) => (
              <div
                key={`device-${device.deviceId}-${index}`}
                onClick={() => {
                  onDeviceChange(device.deviceId);
                  setIsOpen(false);
                }}
                className="flex p-1 pl-3"
              >
                {device.isRepresentative ? (
                  <div>👑 {device.name}</div>
                ) : (
                  <div className="ml-[19px]">{device.name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
