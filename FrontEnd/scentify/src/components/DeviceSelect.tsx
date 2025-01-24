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
        className="border text-sm flex h-[36px] w-[120px] items-center justify-between rounded-lg border-lightgray p-3 font-pre-light"
      >
        {selectedDevice}
        <img src={ArrowDownIcon} alt="아래 화살표 이미지" />
      </button>
      {isOpen && (
        <div className="text-sm h-[36px] w-[120px] font-pre-light">
          <div className="border rounded-lg border-lightgray bg-white">
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
