import { useEffect } from 'react';
import DeviceSlide from '../../feature/Home/mainhome/device/DeviceSlide.tsx';
import UserCard from '../../feature/Home/mainhome/user/UserCard.tsx';
import { useMainDeviceStore } from '../../stores/useDeviceStore.ts';
import { homeInfo } from '../../apis/home/homeInfo.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore.ts';

const HomeMain = () => {
  const { setMainDevice, mainDevice } = useMainDeviceStore();
  const { setUser, deviceIdsAndNames } = useUserStore();
  const queryClient = useQueryClient();

  const deviceIds = deviceIdsAndNames
    ? Object.keys(deviceIdsAndNames).map(Number)
    : [];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['homeInfo'],
    // queryFn: homeInfo,
    queryFn: async () => {
      try {
        const response = await homeInfo();
        return response; // 성공 시 정상 데이터 반환
      } catch (error) {
        return null; // 실패 시 null 반환
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // ✅ API 응답이 있을 때만 상태 업데이트 (무한 렌더링 방지)
  useEffect(() => {
    if (!data?.user) return;

    console.log('업데이트 전 User:', useUserStore.getState());
    console.log('업데이트 전 Devices:', useMainDeviceStore.getState());

    setUser({
      nickname: data.user.nickname,
      imgNum: data.user.imgNum || 0,
      mainDeviceId: data.user.mainDeviceId || null,
      deviceIdsAndNames: data.deviceIdsAndNames || null, // deviceIds 대신 deviceIdsAndNames 사용
    });

    if (data.mainDevice) {
      setMainDevice(data.mainDevice);
    }

    setTimeout(() => {
      console.log('✅ 업데이트 후 User:', useUserStore.getState());
      console.log('✅ 업데이트 후 Devices:', useMainDeviceStore.getState());
    }, 100);
  }, [data]); //  `setUser`, `setDevices`는 상태 변경을 트리거하는 함수라서 의존성 배열에서 제거해도 됨

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['homeInfo'] });
  }, [queryClient]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오지 못했습니다.</p>;

  // DeviceCarousel에 전달할 데이터
  const exampleData = {
    mainDeviceId: mainDevice?.id || null,
    deviceIds: deviceIds.length > 0 ? deviceIds : [], // deviceIds가 비어있는지 확인
    devices: mainDevice ? [mainDevice] : [],
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
