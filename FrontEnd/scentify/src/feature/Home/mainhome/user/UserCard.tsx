import React, { useEffect, useState } from 'react';
import { UserData } from './UserTypes';
import { useUserStore } from '../../../../stores/useUserStore';
import sunIcon from '../../../../assets/icons/weather/sun.svg';
import cloudsIcon from '../../../../assets/icons/weather/clouds.svg';
import rainIcon from '../../../../assets/icons/weather/rain.svg';
import snowIcon from '../../../../assets/icons/weather/snow.svg';
import thunderIcon from '../../../../assets/icons/weather/thunder.svg';

import { getProfileImage } from './handler/profileImageHandler';

const UserCard: React.FC = () => {
  // ✅ 전역 상태에서 사용자 정보 가져오기
  const { nickname, imgNum, mainDeviceId } = useUserStore();

  const [userData, setUserData] = useState<UserData>({
    nickname: nickname || '사용자', // ✅ 기본값 설정
    imgNum: imgNum || 1, // ✅ 기본 프로필 이미지 번호
    mainDeviceId: mainDeviceId ?? 0,
    date: '',
    weatherIcon: '',
    weatherDescription: '',
  });

  // 4. 사용자 정보 업데이트 (전역 상태 변경 시)
  useEffect(() => {
    console.log('🔥 업데이트된 상태');
    console.log('닉네임:', nickname);
    console.log('이미지 번호:', imgNum);
    console.log('메인 디바이스 ID:', mainDeviceId);

    setUserData((prev) => ({
      ...prev,
      nickname: nickname || '사용자',
      imgNum: imgNum || 1,
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

  // 2. OpenWeatherMap API 호출
  const getWeather = async (
    lat: number,
    lon: number
  ): Promise<{
    weatherIcon: string;
    weatherDescription: string;
  }> => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''; // 환경 변수 값 로드
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      // 1. API 호출
      const response = await fetch(url);

      // 2. HTTP 응답 상태 확인
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 3. JSON 데이터 파싱
      const data = await response.json();
      const weatherMain = data.weather[0].main; // 날씨 그룹

      // 4. 날씨 그룹 -> 이모티콘 및 한국어 설명 매핑
      const weatherIconMap: Record<string, string> = {
        Clear: sunIcon,
        Clouds: cloudsIcon,
        Rain: rainIcon,
        Snow: snowIcon,
        Thunderstorm: thunderIcon,
      };

      const weatherDescriptionMap: Record<string, string> = {
        Clear: '맑음',
        Clouds: '흐림',
        Rain: '비',
        Snow: '눈',
        Thunderstorm: '천둥',
      };

      const weatherIcon = weatherIconMap[weatherMain] || '🌈'; // 기본값 설정
      const weatherDescription =
        weatherDescriptionMap[weatherMain] || '알 수 없음';

      return {
        weatherIcon,
        weatherDescription,
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return {
        weatherIcon: '',
        weatherDescription: '날씨 정보를 가져올 수 없습니다.',
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
            src={getProfileImage(userData.imgNum)}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          {/* 닉네임 */}
          <div className="">
            <span className="font-pre-bold text-[22px]">
              {userData.nickname}
            </span>{' '}
            {/* 홍길동만 pre-bold */}
            <p className="font-pre-light text-[22px] ">님 반갑습니다!</p>
          </div>
        </div>

        {/* 날짜+ 날씨 묶음*/}
        <div className="flex justify-end mt-auto font-pre-light text-opacity-50 text-12">
          <p className="text-pre-regular text-sm mr-4">{userData.date}</p>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : userData.weatherIcon ? (
            <div className="flex items-center">
              <span>{userData.weatherIcon}</span>
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
