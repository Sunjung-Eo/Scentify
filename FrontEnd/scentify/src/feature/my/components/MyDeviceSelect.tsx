import { useState } from "react";
import ArrowDownIcon from "../../../assets/icons/arrow-down-icon.svg";
import CrownIcon from "../../../assets/icons/crown-icon.svg";

// 기기 선택 타입
export interface DeviceSelectItem {
  deviceId: number;
  name: string | null;
  isRepresentative: boolean;
}

export interface DeviceSelectProps {
  devices: DeviceSelectItem[];
  selectedDevice: number | null;
  onDeviceChange: (deviceId: number) => void;
}

// 기기 선택
export default function MyDeviceSelect({
  devices,
  selectedDevice,
  onDeviceChange,
}: DeviceSelectProps) {
  // 드롭박스 오픈 여부
  const [isOpen, setIsOpen] = useState(false);
  // 현재 선택된 기기 (기기가 없으면 undefined)
  const selected = devices.find((device) => device.deviceId === selectedDevice);
  // 기기 정렬
  const sortedDevices = [...devices].sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name); // 이름 기준 오름차순
    }
    return 0;
  });

  return (
    <div className="relative">
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[120px] h-[30px] p-3 border-[0.7px] border-gray font-pre-light text-12 justify-between items-center rounded-lg"
        disabled={devices.length === 0} // 기기가 없으면 클릭 방지
      >
        <div className="flex items-center">
          {selected?.isRepresentative && (
            <img
              src={CrownIcon}
              alt="대표 기기 아이콘"
              className="w-[16px] h-[16px] mr-[4px]"
            />
          )}
          <span
            className={`text-left ${!selected?.isRepresentative ? "pl-[19px]" : ""}`}
          >
            {devices.length > 0 ? selected?.name || "-" : "-"}{" "}
            {/* 기기가 없으면 "-" 표시 */}
          </span>
        </div>
        <img src={ArrowDownIcon} alt="아래 화살표 이미지" />
      </button>

      {/* 드롭다운 리스트 */}
      {isOpen && devices.length > 0 && (
        <div className="absolute top-full left-0 w-[120px] bg-white font-pre-light text-12 border-0.2 border-lightgray rounded-lg shadow-lg z-50">
          {sortedDevices.map((device, index) => (
            <div
              key={`device-${device.deviceId}-${index}`}
              onClick={() => {
                onDeviceChange(device.deviceId);
                setIsOpen(false);
              }}
              className="flex p-1 pl-3"
            >
              {device.isRepresentative ? (
                <>
                  <img
                    src={CrownIcon}
                    alt="대표 기기 아이콘"
                    className="w-[16px] h-[16px] mr-[3px]"
                  />
                  <span>{device.name}</span>
                </>
              ) : (
                <div className="ml-[19px]">{device.name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
