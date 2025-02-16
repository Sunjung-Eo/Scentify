import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useMainDeviceStore } from "../../stores/useDeviceStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUserStore } from "../../stores/useUserStore";

import { getAllDevicesReservationMode } from "../../apis/control/getAllDevicesMode";
import { getAllDevicesAutomationMode } from "../../apis/control/getAllDevicesMode";
import { getDeviceInfo } from "../../apis/control/getDeviceInfo";
import { switchMode } from "../../apis/control/switchMode";

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
import ProtectedRoute from "../../components/Control/ProtectedRoute";

import { Mode, DeviceInfo } from "../../feature/control/main/ControlType";
import { DeviceSelectItem } from "../../components/Control/DeviceSelect";

import "../../styles/global.css";
import RemoteIcon from "../../assets/icons/remote-icon.svg";
import AlarmIcon from "../../assets/icons/alarm-icon.svg";

const Control = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const queryClient = useQueryClient();

  // 기기 정보
  const { deviceIdsAndNames } = useUserStore();
  const { mainDevice } = useMainDeviceStore();
  // 기기 id들
  const deviceIds = deviceIdsAndNames
    ? Object.keys(deviceIdsAndNames).map(Number)
    : [];
  // 선택한 기기(기본값: 대표기기)
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
  const { data: fetchDeviceData = {}, isLoading } = useQuery({
    queryKey: ["deviceInfo"],
    queryFn: () => getDeviceInfo(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  const devicesInfo = fetchDeviceData;
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["deviceInfo"] });
  }, [deviceIds]);

  // 예약 관리 컴포넌트로 전달
  const deviceSelectItems =
    deviceIds.length === 0 || !devicesInfo?.devices
      ? []
      : deviceIds
          .map((deviceId) => {
            const deviceInfo = devicesInfo.devices.find(
              (device: DeviceInfo) => device.id === deviceId
            );
            if (!deviceInfo) {
              return null;
            }
            return {
              deviceId: deviceInfo.id,
              name: deviceInfo.name,
              roomType: deviceInfo.roomType,
              isRepresentative: deviceInfo.id === mainDevice?.id ? true : false,
              defaultScentId: deviceInfo.defaultCombination,
            };
          })
          .filter((device): device is DeviceSelectItem => device !== null);

  // 예약 모드 정보 - query
  const { data: reservationData = [] } = useQuery({
    queryKey: ["reservations", deviceIds, accessToken],
    // 전체 예약 조회 API 호출
    queryFn: () => getAllDevicesReservationMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // 선택한 기기의 예약 정보 필터링
  const filteredReservations = selectedDevice
    ? reservationData.find((data) => data.deviceId === selectedDevice)
        ?.reservations || []
    : [];

  // 자동화 모드 정보 - query
  const { data: automationData = [] } = useQuery({
    queryKey: ["automations", deviceIds, accessToken],
    // 전체 예약 조회 API 호출
    queryFn: () => getAllDevicesAutomationMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // 선택한 기기의 자동화 모드 정보 필터링
  const filteredAutomations = selectedDevice
    ? automationData.find((data) => data.deviceId === selectedDevice)
        ?.automations || []
    : [];

  // 모드
  // 현재 설정된 모드
  const [mode, setMode] = useState<boolean | null>(null);
  useEffect(() => {
    if (selectedDevice) {
      queryClient.invalidateQueries({ queryKey: ["deviceInfo"] });
    }
  }, [selectedDevice]);

  // 최신 모드 동기화
  const selectedDeviceData = devicesInfo?.devices?.find(
    (device: DeviceInfo) => device.id === selectedDevice
  );
  useEffect(() => {
    if (selectedDeviceData?.mode !== undefined) {
      setMode(selectedDeviceData.mode);
    }
  }, [selectedDeviceData]);

  // 다른 모드 클릭 시 모달 표시
  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  // 모드 변경 핸들러
  const handleModeChange = (newMode: Mode) => {
    if (deviceIds.length === 0) {
      return;
    }
    if (Boolean(mode) !== newMode) {
      const getModeName = () => {
        return newMode ? "자동화 " : "예약 ";
      };
      setNextMode(newMode);
      setModalMessage(`${getModeName()}모드로 변경하시겠습니까?`);
      setModalOpen(true);
    }
  };
  // 모달 창 확인 버튼
  const handleConfirm = async () => {
    if (selectedDevice) {
      try {
        await switchMode(selectedDevice, nextMode, accessToken);
        setMode(nextMode);
        setModalOpen(false);
      } catch (error) {
        console.error("모드 변경 실패:", error);
      }
    }
  };
  // 모달 창 취소 버튼
  const handleCancel = () => {
    setModalOpen(false);
  };

  // 탭 전환
  const [activeTab, setActiveTab] = useState<boolean>(false); // 현재 활성화 된 탭(기본값: 0 예약)
  const handleTabChange = (tab: boolean) => {
    if (deviceIds.length === 0 && tab === true) {
      return;
    }
    setActiveTab(tab);
  };

  if (isLoading) {
    return;
  }

  return (
    <div className="pt-[13px]">
      <Routes>
        <Route
          index
          element={
            <div className="flex flex-col w-full">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <div className="flex mb-[16px] items-center gap-1">
                    <img src={RemoteIcon} alt="리모컨 이미지" />
                    <h2 className="font-pre-medium text-16">모드 변경 버튼</h2>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <ModeToggle
                        currentMode={mode}
                        onModeChange={handleModeChange}
                      />
                    </div>
                    <div className="ml-[20px] text-center pre-light text-10 text-sub">
                      {isLoading ? (
                        ""
                      ) : deviceIds.length === 0 ? (
                        <div className="flex items-center">
                          <div className="w-[4px] h-[4px] mr-[4px] bg-brand rounded-full"></div>
                          기기를 먼저 등록해주세요.
                        </div>
                      ) : mode === null ? (
                        ""
                      ) : mode ? (
                        <div className="flex items-center">
                          <div className="w-[4px] h-[4px] mr-[4px] bg-brand rounded-full"></div>
                          현재 자동화 모드입니다.
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-[4px] h-[4px] mr-[4px] bg-brand rounded-full"></div>
                          현재 예약 모드입니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={"mt-[40px] font-pre-medium text-16"}>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-start gap-1">
                      <img src={AlarmIcon} alt="알람 이미지" />
                      <h2>스케줄 관리</h2>
                    </div>
                    <div className="fixed top-[178px] right-[20px] z-40">
                      <DeviceSelect
                        devices={deviceSelectItems}
                        selectedDevice={selectedDevice}
                        onDeviceChange={handleDeviceChange}
                      />
                    </div>
                  </div>
                  <div className="flex mt-6 ml-[7px] text-14 gap-6">
                    <div
                      onClick={() => handleTabChange(false)}
                      className={`w-[50px] text-center cursor-pointer ${
                        activeTab === false ? "border-b-[3px] border-sub" : ""
                      }`}
                    >
                      예약
                    </div>
                    <div
                      onClick={() => handleTabChange(true)}
                      className={`w-[50px] text-center cursor-pointer ${
                        activeTab === true ? "border-b-[3px] border-sub" : ""
                      }`}
                    >
                      자동화
                    </div>
                  </div>
                </div>
                <div className="">
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
            <ProtectedRoute
              condition={deviceIds.length > 0}
              redirectPath="/control"
            >
              <CreateReservation
                devices={deviceSelectItems}
                selectedDevice={selectedDevice}
                onDeviceChange={handleDeviceChange}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservation/modify"
          element={
            <ModifyReservation
              devices={deviceSelectItems}
              selectedDevice={selectedDevice}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Control;
