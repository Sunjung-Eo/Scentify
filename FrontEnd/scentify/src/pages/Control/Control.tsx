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
import ModifyReservation from "../../feature/control/reservation/ModifyReservation";

import { useMainDeviceStore } from "../../stores/useDeviceStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUserStore } from "../../stores/useUserStore";
import { MainDeviceStoreState } from "../../stores/useDeviceStore";

import { getAllDevicesMode } from "../../apis/control/getAllDevicesMode";
import { getCombinationById } from "../../apis/control/getCombinationById";
import { getDeviceInfo } from "../../apis/control/getDeviceInfo";
import { switchMode } from "../../apis/control/switchMode";

import DeviceSelect from "../../components/Control/DeviceSelect";
import { MainDeviceState } from "../../types/MainDeviceType";

const Control = () => {
  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 기기 정보
  const userstore = useUserStore();
  const deviceIds = userstore.deviceIds ?? [];
  const { mainDevice, deviceIdsAndNames } = useMainDeviceStore();
  // const deviceIds: string[] = deviceIdsAndNames
  //   ? Object.keys(deviceIdsAndNames)
  //   : [];
  // useEffect(() => {
  //   console.log("deviceIds 변경:", deviceIds);
  // }, [deviceIds]);
  const [defaultScentId, setDefaultScentId] = useState<number | null>(
    mainDevice?.defaultCombination ?? null
  );
  // setDefaultScentId(mainDevice?.defaultCombination);
  // 기기 id
  // const deviceIds = devices
  //   .map((device) => device.id)
  //   .filter((id): id is number => id !== undefined);
  // console.log("메일", mainDevice);
  // 선택한 기기(기본값: 대표기기)
  // const devices = mainDevice
  //   ? [
  //       {
  //         id: mainDevice.id,
  //         name: mainDevice.name,
  //         isRepresentative: true,
  //         roomType: mainDevice.roomType,
  //       },
  //     ]
  //   : [];

  // const mainDeviceStore = useMainDeviceStore()
  // const { mainDevice } = useMainDeviceStore()
  // const [defaultScentId, setDefaultScentId] = mainDeviceStore<MainDeviceStoreState>(null);
  // 선택한 기기(기본값: 대표기기 - 등록순)
  const [selectedDevice, setSelectedDevice] = useState<number | null>(
    mainDevice?.id ?? null
  );
  // const [defaultScentId, setDefaultScentId] = useState<number | null>(
  //   devices[0].defaultCombination
  // );
  // 기기 선택
  const handleDeviceChange = (deviceId: number) => {
    // console.log("선택", deviceId);
    setSelectedDevice(deviceId);
  };
  useEffect(() => {
    if (mainDevice) {
      setSelectedDevice(mainDevice.id);
    }
  }, []);

  // // 기본향 조회
  // const { data: fetchDefaultScentData = {} } = useQuery({
  //   queryKey: ["defaultScentData", defaultScentId],
  //   queryFn: () => getCombinationById(defaultScentId!, accessToken),
  //   enabled: !!defaultScentId && !!accessToken,
  // });

  // 기기 정보 조회
  const { data: fetchDeviceData = {} } = useQuery({
    queryKey: ["deviceInfo"],
    queryFn: () => getDeviceInfo(deviceIds, accessToken),
  });
  const devicesInfo = fetchDeviceData;
  // console.log("aas", devicesInfo);
  // console.log("패치!", fetchDeviceData);

  // console.log("asdadss", deviceIds);
  // 예약 관리 컴포넌트로 전달
  const deviceSelectItems =
    deviceIds.length === 0 || !devicesInfo?.devices
      ? []
      : deviceIds.map((deviceId) => {
          const deviceInfo = devicesInfo.devices.find(
            (device: any) => device.id === deviceId
          );
          // setDefaultScentId(deviceInfo.defaultCombination);
          // const defaultScentData = fetchDefaultScentData;
          // console.log(defaultCombination);
          // console.log(defaultScentData);
          // console.log(deviceInfo);
          return {
            deviceId: deviceInfo.id,
            name: deviceInfo.name,
            roomType: deviceInfo.room_type,
            isRepresentative: deviceInfo.id === mainDevice?.id ? true : false,
            defaultScentId: deviceInfo.defaultCombination,
            // defaultScentData: {
            //   slot1: {
            //     slot: defaultScentData.choice1,
            //     count: defaultScentData.choice1Count,
            //   },
            //   slot2: {
            //     slot: defaultScentData.choice2,
            //     count: defaultScentData.choice2Count,
            //   },
            //   slot3: {
            //     slot: defaultScentData.choice3,
            //     count: defaultScentData.choice3Count,
            //   },
            //   slot4: {
            //     slot: defaultScentData.choice4,
            //     count: defaultScentData.choice4Count,
            //   },
            // },
          };
        });

  // useEffect(() => {
  //   if (deviceIds.length > 0 && devicesInfo?.devices) {
  //     const deviceInfo = devicesInfo.devices.find(
  //       (device: any) => device.id === deviceIds[0]
  //     );

  //     if (deviceInfo) {
  //       setSelectedDevice(deviceInfo.id);
  //       setDefaultScentId(deviceInfo.defaultCombination); // 상태 업데이트 한 번만 호출
  //     }
  //   }
  // }, [deviceIds, devicesInfo]);
  // console.log(deviceSelectItems);
  // const deviceSelectItems = devices.map((device) => {
  //   const defaultScentData = fetchDefaultScentData;

  //   return {
  //     deviceId: device.id,
  //     name: device.name,
  //     roomType: device.roomType,
  //     isRepresentative: device.isRepresentative,
  //     defaultScentData: {
  //       slot1: {
  //         slot: defaultScentData.choice1,
  //         count: defaultScentData.choice1Count,
  //       },
  //       slot2: {
  //         slot: defaultScentData.choice2,
  //         count: defaultScentData.choice2Count,
  //       },
  //       slot3: {
  //         slot: defaultScentData.choice3,
  //         count: defaultScentData.choice3Count,
  //       },
  //       slot4: {
  //         slot: defaultScentData.choice4,
  //         count: defaultScentData.choice4Count,
  //       },
  //     },
  //   };
  // });
  // console.log("devices", devices);
  // console.log("deviceSelectItems", deviceSelectItems);

  // 전체 예약 조회 API 호출
  const { data: reservationData = [] } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => getAllDevicesMode(deviceIds, accessToken),
    enabled: deviceIds.length > 0 && !!accessToken,
  });
  // console.log(data);
  // 선택한 기기의 예약 정보 필터링
  const filteredReservations = selectedDevice
    ? reservationData.find((data) => data.deviceId === selectedDevice)
        ?.reservations || []
    : [];

  // 선택한 기기의 자동화 모드 정보 필터링
  const filteredAutomations = selectedDevice
    ? reservationData.find((data) => data.deviceId === selectedDevice)
        ?.automations || []
    : [];
  // console.log("선택기기", selectedDevice);
  console.log("데이터", reservationData);
  // console.log("예약", filteredReservations);
  // console.log("자동화", filteredAutomations);

  // 모드
  const selectedDeviceData = devicesInfo?.devices?.find(
    (device: any) => device.id === selectedDevice
  );
  const [mode, setMode] = useState(selectedDeviceData?.mode ?? false);
  useEffect(() => {
    setMode(selectedDeviceData?.mode ?? false);
  }, [selectedDeviceData]);

  const [isModal, setIsModal] = useState<boolean>(false); // 모달 활성화
  const [nextMode, setNextMode] = useState<Mode>(false); // 모달창 확인 버튼
  // const [isFirstRender, setIsFirstRender] = useState<boolean>(true); // 처음 디폴트 모드 (예약 모드)

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
    setMode(nextMode); // 여기서 nextMode를 바로 반영
    setIsModal(false);
  };
  useEffect(() => {
    console.log("현재모드", mode);
  }, [mode]);
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
                  !mode ? "mt-14" : "mt-0"
                }`}
              >
                <div className="absolute left-[225px] top-[135px] z-40">
                  <DeviceSelect
                    reservationData={reservationData}
                    devices={deviceSelectItems}
                    selectedDevice={selectedDevice}
                    onDeviceChange={handleDeviceChange}
                  />
                </div>
                {!mode ? (
                  selectedDevice !== null && (
                    <ReservationManager
                      reservationData={filteredReservations}
                      devices={deviceSelectItems}
                      selectedDevice={selectedDevice}
                      onDeviceChange={handleDeviceChange}
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
                      onDeviceChange={handleDeviceChange}
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
              onDeviceChange={handleDeviceChange}
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
              reservationData={filteredReservations}
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
              reservationData={filteredReservations}
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
