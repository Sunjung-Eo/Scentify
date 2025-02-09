import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useMainDeviceStore } from "../../stores/useDeviceStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUserStore } from "../../stores/useUserStore";

import { getAllDevicesReservationMode } from "../../apis/control/getAllDevicesMode";
import { getAllDevicesAutomationMode } from "../../apis/control/getAllDevicesMode";
import { getDeviceInfo } from "../../apis/control/getDeviceInfo";
import { switchMode } from "../../apis/control/switchMode";

import { Mode } from "../../feature/control/main/ControlType";
import ModeToggle from "../../feature/control/main/ModeToggle";
import ModeChangeModal from "../../feature/control/main/ModeChangeModal";
import AutoManager from "../../feature/control/automation/AutoManager";
import BehaviorSetting from "../../feature/control/automation/BehaviorSetting";
import DetectionSetting from "../../feature/control/automation/DetectionSetting";
import DeodorizationSetting from "../../feature/control/automation/DeodorizationSetting";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import CreateReservation from "../../feature/control/reservation/CreateReservation";
import ModifyReservation from "../../feature/control/reservation/ModifyReservation";
import DeviceSelect from "../../components/Control/DeviceSelect";

import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";

const Control = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 기기 정보
  const { deviceIdsAndNames } = useUserStore();
  const { mainDevice } = useMainDeviceStore();

  // 기기 id들
  const deviceIds = deviceIdsAndNames
    ? Object.keys(deviceIdsAndNames).map(Number)
    : [];

  // 선택한 기기(기본값: 대표기기 - 등록순)
  const [selectedDevice, setSelectedDevice] = useState<number | null>(
    mainDevice?.id ?? null
  );

  // 기기 선택
  const handleDeviceChange = (deviceId: number) => {
    setSelectedDevice(deviceId);
  };
  useEffect(() => {
    if (mainDevice) {
      setSelectedDevice(mainDevice.id);
    }
  }, []);

  // 기기 정보 조회
  const { data: fetchDeviceData = {} } = useQuery({
    queryKey: ["deviceInfo"],
    queryFn: () => getDeviceInfo(deviceIds, accessToken),
  });
  const devicesInfo = fetchDeviceData;

  // 예약 관리 컴포넌트로 전달
  const deviceSelectItems =
    deviceIds.length === 0 || !devicesInfo?.devices
      ? []
      : deviceIds.map((deviceId) => {
          const deviceInfo = devicesInfo.devices.find(
            (device: any) => device.id === deviceId
          );
          return {
            deviceId: deviceInfo.id,
            name: deviceInfo.name,
            roomType: deviceInfo.roomType,
            isRepresentative: deviceInfo.id === mainDevice?.id ? true : false,
            defaultScentId: deviceInfo.defaultCombination,
          };
        });

  // 전체 예약 조회 API 호출
  const { data: reservationData = [] } = useQuery({
    queryKey: ["reservations", deviceIds, accessToken],
    queryFn: () => getAllDevicesReservationMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // 선택한 기기의 예약 정보 필터링
  const filteredReservations = selectedDevice
    ? reservationData.find((data) => data.deviceId === selectedDevice)
        ?.reservations || []
    : [];

  // 전체 예약 조회 API 호출
  const { data: automationData = [] } = useQuery({
    queryKey: ["automations", deviceIds, accessToken],
    queryFn: () => getAllDevicesAutomationMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // 선택한 기기의 자동화 모드 정보 필터링
  const filteredAutomations = selectedDevice
    ? automationData.find((data) => data.deviceId === selectedDevice)
        ?.automations || []
    : [];

  // 모드
  const selectedDeviceData = devicesInfo?.devices?.find(
    (device: any) => device.id === selectedDevice
  );
  // 현재 설정된 모드
  const [mode, setMode] = useState(selectedDeviceData?.mode ?? false);
  useEffect(() => {
    setMode(selectedDeviceData?.mode ?? false);
  }, [selectedDeviceData]);

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
  const handleConfirm = () => {
    if (selectedDevice) {
      switchMode(selectedDevice, nextMode, accessToken);
    }
    setMode(nextMode);
    setIsModal(false);
    setIsFirstRender(false);
  };

  // 모달 창 취소 버튼
  const handleCancel = () => {
    setIsModal(false);
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
                    <AutoManager
                      automationData={filteredAutomations}
                      devices={deviceSelectItems}
                      selectedDevice={selectedDevice}
                    />
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
        <Route
          index
          element={
            <AutoManager
              automationData={filteredAutomations}
              devices={deviceSelectItems}
              selectedDevice={selectedDevice}
            />
          }
        />
        <Route path="auto/behavior" element={<BehaviorSetting />} />
        <Route path="auto/deodorize" element={<DeodorizationSetting />} />
        <Route path="auto/detect" element={<DetectionSetting />} />
        <Route
          path="reservation/create"
          element={
            <CreateReservation
              devices={deviceSelectItems}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
            />
          }
        />
        <Route
          path="reservation/modify"
          element={
            <ModifyReservation
              devices={deviceSelectItems}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Control;
