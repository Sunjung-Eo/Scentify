import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useControlStore } from "../../../stores/useControlStore";
import DeviceSelect from "../../../components/Control/DeviceSelect";
import ScentSetting from "../../../components/Control/ScentSetting";
import SprayIntervalSelector from "../../../components/Control/SprayIntervalSelector";
import { ReservationManagerProps } from "./ReservationType";

export default function CreateReservation({
  onDeviceChange,
}: ReservationManagerProps) {
  const navigate = useNavigate();
  const { setCompleteHandler } = useControlStore();

  // 예약 이름
  const [reservationName, setReservationName] = useState<string>("");

  // 기기선택 임시값
  const [selectedDevice, setSeletecdDevice] = useState("기기A");
  const devices = ["기기A", "기기B", "기기C"];
  const handleDeviceChange = (device) => {
    setSeletecdDevice(device);
    if (onDeviceChange) {
      onDeviceChange(device);
    }
  };

  // 요일 설정
  const [selectedDays, setSelectedDays] = useState<string[]>([]); //요일 배열
  const [selectWeek, setSelectedWeek] = useState<boolean>(true); // onoff토글
  const handleDaySelect = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  const toggleWeek = () => {
    setSelectedWeek((prev) => !prev);
  };
  // 요일 비트마스크
  const DAYS_BIT = {
    월: 1 << 6, // 64
    화: 1 << 5, // 32
    수: 1 << 4, // 16
    목: 1 << 3, // 8
    금: 1 << 2, // 4
    토: 1 << 1, // 2
    일: 1, // 1
  };
  const getDaysBitMask = (selectedDays) => {
    return selectedDays.reduce((mask, day) => mask | DAYS_BIT[day], 0);
  };

  // 시간 설정
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState("10");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM");
  // 시간 변환
  const convertTo24Hour = (hour, minute, period) => {
    let hours = parseInt(hour);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minute}:00`;
  };

  // 분사주기 드롭박스 초기값
  const [spraySelectedTime, setSpraySelectedTime] = useState("15분");
  const handleSelectTime = (time: string) => {
    setSpraySelectedTime(time);
  };

  // 향 설정
  const [scentName, setScentName] = useState<string>("");
  const [scents, setScents] = useState({
    scent1: 0,
    scent2: 0,
    scent3: 0,
    scent4: 0,
  });
  const [totalEnergy, setTotalEnergy] = useState<number>(3);

  // 폼 유효성 검사
  const [formErrors, setFormErrors] = useState({
    reservationName: "",
    scentName: "",
    scents: "",
  });
  // 완료 버튼 누를 시 유효성 검사
  const handleComplete = useCallback(() => {
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
      console.log("유효성 검사 실패", errors);
      return;
    }
    // 전송할 데이터
    const reservationData = {
      customSchedule: {
        name: reservationName,
        // deviceId: selectedDevice, // devicename 말고 deviceId로
        // user_id: "사용자id", // 사용자 인증 정보에서 가져와야 함
        day: getDaysBitMask(selectedDays),
        combination: {
          name: scentName,
          choice1: "scent1",
          choice1Count: scents.scent1,
          choice2: "scent2",
          choice2Count: scents.scent2,
          choice3: "scent3",
          choice3Count: scents.scent3,
          choice4: "scent4",
          choice4Count: scents.scent4,
        },
        startTime: convertTo24Hour(startHour, startMinute, startPeriod),
        endTime: convertTo24Hour(endHour, endMinute, endPeriod),
        interval: parseInt(spraySelectedTime.replace(/[^0-9]/g, "")), // 숫자만 가져오기
      },
    };
    console.log("예약 데이터:", reservationData);
    // API 호출 추가
    navigate("/control", { state: { reservationCreated: true } });
  }, [
    reservationName,
    scentName,
    scents,
    selectedDevice,
    selectedDays,
    selectWeek,
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    spraySelectedTime,
  ]);

  useEffect(() => {
    setCompleteHandler(handleComplete);
    return () => setCompleteHandler(null);
  }, [handleComplete]);

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
            className="relative w-[255px] h-[34px] ml-[20px] bg-component rounded-lg"
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
            onDeviceChange={handleDeviceChange}
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
          <div onClick={toggleWeek}>
            <div
              className={`relative w-[50px] h-[25px] rounded-full cursor-pointer bg-brand ${selectWeek ? "" : "bg-lightgray"}`}
            >
              <div
                className={`absolute w-[25px] h-[25px] bg-white rounded-full transition-transform ${
                  selectWeek ? "translate-x-full" : "translate-x-0"
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
              onChange={(e) => setStartHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
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
              onChange={(e) => setEndHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {String(i + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
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
            className="w-[255px] h-[34px] ml-[30px] bg-component rounded-lg"
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
