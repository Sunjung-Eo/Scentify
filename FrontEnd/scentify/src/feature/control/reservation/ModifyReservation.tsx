import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useControlStore } from "../../../stores/useControlStore";
import { useAuthStore } from "../../../stores/useAuthStore";

import { getCombinationById } from "../../../apis/control/getCombinationById";
import { updateCustomSchedule } from "../../../apis/control/updateCustomSchedule";

import DeviceSelect from "../../../components/Control/DeviceSelect";
import ScentSetting from "../../../components/Control/ScentSetting";
import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { DeviceSelectProps } from "../../../components/Control/DeviceSelect";
import { DAYS_BIT, convertTo24Hour } from "../../../utils/control/timeUtils";
import { ReservationData, UpdateReservationData } from "./ReservationType";

export default function ModifyReservation({
  devices,
  selectedDevice,
  onDeviceChange,
}: DeviceSelectProps) {
  const navigate = useNavigate();
  // 선택한 예약 정보 가져오기
  const location = useLocation();
  const { schedule } = location.state || {};

  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  // 예약 수정 - react query
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: ReservationData) =>
      updateCustomSchedule(data, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      navigate("/control", { state: { reservationCreated: true } });
    },
    onError: (error) => {
      console.error("예약 수정 실패:", error);
    },
  });

  // 완료 버튼 핸들러
  const { setCompleteHandler } = useControlStore();

  // 예약 이름
  const [reservationName, setReservationName] = useState<string>(schedule.name);

  // 요일 설정
  const [selectedDays, setSelectedDays] = useState<string[]>(
    schedule
      ? Object.entries(DAYS_BIT)
          .filter(([_, bit]) => (schedule.day & bit) > 0)
          .map(([day]) => day)
      : []
  );
  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // onoff 토글
  const [modeOn, setModeOn] = useState<boolean>(schedule.modeOn);
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

  // 시간 변환
  const parseTime = (time: string) => {
    const [hourRaw, minute] = time.split(":").map(Number);
    const period = hourRaw >= 12 ? "PM" : "AM";
    const hour = hourRaw % 12 || 12;

    return { period, hour, minute };
  };
  // 시간 설정
  const parsedStart = parseTime(schedule.startTime);
  const parsedEnd = parseTime(schedule.endTime);
  const [startHour, setStartHour] = useState(parsedStart.hour);
  const [startMinute, setStartMinute] = useState(parsedStart.minute);
  const [startPeriod, setStartPeriod] = useState(parsedStart.period);
  const [endHour, setEndHour] = useState(parsedEnd.hour);
  const [endMinute, setEndMinute] = useState(parsedEnd.minute);
  const [endPeriod, setEndPeriod] = useState(parsedEnd.period);

  // 분사주기 드롭박스 초기값
  const [spraySelectedTime, setSpraySelectedTime] = useState(
    String(schedule.interval)
  );
  const handleSelectTime = (time: string) => {
    setSpraySelectedTime(time);
  };

  // 선택한 기기의 데이터
  const selectedDeviceData = devices.find(
    (device) => device.deviceId === selectedDevice
  );

  // 기존 향 설정
  const [previousScentId] = useState(schedule.combinationId);
  const [previousScentData, setPreviousScentData] = useState({
    slot1: { slot: 0, count: 0 },
    slot2: { slot: 0, count: 0 },
    slot3: { slot: 0, count: 0 },
    slot4: { slot: 0, count: 0 },
  });
  useEffect(() => {
    const fetchCombination = async () => {
      if (previousScentId) {
        try {
          const combination = await getCombinationById(
            previousScentId,
            accessToken
          );
          setPreviousScentData({
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
  }, [previousScentId, accessToken]);

  // 향 설정
  const [scentName, setScentName] = useState<string>(schedule.combinationName);
  const [scents, setScents] = useState({
    scent1: previousScentData?.slot1?.count,
    scent2: previousScentData?.slot2?.count,
    scent3: previousScentData?.slot3?.count,
    scent4: previousScentData?.slot4?.count,
  });
  useEffect(() => {
    setScents({
      scent1: previousScentData.slot1.count,
      scent2: previousScentData.slot2.count,
      scent3: previousScentData.slot3.count,
      scent4: previousScentData.slot4.count,
    });
  }, [previousScentData]);

  // 방 크기 별 에너지
  const getTotalEnergy = () => {
    switch (selectedDeviceData?.roomType) {
      case 1:
        return 6;
      case 0:
      default:
        return 3;
    }
  };

  const totalEnergy = getTotalEnergy();

  // 폼 유효성 검사
  const [formErrors, setFormErrors] = useState({
    reservationName: "",
    scentName: "",
    scents: "",
  });
  // 완료 버튼 누를 시 유효성 검사
  const handleComplete = () => {
    const errors = {
      reservationName: "",
      scentName: "",
      scents: "",
    };
    let isValid = true;

    if (!reservationName.trim()) {
      errors.reservationName = "예약 이름을 입력해주세요.";
      isValid = false;
    }
    if (!scentName.trim()) {
      errors.scentName = "향 이름을 입력해주세요.";
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
    // 향 수정 여부
    const isScentsChanged = () => {
      return (
        scents.scent1 !== previousScentData.slot1.count ||
        scents.scent2 !== previousScentData.slot2.count ||
        scents.scent3 !== previousScentData.slot3.count ||
        scents.scent4 !== previousScentData.slot4.count
      );
    };

    const reservationData: UpdateReservationData = {
      id: schedule.id,
      name: reservationName,
      deviceId: selectedDevice,
      day: getDaysBitMask(selectedDays),
      combination: isScentsChanged()
        ? {
            name: scentName,
            choice1: previousScentData.slot1.slot,
            choice1Count: scents.scent1,
            choice2: previousScentData.slot2.slot,
            choice2Count: scents.scent2,
            choice3: previousScentData.slot3.slot,
            choice3Count: scents.scent3,
            choice4: previousScentData.slot4.slot,
            choice4Count: scents.scent4,
          }
        : { id: schedule.combinationId },
      startTime: convertTo24Hour(startHour, startMinute, startPeriod),
      endTime: convertTo24Hour(endHour, endMinute, endPeriod),
      interval: parseInt(spraySelectedTime.replace(/[^0-9]/g, "")),
      modeOn: modeOn,
    };
    updateMutation.mutate(reservationData);
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
    <div className="content p-0 font-pre-medium text-12">
      {/* 예약 이름 */}
      <div className="ml-5 mr-5 mb-[25px]">
        <label htmlFor="reservatioName" className="m-0 mb-3">
          {"예약 이름"}
          <input
            type="text"
            id="reservationName"
            value={reservationName}
            onChange={(e) => setReservationName(e.target.value)}
            className="relative w-[255px] h-[34px] ml-[20px] pl-2 bg-component rounded-lg"
          />
        </label>
        {formErrors.reservationName && (
          <p className="absolute ml-[70px] text-red-500 text-10">
            {formErrors.reservationName}
          </p>
        )}
      </div>

      {/* 기기 선택 */}
      <div className="relative flex ml-5 mr-5 mb-[25px] items-center">
        <label htmlFor="deviceSelect" className="mr-[20px]">
          기기 선택
        </label>
        <div className="absolute top-[-9px] left-[63px] z-50">
          <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={onDeviceChange}
          />
        </div>
      </div>

      {/* 요일 설정 */}
      <div className="ml-5 mr-5">
        <div className="flex">
          <div className="flex items-center">
            <label htmlFor="weekdaySelect" className="mr-[20px]">
              요일 설정
            </label>
            <div>
              <div>
                <div className="flex font-pre-light items-center">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <button
                      key={day}
                      className={`mr-[8.5px] w-7 h-7 border-0.2 border-brand text-black rounded-full ${
                        selectedDays.includes(day) ? "bg-brand text-white" : ""
                      }`}
                      onClick={() => handleDaySelect(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
      <div className="flex ml-5 mr-5">
        <label htmlFor="timeSelect">시간 설정</label>
        <div className="flex flex-col m-5 mb-[10px] mt-0 gap-2">
          {/* 시작 시간 */}
          <div className="flex items-center gap-1 justify-end">
            <span className="mr-[15px]">시작 시간</span>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={startMinute}
              onChange={(e) => setStartMinute(Number(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div className="flex">
              <button
                className={`w-[40px] h-[34px] rounded-l-lg ${
                  startPeriod === "AM" ? "bg-brand text-white" : "bg-component"
                }`}
                onClick={() => setStartPeriod("AM")}
              >
                AM
              </button>
              <button
                className={`w-[40px] h-[34px] rounded-r-lg ${
                  startPeriod === "PM" ? "bg-brand text-white" : "bg-component"
                }`}
                onClick={() => setStartPeriod("PM")}
              >
                PM
              </button>
            </div>
          </div>
          {/* 종료 시간 */}
          <div className="flex items-center gap-1 justify-end">
            <span className="mr-[15px]">종료 시간</span>
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              className="w-[34px] h-[34px] border p-2 rounded-lg bg-white shadow-sm text-center appearance-none"
              value={endMinute}
              onChange={(e) => setEndMinute(Number(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div className="flex">
              <button
                className={`w-[40px] h-[34px] rounded-l-lg ${
                  endPeriod === "AM" ? "bg-brand text-white" : "bg-component"
                }`}
                onClick={() => setEndPeriod("AM")}
              >
                AM
              </button>
              <button
                className={`w-[40px] h-[34px] rounded-r-lg ${
                  endPeriod === "PM" ? "bg-brand text-white" : "bg-component"
                }`}
                onClick={() => setEndPeriod("PM")}
              >
                PM
              </button>
            </div>
          </div>
          {/* 분사주기 */}
          <div className="relative flex items-center mt-2 mb-[10px]">
            <span className="mr-[15px]">분사 주기</span>
            <div className="absolute top-[-9px] left-[63px] z-50">
              <SprayIntervalSelector
                selectedTime={spraySelectedTime}
                onTimeSelect={handleSelectTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 향 설정 */}
      <div className="relative flex flex-col ml-5 mr-5">
        <label htmlFor="scentName" className="m-0">
          {"향 설정"}
          <input
            type="text"
            id="scentName"
            value={scentName}
            onChange={(e) => setScentName(e.target.value)}
            className="w-[255px] h-[34px] ml-[30px] pl-2 bg-component rounded-lg"
          />
        </label>
        {formErrors.scentName && (
          <p className="absolute mt-[35px] ml-[70px] text-red-500 text-10">
            {formErrors.scentName}
          </p>
        )}
        <ScentSetting
          scents={scents}
          setScents={setScents}
          totalEnergy={totalEnergy}
          defaultScentData={previousScentData}
        />
        {formErrors.scents && (
          <p className="absolute mt-[217px] ml-[70px] text-red-500 text-10">
            {formErrors.scents}
          </p>
        )}
      </div>
    </div>
  );
}
