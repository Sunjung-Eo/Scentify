import { useState } from "react";
import ArrowDownIcon from "../../assets/icons/arrow-down-icon.svg";
// 기기 선택 타입
interface DeviceSelectItem {
  deviceId: number;
  name: string | null;
  isRepresentative: boolean;
}

interface DeviceSelectProps {
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
  const getSelectedDeviceName = () => {
    const selected = devices.find(
      (device) => device.deviceId === selectedDevice
    );
    return selected?.isRepresentative ? `👑 ${selected.name}` : selected?.name;
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[120px] h-[36px] p-3 border-0.2 border-lightgray font-pre-light text-12 items-center justify-between rounded-lg"
      >
        {getSelectedDeviceName()}
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
                  <div>{device.name}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
