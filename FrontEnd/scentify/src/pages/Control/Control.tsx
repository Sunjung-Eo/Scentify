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
import AutoManager from "../../feature/control/automation/AutoManager";
import BehaviorSetting from "../../feature/control/automation/BehaviorSetting";
import DetectionSetting from "../../feature/control/automation/DetectionSetting";
import DeodorizationSetting from "../../feature/control/automation/DeodorizationSetting";
import ReservationManager from "../../feature/control/reservation/ReservationManager";
import CreateReservation from "../../feature/control/reservation/CreateReservation";
import ModifyReservation from "../../feature/control/reservation/ModifyReservation";
import DeviceSelect from "../../components/Control/DeviceSelect";
import Modal from "../../components/Alert/Modal";

import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";
import AlarmIcon from "../../assets/icons/alarm-icon.svg";

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

  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  const [activeTab, setActiveTab] = useState<boolean>(false); // 현재 활성화 된 탭(기본값: 0 예약)

  // 다른 모드 클릭 시 모달 표시
  const [modalOpen, setModalOpen] = useState(false); // 모달달 표시 여부
  const [modalMessage, setModalMessage] = useState(""); // 모달달 메시지
  const handleModeChange = (newMode: Mode) => {
    if (mode !== newMode) {
      const getModeName = () => {
        return nextMode === false ? "예약 " : "자동화 ";
      };
      setNextMode(newMode);
      setModalMessage(`${getModeName()}모드로 변경하시겠습니까?`);
      setModalOpen(true);
    }
  };
  // 모달 창 확인 버튼
  const handleConfirm = () => {
    if (selectedDevice) {
      switchMode(selectedDevice, nextMode, accessToken);
    }
    setMode(nextMode);
    setModalOpen(false);
  };

  // 모달 창 취소 버튼
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <div className="content pt-5">
      <Routes>
        <Route
          index
          element={
            <div className="relative flex flex-col w-full px-4">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div className="flex mb-4 items-center gap-1">
                    <img src={RemoteIcon} alt="리모컨 이미지" />
                    <h2 className="mt-0.5 font-pre-medium text-16">
                      모드 변경 버튼
                    </h2>
                  </div>
                  <ModeToggle
                    currentMode={mode}
                    onModeChange={handleModeChange}
                  />
                </div>
                <div className="mt-2 border-0.2 border-sub text-center pre-light text-12 rounded-lg">
                  {mode === false
                    ? "지금은 예약 모드입니다."
                    : "지금은 자동화 모드입니다."}
                </div>
              </div>
              <div className={"mt-12 font-pre-medium text-16"}>
                <div className="absolute left-[225px] top-[115px] z-40">
                  <DeviceSelect
                    devices={deviceSelectItems}
                    selectedDevice={selectedDevice}
                    onDeviceChange={handleDeviceChange}
                  />
                </div>
                <div>
                  <div className="flex items-start gap-1">
                    <img src={AlarmIcon} alt="알람 이미지" />
                    <h2>스케줄 관리</h2>
                  </div>
                  <div className="flex mt-6 ml-3 text-14 gap-8">
                    <div
                      onClick={() => setActiveTab(false)}
                      className={`w-[50px] text-center cursor-pointer ${
                        activeTab === false ? "border-b-[3px] border-sub" : ""
                      }`}
                    >
                      예약
                    </div>
                    <div
                      onClick={() => setActiveTab(true)}
                      className={`w-[50px] text-center cursor-pointer ${
                        activeTab === true ? "border-b-[3px] border-sub" : ""
                      }`}
                    >
                      자동화
                    </div>
                  </div>
                </div>
                {activeTab === false ? (
                  <ReservationManager
                    reservationData={filteredReservations}
                    selectedDevice={selectedDevice}
                  />
                ) : (
                  <AutoManager
                    automationData={filteredAutomations}
                    devices={deviceSelectItems}
                    selectedDevice={selectedDevice}
                  />
                )}
              </div>
              {modalOpen && (
                <Modal
                  message={modalMessage}
                  showButtons={true}
                  confirmText="확인"
                  cancelText="취소"
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
