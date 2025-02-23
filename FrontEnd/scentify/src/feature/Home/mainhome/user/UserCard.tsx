import React, { useEffect, useState } from 'react';
import { UserData } from './UserTypes';
import { getProfileImage } from './handler/profileImageHandler';

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
    nickname: nickname || '사용자', // ✅ 기본값 설정
    imgNum: imgNum || 0, // ✅ 기본 프로필 이미지 번호
    mainDeviceId: mainDeviceId ?? 0,
    date: '',
    weatherIcon: '',
    weatherDescription: '',
  });

  // 4. 사용자 정보 업데이트 (전역 상태 변경 시)
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      nickname: nickname || '사용자',
      imgNum: imgNum || 0,
      mainDeviceId: mainDeviceId ?? 0,
    }));
  }, [nickname, imgNum, mainDeviceId]); // ✅ user 상태가 변경될 때 업데이트

  const [error, setError] = useState<string | null>(null); // 에러 상태

  // 1. 현재 날짜 가져오기
  const getCurrentDate = (): string => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    return `Today ${day} ${month} ${year}`;
  };

  const weatherIconMap = {
    Clear: '/weather-icons/sun.svg',
    Clouds: '/weather-icons/clouds.svg',
    Rain: '/weather-icons/rain.svg',
    Drizzle: '/weather-icons/rain.svg',
    Thunderstorm: '/weather-icons/thunder.svg',
    Snow: '/weather-icons/snow.svg',
    Mist: '/weather-icons/foggy.png',
    Smoke: '/weather-icons/foggy.png',
    Haze: '/weather-icons/foggy.png',
    Dust: '/weather-icons/dust.png',
    Fog: '/weather-icons/foggy.png',
    Sand: '/weather-icons/dust.png',
    Ash: '/weather-icons/dust.png',
    Squall: '/weather-icons/rain.svg',
    Tornado: '/weather-icons/rain.svg',
  } as const;

  const weatherDescriptionMap = {
    Clear: '맑음',
    Clouds: '흐림',
    Rain: '비',
    Drizzle: '이슬비',
    Thunderstorm: '천둥번개',
    Snow: '눈',
    Mist: '옅은 안개',
    Smoke: '연기',
    Haze: '실안개',
    Dust: '황사',
    Fog: '짙은 안개',
    Sand: '모래폭풍',
    Ash: '화산재',
    Squall: '돌풍',
    Tornado: '토네이도',
  } as const;

  // 2. OpenWeatherMap API 호출
  const getWeather = async (lat: number, lon: number) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''; // 환경 변수 값 로드
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      // API 요청 보내기
      const response = await fetch(url);

      // 응답이 정상적이지 않을 경우 오류 처리
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // API 응답 데이터 검증 (날씨 정보가 없을 경우 에러 발생)
      if (
        !data.weather ||
        !Array.isArray(data.weather) ||
        data.weather.length === 0 ||
        !data.weather[0].main
      ) {
        throw new Error('유효하지 않은 날씨 정보를 받았습니다.');
      }

      // 날씨 정보를 가져와서 매핑된 값 반환
      const weatherMain = data.weather[0].main as keyof typeof weatherIconMap;

      // 예상하지 못한 날씨 상태가 온 경우, 로딩 아이콘 및 "날씨 정보를 가져오는 중..." 표시
      if (!weatherIconMap[weatherMain] || !weatherDescriptionMap[weatherMain]) {
        return {
          weatherIcon: '/weather-icons/loading.png',
          weatherDescription: '날씨 정보를 가져오는 중...', // "날씨 정보를 가져오는 중..." 메시지 표시
        };
      }

      return {
        weatherIcon: weatherIconMap[weatherMain], // 정상적인 경우 매핑된 아이콘 표시
        weatherDescription: weatherDescriptionMap[weatherMain], // 정상적인 경우 매핑된 설명 표시
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return {
        weatherIcon: '/weather-icons/loading.png',
        weatherDescription: '날씨 정보를 가져오는 중...', // 오류 발생 시 동일한 메시지 표시
      };
    }
  };

  // 3. Geolocation API로 현재 위치 가져오기
  const fetchLocationAndWeather = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
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
        setError('Failed to retrieve location.');
        console.error('Geolocation error:', error);
      }
    );
  };

  // 4. 컴포넌트가 마운트될 때 위치 및 날씨 정보 가져오기
  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  return (
    <div>
      <div className="bg-sub rounded-[24px] px-6 py-4 text-white h-[120px] flex flex-col">
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
            <span className="font-pre-bold text-20">{nickname}</span>{' '}
            <span className="font-pre-light text-20">님</span>
            {/* 홍길동만 pre-bold */}
            <p className="font-pre-light text-20 ">반갑습니다!</p>
          </div>
        </div>

        {/* 날짜+ 날씨 묶음*/}
        <div className="flex justify-end items-center mt-auto font-pre-light text-opacity-50 text-12">
          <p className="font-pre-light text-10 mr-4">{userData.date}</p>
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
