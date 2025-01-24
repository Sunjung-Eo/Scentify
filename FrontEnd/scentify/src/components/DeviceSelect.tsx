import { useState } from "react";
import ArrowDownIcon from "../assets/icons/arrow-down-icon.svg";

// 기기 선택 타입입
interface DeviceSelectProps {
  devices: string[];
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
}

// 기기 선택
export default function DeviceSelect({
  devices,
  selectedDevice,
  onDeviceChange,
}: DeviceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[120px] h-[36px] p-3 border border-lightgray font-pre-light text-sm items-center justify-between rounded-lg"
      >
        {selectedDevice}
        <img src={ArrowDownIcon} alt="아래 화살표 이미지" />
      </button>
      {isOpen && (
        <div className="w-[120px] h-[36px] font-pre-light text-sm">
          <div className="border border-lightgray bg-white rounded-lg">
            {devices.map((device) => (
              <div
                key={device}
                onClick={() => {
                  onDeviceChange(device);
                  setIsOpen(false);
                }}
                className="p-1 pl-3"
              >
                {device}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
