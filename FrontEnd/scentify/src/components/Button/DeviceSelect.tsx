import { useState } from "react";

// 기기 선택
export default function DeviceSelect({
  devices,
  selectedDevice,
  onDeviceChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[120px] h-[36px] p-3 border border-lightgray font-pre-light text-sm items-center justify-between rounded-lg"
      >
        {selectedDevice}
        {/* svg로 대체체 */}
        <p>▼</p>
      </button>
      {isOpen && (
        <div className="w-[120px] h-[36px] font-pre-light text-sm">
          <div className="border border-lightgray rounded-lg">
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
