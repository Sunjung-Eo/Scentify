import { useEffect } from "react";
import DeviceSlide from "../../feature/Home/mainhome/device/DeviceSlide.tsx";
import UserCard from "../../feature/Home/mainhome/user/UserCard.tsx";
import { useDeviceStore } from "../../stores/useDeviceStore.ts";
import { homeInfo } from "../../apis/home/homeInfo.ts";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../stores/useUserStore.ts";
import { dummyDevices, dummyMainDevice } from "./dummy.ts";

const USE_DUMMY_DATA = false; // ✅ true → 더미 데이터 사용, false → API 사용

const HomeMain = () => {
  const { devices, setDevices } = useDeviceStore();
  const { setUser } = useUserStore();
  const { deviceIds } = useUserStore();

  // React Query로 homeInfo() 호출
  const { data, isLoading, isError } = useQuery({
    queryKey: ["homeInfo"],
    queryFn: homeInfo,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !USE_DUMMY_DATA, // ✅ USE_DUMMY_DATA가 true면 API 호출 비활성화
  });

  // ✅ 더미 데이터 적용 (한 번만 실행)
  useEffect(() => {
    if (USE_DUMMY_DATA) {
      setDevices(dummyMainDevice, dummyDevices),
        setUser({
          nickname: "더미 닉네임",
          imgNum: 1,
          mainDeviceId: dummyMainDevice.deviceId,
          deviceIds: dummyDevices.map((device) => device.deviceId), // ✅ 더미 디바이스 ID 리스트 추가
        });
    }
  }, [setDevices, setUser]);

  // ✅ API 응답이 있을 때만 상태 업데이트 (무한 렌더링 방지)
  useEffect(() => {
    if (!USE_DUMMY_DATA && data) {
      setUser({
        nickname: data.user.nickName,
        imgNum: data.user.imgNum,
        mainDeviceId: data.user.mainDeviceId,
        deviceIds: data.deviceIds || [],
      });

      setDevices(
        data.mainDevice,
        data.deviceIds.map((id: number) => ({ deviceId: id }))
      );
    }
  }, [data, setUser, setDevices]);

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오지 못했습니다.</p>;

  // 메인 디바이스 찾기
  const mainDevice = devices.find((device) => device.isRepresentative);
  const mainDeviceId = mainDevice ? mainDevice.deviceId : null;

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
