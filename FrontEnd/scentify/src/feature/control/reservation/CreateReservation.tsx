import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useControlStore } from "../../../stores/useControlStore";
import { useAuthStore } from "../../../stores/useAuthStore";

import { createCustomSchedule } from "../../../apis/control/createCustomSchedule";
import { getCombinationById } from "../../../apis/control/getCombinationById";

import DeviceSelect from "../../../components/Control/DeviceSelect";
import ScentSetting from "../../../components/Control/ScentSetting";
import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { DAYS_BIT, convertTo24Hour } from "../../../utils/control/timeUtils";
import { AlertScheduleModal } from "../../../components/Alert/AlertSchedule";

import { DeviceSelectProps } from "../../../components/Control/DeviceSelect";
import { ReservationData } from "./ReservationType";

export default function CreateReservation({
  devices,
  selectedDevice,
  onDeviceChange,
}: DeviceSelectProps) {
  const navigate = useNavigate();

  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const queryClient = useQueryClient();

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(false);
  };

  // 예약하기 - query
  const createMutation = useMutation({
    mutationFn: (data: ReservationData) =>
      createCustomSchedule(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      navigate("/control", { state: { reservationCreated: true } });
    },
    // 403 반환 시 모달창 띄우기
    onError: (error) => {
      if (error.message === "403") {
        setIsModalOpen(true);
      } else {
        console.error("예약 생성 실패:", error);
      }
    },
  });

  // 완료 버튼 핸들러
  const { setCompleteHandler } = useControlStore();

  // 예약 이름
  const [reservationName, setReservationName] = useState<string>("");

  // 요일 설정
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // onoff 토글
  const [modeOn, setModeOn] = useState<boolean>(true);
  const modeOnToggle = () => {
    setModeOn((prev) => !prev);
  };

  // 요일 비트마스크
  const getDaysBitMask = (selectedDays: string[]) => {
    return selectedDays.reduce(
      (mask, day) => mask | DAYS_BIT[day as keyof typeof DAYS_BIT],
      0
    );
  };

  // 시간 설정
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM");

  // 분사주기 드롭박스 초기값
  const [spraySelectedTime, setSpraySelectedTime] = useState("15분");
  const handleSelectTime = (time: string) => {
    setSpraySelectedTime(time);
  };

  // 선택한 기기의 데이터
  const selectedDeviceData = devices.find(
    (device) => device.deviceId === selectedDevice
  );

  // 기본향 설정
  const [defaultScentId, setDefaultScentId] = useState(
    devices.find((device) => device.deviceId === selectedDevice)?.defaultScentId
  );
  const [defaultScentData, setDefaultScentData] = useState({
    slot1: { slot: 0, count: 0 },
    slot2: { slot: 0, count: 0 },
    slot3: { slot: 0, count: 0 },
    slot4: { slot: 0, count: 0 },
  });
  useEffect(() => {
    const newDefaultScentId = devices.find(
      (device) => device.deviceId === selectedDevice
    )?.defaultScentId;
    setDefaultScentId(newDefaultScentId);
  }, [selectedDevice, devices]);
  useEffect(() => {
    const fetchCombination = async () => {
      if (defaultScentId) {
        try {
          const combination = await getCombinationById(
            defaultScentId,
            accessToken
          );
          setDefaultScentData({
            slot1: {
              slot: combination.choice1,
              count: combination.choice1Count,
            },
            slot2: {
              slot: combination.choice2,
              count: combination.choice2Count,
            },
            slot3: {
              slot: combination.choice3,
              count: combination.choice3Count,
            },
            slot4: {
              slot: combination.choice4,
              count: combination.choice4Count,
            },
          });
        } catch (error) {
          console.error("기본향 조합 데이터 가져오기 실패:", error);
        }
      }
    };

    fetchCombination();
  }, [defaultScentId, accessToken]);

  // 향 설정
  const [scentName, setScentName] = useState<string>("");
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  useEffect(() => {
    setScents({
      scent1: defaultScentData.slot1.count,
      scent2: defaultScentData.slot2.count,
      scent3: defaultScentData.slot3.count,
      scent4: defaultScentData.slot4.count,
    });
  }, [defaultScentData]);

  // 방 크기 별 에너지
  const getTotalEnergy = (roomType: number) => {
    switch (roomType) {
      case 1:
        return 6;
      case 0:
      default:
        return 3;
    }
  };
  const totalEnergy = getTotalEnergy(selectedDeviceData?.roomType ?? 0);

  // 폼 유효성 검사
  const [formErrors, setFormErrors] = useState({
    reservationName: "",
    reservationNameLength: "",
    noonTime: "",
    time: "",
    scentName: "",
    scentNameLength: "",
    scents: "",
    day: "",
  });
  // 완료 버튼 누를 시 유효성 검사
  const handleComplete = () => {
    const errors = {
      reservationName: "",
      reservationNameLength: "",
      noonTime: "",
      time: "",
      scentName: "",
      scentNameLength: "",
      scents: "",
      day: "",
    };
    let isValid = true;

    // 시간 유효성검사를 위한 변환
    const parseTimeToNumber = (time: string): number => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 100 + minute;
    };
    const start24 = convertTo24Hour(
      Number(startHour),
      Number(startMinute),
      startPeriod
    );
    const end24 = convertTo24Hour(
      Number(endHour),
      Number(endMinute),
      endPeriod
    );
    const start24Number = parseTimeToNumber(start24);
    const end24Number = parseTimeToNumber(end24);

    // 유효성 검사 메세지
    if (!reservationName.trim()) {
      errors.reservationName = "예약 이름을 입력해주세요.";
      isValid = false;
    } else if (reservationName.length > 30) {
      errors.reservationNameLength = "예약 이름은 30자 이내로 입력해주세요.";
      isValid = false;
    }

    if (getDaysBitMask(selectedDays) === 0) {
      errors.day = "요일을 선택해주세요.";
      isValid = false;
    }

    if (start24Number >= 100 && end24Number < 100) {
      errors.noonTime = "자정 이전 시간을 선택해주세요.";
      isValid = false;
    } else if (end24Number < start24Number) {
      errors.time = "종료 시간을 시작 시간 이후로 선택해주세요.";
      isValid = false;
    }

    if (!scentName.trim()) {
      errors.scentName = "향 이름을 입력해주세요.";
      isValid = false;
    } else if (scentName.length > 15) {
      errors.scentNameLength = "향 이름은 15자 이내로 입력해주세요.";
      isValid = false;
    }

    const totalUsage = Object.values(scents).reduce(
      (sum, value) => sum + value,
      0
    );
    if (totalUsage !== totalEnergy) {
      errors.scents = "향을 전부 선택해주세요.";
      isValid = false;
    }

    setFormErrors(errors);
    if (!isValid) {
      return;
    }

    // API request 데이터
    const reservationData: ReservationData = {
      name: reservationName,
      deviceId: selectedDevice,
      day: getDaysBitMask(selectedDays),
      combination: {
        name: scentName,
        choice1: defaultScentData.slot1.slot,
        choice1Count: scents.scent1,
        choice2: defaultScentData.slot2.slot,
        choice2Count: scents.scent2,
        choice3: defaultScentData.slot3.slot,
        choice3Count: scents.scent3,
        choice4: defaultScentData.slot4.slot,
        choice4Count: scents.scent4,
      },
      startTime: convertTo24Hour(
        Number(startHour),
        Number(startMinute),
        startPeriod
      ),
      endTime: convertTo24Hour(Number(endHour), Number(endMinute), endPeriod),
      interval: parseInt(spraySelectedTime.replace(/[^0-9]/g, "")),
      modeOn: modeOn,
    };

    createMutation.mutate(reservationData);
  };

  useEffect(() => {
    setCompleteHandler(handleComplete);
    return () => {
      setCompleteHandler(null);
    };
  }, [
    reservationName,
    scentName,
    scents,
    selectedDevice,
    selectedDays,
    modeOn,
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    spraySelectedTime,
    selectedDeviceData,
  ]);

  return (
    <div className="p-1 font-pre-medium text-12 overflow-y-auto max-h-[calc(100vh-10rem)] w-full">
      {/* 예약 이름 */}
      <div className="relative flex items-center mb-[25px] w-full">
        <label htmlFor="reservatioName" className="mr-[20px]">
          {"예약 이름"}
        </label>
        <input
          type="text"
          id="reservationName"
          value={reservationName}
          onChange={(e) => setReservationName(e.target.value)}
          className="flex-1 w-full h-[34px] pl-2 bg-component rounded-lg"
        />
        {formErrors.reservationName && (
          <p className="absolute top-[34px] ml-[70px] text-red-500 text-10">
            {formErrors.reservationName}
          </p>
        )}
        {formErrors.reservationNameLength && (
          <p className="absolute top-[34px] ml-[70px] text-red-500 text-10">
            {formErrors.reservationNameLength}
          </p>
        )}
      </div>

      {/* 기기 선택 */}
      <div className="relative flex mb-[25px] w-full items-center">
        <label htmlFor="deviceSelect" className="mr-[20px]">
          기기 선택
        </label>
        <div className="absolute top-[-7px] left-[65px] z-50">
          <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={onDeviceChange}
          />
        </div>
      </div>

      {/* 요일 설정 */}
      <div className="w-full">
        <div className="flex items-center">
          <label htmlFor="weekdaySelect" className="mr-[20px]">
            요일 설정
          </label>
          <div className="relative">
            <div className="flex font-pre-light text-10 items-center justify-center">
              {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                <button
                  key={day}
                  className={`mr-[8.5px] w-7 h-7 text-black rounded-full ${
                    selectedDays.includes(day) ? "bg-brand text-white" : ""
                  }`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {formErrors.day && (
              <p className="absolute ml-[5px] text-red-500 text-10">
                {formErrors.day}
              </p>
            )}
          </div>
        </div>
        <div className="flex mb-[10px] justify-end items-center">
          <p className="m-2 font-pre-light text-12 text-gray">on / off</p>
          <div onClick={modeOnToggle}>
            <div
              className={`relative w-[50px] h-[25px] rounded-full cursor-pointer bg-brand ${modeOn ? "" : "bg-lightgray"}`}
            >
              <div
                className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${
                  modeOn ? "translate-x-full" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 시간 설정 */}
      <div className="relative flex">
        <label className="mt-[7px]" htmlFor="timeSelect">
          시간 설정
        </label>
        <div className="flex flex-col m-5 mb-[10px] mt-0 text-10 gap-2">
          {/* 시작 시간 */}
          <div className="flex items-center gap-1 justify-end">
            <span className="mr-[15px] text-gray">시작 시간</span>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div className="flex w-[89px] h-[30px] p-[3px] items-center justify-center bg-white border-[0.5px] border-brand font-pre-light text-10 rounded-lg">
              <div
                className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
                  startPeriod === "AM" ? "bg-brand text-bg" : "text-brand"
                }`}
                onClick={() => setStartPeriod("AM")}
              >
                AM
              </div>
              <div
                className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
                  startPeriod === "PM" ? "bg-brand text-bg" : "text-brand"
                }`}
                onClick={() => setStartPeriod("PM")}
              >
                PM
              </div>
            </div>
          </div>

          {/* 종료 시간 */}
          <div className="flex items-center gap-1 justify-end">
            <span className="mr-[15px] text-gray">종료 시간</span>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div className="flex w-[89px] h-[30px] p-[3px] items-center justify-center bg-white border-[0.5px] border-brand font-pre-light text-10 rounded-lg">
              <div
                className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
                  endPeriod === "AM" ? "bg-brand text-bg" : "text-brand"
                }`}
                onClick={() => setEndPeriod("AM")}
              >
                AM
              </div>
              <div
                className={`flex-1 flex h-full items-center justify-center rounded-md text-center transition-all ${
                  endPeriod === "PM" ? "bg-brand text-bg" : "text-brand"
                }`}
                onClick={() => setEndPeriod("PM")}
              >
                PM
              </div>
            </div>
          </div>
          {formErrors.noonTime && (
            <p className="absolute bottom-[53px] left-[70px] text-red-500 text-10">
              {formErrors.noonTime}
            </p>
          )}
          {formErrors.time && (
            <p className="absolute bottom-[53px] left-[70px] text-red-500 text-10">
              {formErrors.time}
            </p>
          )}
          {/* 분사주기 */}
          <div className="relative flex items-center mt-4 mb-[20px]">
            <span className="mr-[15px] text-gray">분사 주기</span>
            <div className="absolute top-[-7px] left-[54px] z-50">
              <SprayIntervalSelector
                selectedTime={spraySelectedTime}
                onTimeSelect={handleSelectTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 향 설정 */}
      <div className="relative flex flex-col w-full">
        <div className="flex items-center">
          <label htmlFor="scentName" className="m-0">
            {"향 설정"}
          </label>
          <input
            type="text"
            id="scentName"
            value={scentName}
            onChange={(e) => setScentName(e.target.value)}
            className="flex-1 w-full h-[34px] ml-[25px] pl-2 bg-component rounded-lg"
          />
          {formErrors.scentName && (
            <p className="absolute mt-[48px] ml-[70px] text-red-500 text-10">
              {formErrors.scentName}
            </p>
          )}
          {formErrors.scentNameLength && (
            <p className="absolute mt-[48px] ml-[70px] text-red-500 text-10">
              {formErrors.scentNameLength}
            </p>
          )}
        </div>
        <ScentSetting
          scents={scents}
          setScents={setScents}
          totalEnergy={totalEnergy}
          defaultScentData={defaultScentData}
        />
        {formErrors.scents && (
          <p className="absolute mt-[217px] ml-[70px] text-red-500 text-10">
            {formErrors.scents}
          </p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <AlertScheduleModal
            message="해당 시간에 예약이 이미 존재합니다."
            showButtons={true}
            onConfirm={handleModalOpen}
          />
        </div>
      )}
    </div>
  );
}
