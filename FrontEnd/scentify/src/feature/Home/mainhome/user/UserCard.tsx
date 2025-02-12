import React, { useEffect, useState } from "react";
import { UserData } from "./UserTypes";
import { getProfileImage } from "./handler/profileImageHandler";

interface UserCardProps {
  nickname?: string;
  imgNum?: number;
  mainDeviceId?: number;
}

const UserCard: React.FC<UserCardProps> = ({
  nickname,
  mainDeviceId,
  imgNum,
}) => {
  const [userData, setUserData] = useState<UserData>({
    nickname: nickname || "사용자", // ✅ 기본값 설정
    imgNum: imgNum || 0, // ✅ 기본 프로필 이미지 번호
    mainDeviceId: mainDeviceId ?? 0,
    date: "",
    weatherIcon: "",
    weatherDescription: "",
  });

  // 4. 사용자 정보 업데이트 (전역 상태 변경 시)
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      nickname: nickname || "사용자",
      imgNum: imgNum || 0,
      mainDeviceId: mainDeviceId ?? 0,
    }));
  }, [nickname, imgNum, mainDeviceId]); // ✅ user 상태가 변경될 때 업데이트

  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 1. 현재 날짜 가져오기
  const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("en-US", { month: "long" });
    const year = today.getFullYear();
    return `Today ${day} ${month} ${year}`;
  };

  const weatherIconMap = {
    Clear: "/weather-icons/sun.svg",
    Clouds: "/weather-icons/clouds.svg",
    Rain: "/weather-icons/rain.svg",
    Snow: "/weather-icons/snow.svg",
    Thunderstorm: "/weather-icons/thunder.svg",
  } as const;

  const weatherDescriptionMap = {
    Clear: "맑음",
    Clouds: "흐림",
    Rain: "비",
    Snow: "눈",
    Thunderstorm: "천둥",
  } as const;

  // 2. OpenWeatherMap API 호출
  const getWeather = async (lat: number, lon: number) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ""; // 환경 변수 값 로드
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      // 1️⃣ API 요청 보내기
      const response = await fetch(url);

      // 2️⃣ HTTP 응답 상태 코드 확인
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 3️⃣ 응답 데이터를 JSON으로 변환
      const data = await response.json();

      // 4️⃣ API 응답 데이터 검증 (날씨 정보가 없을 경우 에러 발생)
      if (
        !data.weather ||
        !Array.isArray(data.weather) ||
        data.weather.length === 0 ||
        !data.weather[0].main
      ) {
        throw new Error("Invalid weather data received");
      }

      // 5️⃣ 날씨 정보를 가져와서 매핑된 값 반환
      const weatherMain = data.weather[0].main as keyof typeof weatherIconMap;

      // 예상하지 못한 날씨 상태가 온 경우, 로딩 아이콘 및 "날씨 정보를 가져오는 중..." 표시
      if (!weatherIconMap[weatherMain] || !weatherDescriptionMap[weatherMain]) {
        return {
          weatherIcon: "/weather-icons/loading.svg", // ⏳ 로딩 아이콘 표시
          weatherDescription: "날씨 정보를 가져오는 중...", // "날씨 정보를 가져오는 중..." 메시지 표시
        };
      }

      return {
        weatherIcon: weatherIconMap[weatherMain], // 정상적인 경우 매핑된 아이콘 표시
        weatherDescription: weatherDescriptionMap[weatherMain], // 정상적인 경우 매핑된 설명 표시
      };
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return {
        weatherIcon: "/weather-icons/loading.svg", // ⏳ 로딩 아이콘
        weatherDescription: "날씨 정보를 가져오는 중...", // 오류 발생 시 동일한 메시지 표시
      };
    }
  };

  // 3. Geolocation API로 현재 위치 가져오기
  const fetchLocationAndWeather = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const weather = await getWeather(latitude, longitude);
        const date = getCurrentDate();

        setUserData((prev) => ({
          ...prev,
          date,
          weatherIcon: weather.weatherIcon,
          weatherDescription: weather.weatherDescription,
        }));
        setError(null); // 에러 초기화
      },
      (error) => {
        setError("Failed to retrieve location.");
        console.error("Geolocation error:", error);
      }
    );
  };

  // 4. 컴포넌트가 마운트될 때 실행
  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  return (
    <div>
      <div className="bg-sub rounded-3xl px-6 py-4 text-white h-[132px] flex flex-col">
        {/* 프로필이미지+닉네임 묶음 */}
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <img
            src={getProfileImage(imgNum ?? 0)}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />

          {/* 닉네임 */}
          <div className="">
            <span className="font-pre-bold text-[22px]">{nickname}</span>{" "}
            <span className="font-pre-light text-[22px]">님</span>
            {/* 홍길동만 pre-bold */}
            <p className="font-pre-light text-[22px] ">반갑습니다!</p>
          </div>
        </div>

        {/* 날짜+ 날씨 묶음*/}
        <div className="flex justify-end items-center mt-auto font-pre-light text-opacity-50 text-12">
          <p className="text-pre-regular text-sm mr-4">{userData.date}</p>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : userData.weatherIcon ? (
            <div className="flex items-center">
              <img
                src={userData.weatherIcon}
                alt="Weather Icon"
                className="w-6 h-6"
              />
              <p className="text-opacity-50 ml-1">
                {userData.weatherDescription}
              </p>
            </div>
          ) : (
            <span className="font-pre-light text-12">
              날씨 정보를 가져오는 중...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
