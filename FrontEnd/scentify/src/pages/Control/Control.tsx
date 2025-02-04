import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import AutoManager from "../../feature/control/automation/AutoManager";
import ModeChangeModal from "../../feature/control/main/ModeChangeModal";
import BehaviorSetting from "../../feature/control/automation/BehaviorSetting";
import DeodorizationSetting from "../../feature/control/automation/DeodorizationSetting";
import DetectionSetting from "../../feature/control/automation/DetectionSetting";
import CreateReservation from "../../feature/control/reservation/CreateReservation";
import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";

import { useDeviceStore } from "../../stores/useDeviceStore";
import { useAuthStore } from "../../stores/useAuthStore";

import { getAllDevicesMode } from "../../apis/control/getAllDevicesMode";

import DeviceSelect from "../../components/Control/DeviceSelect";

const Control = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 기기 정보
  const { devices } = useDeviceStore();
  // 기기 id
  const deviceIds = devices
    .map((device) => device.id)
    .filter((id): id is number => id !== undefined);
  // 선택한 기기(기본값: 대표기기 - 등록순)
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  useEffect(() => {
    if (devices.length > 0) {
      const deviceId =
        devices.find((device) => device.isRepresentative)?.id || devices[0].id;
      if (deviceId) {
        setSelectedDevice(deviceId);
      }
    }
  }, [devices]);
  // 예약 관리 컴포넌트로 전달
  const deviceSelectItems = devices.map((device) => ({
    deviceId: device.id,
    name: device.name,
    isRepresentative: device.isRepresentative,
  }));

  // 전체 예약 조회 API 호출
  const { data: reservationData = [] } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getAllDevicesMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // 선택한 기기의 예약 정보 필터링
  const filteredReservations = selectedDevice
    ? reservationData.find((data) => data.deviceId === selectedDevice)
        ?.reservations || []
    : [];

  // mode - 어떤 모드인지 백엔드에 전달할 것
  const [mode, setMode] = useState<Mode>(false); // 백엔드에 전달한 현재 모드 상태
  const [isModal, setIsModal] = useState<boolean>(false); // 모달 활성화
  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true); // 처음 디폴트 모드 (예약 모드)

  // 다른 모드 클릭 시 모달 표시
  const handleModeChange = (newMode: Mode) => {
    if (mode !== newMode) {
      setNextMode(newMode);
      setIsModal(true);
    }
  };
  // 모달 창 확인 버튼
  // 확인 눌렀을 때 백엔드에 전달하는 추가 로직 필요
  const handleConfirm = () => {
    setMode(nextMode);
    setIsModal(false);
    setIsFirstRender(false);
  };
  // 모달 창 취소 버튼
  const handleCancel = () => {
    setIsModal(false);
  };

  // 기기 선택
  const handleDeviceChange = (deviceId: number) => {
    setSelectedDevice(deviceId);
  };

  return (
    <div className="content pt-5">
      <Routes>
        <Route
          index
          element={
            <div className="relative flex flex-col w-full px-4">
              <div>
                <div className="flex mb-4 items-center gap-1">
                  <img src={RemoteIcon} alt="리모컨 이미지" />
                  <h2 className="mt-0.5 font-pre-medium text-20">모드 설정</h2>
                </div>
                <ModeToggle
                  currentMode={mode}
                  onModeChange={handleModeChange}
                />
              </div>
              <div
                className={`font-pre-medium text-20 ${
                  isFirstRender || !mode ? "mt-14" : "mt-0"
                }`}
              >
                <div className="absolute left-[225px] top-[135px] z-40">
                  <DeviceSelect
                    devices={deviceSelectItems}
                    selectedDevice={selectedDevice}
                    onDeviceChange={handleDeviceChange}
                  />
                </div>
                {isFirstRender || !mode ? (
                  selectedDevice !== null && (
                    <ReservationManager
                      reservationData={filteredReservations}
                      selectedDevice={selectedDevice}
                    />
                  )
                ) : (
                  <div>
                    <div className="h-[130px] mt-5 mb-10 p-4 bg-component rounded-lg">
                      <p>자동화 모드 설명 ~~~</p>
                    </div>
                    {/* <AutoManager
                      selectedDevice={selectedDevice}
                      onDeviceChange={handleDeviceChange}
                    /> */}
                  </div>
                )}
              </div>

              {isModal && (
                <ModeChangeModal
                  nextMode={nextMode}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              )}
            </div>
          }
        />
        {/* <Route index element={<AutoManager />} /> */}
        <Route path="auto/behavior" element={<BehaviorSetting />} />
        <Route path="auto/deodorize" element={<DeodorizationSetting />} />
        <Route path="auto/detect" element={<DetectionSetting />} />
        {/* <Route path="reservation/create" element={<CreateReservation />} /> */}
      </Routes>
    </div>
  );
};

export default Control;
