import { useEffect } from 'react';
import DeviceSlide from '../../feature/Home/mainhome/device/DeviceSlide.tsx';
import UserCard from '../../feature/Home/mainhome/user/UserCard.tsx';
import { useDeviceStore } from '../../stores/useDeviceStore.ts';
import { homeInfo } from '../../apis/home/homeInfo.ts';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore.ts';
import { useAuthStore } from '../../stores/useAuthStore.ts';

const HomeMain = () => {
  const { devices, setDevices } = useDeviceStore();
  const { setUser } = useUserStore();
  const { deviceIds } = useUserStore();
  const accessToken = useAuthStore.getState().accessToken;

  // React Query로 homeInfo() 호출
  const { data, isLoading, isError } = useQuery({
    queryKey: ['homeInfo'], // 'homeInfo' 키로 캐싱싱
    queryFn: homeInfo, // homeInfo() API 호출
    staleTime: 1000 * 60 * 5, // 5분 동안 캐싱 유지
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
  });

  // ✅ API 응답이 있을 때만 상태 업데이트 (무한 렌더링 방지)
  useEffect(() => {
    if (data) {
      setUser({
        nickname: data.user.nickName,
        imgNum: data.user.imgNum,
        mainDeviceId: data.user.mainDeviceId,
        deviceIds: data.deviceIds || [],
      });

      setDevices(
        data.mainDevice,
        data.deviceIds.map((id: number) => ({ id }))
      );
    }
  }, [data, setUser, setDevices]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오지 못했습니다.</p>;

  // 메인 디바이스 찾기
  const mainDevice = devices.find((device) => device.isRepresentative);
  const mainDeviceId = mainDevice ? mainDevice.id : null;

  // DeviceCarousel에 전달할 데이터
  const exampleData = {
    main_device_id: mainDeviceId, // ✅ 배열 대신 단일 값
    deviceIds: deviceIds || [], // ✅ deviceIds 추가 (기본값 빈 배열)
    devices: devices,
    autoSchedules: data?.autoSchedules || [],
    customSchedules: data?.customSchedules || [],
  };

  return (
    <div className="flex flex-col content px-4 py-1">
      <div className="mb-5">
        <UserCard />
      </div>
      {/* DeviceCarousel에 데이터 전달 */}
      <DeviceSlide data={exampleData} />
      <div className="h-4"></div>
    </div>
  );
};

export default HomeMain;
