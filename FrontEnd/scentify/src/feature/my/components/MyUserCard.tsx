import React, { useEffect, useState } from 'react';
import { UserData } from '../../../feature/Home/mainhome/user/UserTypes';

export const MyUserCard: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userId: 'aaaa',
    userName: '홍길동', // 사용자 이름 하드코딩 (백엔드 연동 시 업데이트 가능)
    imgNum: 1, // 기본 프로필 사진 번호
    mainDeviceId: 0,
    date: '',
    weatherIcon: '',
    weatherDescription: '',
  });

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
        Clear: '☀️', // 맑음
        Clouds: '☁️', // 흐림
        Rain: '🌧️', // 비
        Snow: '❄️', // 눈
        Thunderstorm: '⛈️', // 천둥
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
    <div className="bg-sub rounded-3xl px-6 py-4 text-white h-[132px] flex flex-col">
      {/* 프로필이미지+닉네임 묶음 */}
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <img
          src={`https://example.com/profile-images/img-${userData.imgNum}.png`} // img_num 기반 동적 프로필 URL
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        {/* 닉네임 */}
        <p className="text-[20px]">
          <span className="font-pre-bold">{userData.userName}</span>{' '}
          {/* 홍길동만 pre-bold */}
          <br />님 반갑습니다!
        </p>
      </div>

      {/* 날짜+ 날씨 묶음*/}
      <div className="flex justify-end mt-auto">
        <p className="text-pre-regular text-sm mr-4">{userData.date}</p>
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : userData.weatherIcon ? (
          <div className="flex items-center">
            <span>{userData.weatherIcon}</span>
            <p className="text-pre-regular text-[12px] ml-1">
              {userData.weatherDescription}
            </p>
          </div>
        ) : (
          <span>날씨 정보를 가져오는 중...</span>
        )}
      </div>
    </div>
  );
};

export default MyUserCard;
