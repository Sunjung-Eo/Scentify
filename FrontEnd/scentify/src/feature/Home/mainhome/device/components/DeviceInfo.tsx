import React, { useEffect, useState } from 'react';
import { MainDeviceState } from '../../../../../types/MainDeviceType.ts';
import deviceImg from '../../../../../assets/images/device.svg';
import PlayBtn from '../../../../../assets/icons/PlayBtn.svg';
import modifyIcon from '../../../../../assets/icons/modify-icon.svg';
import crownIcon from '../../../../../assets/icons/crown-icon.svg';
import { Link, useLocation } from 'react-router-dom';
import { mapIntToFragrance } from '../../../../../utils/fragranceUtils.ts';
import { useMutation } from '@tanstack/react-query';
import { sprayNow } from '../../../../../apis/home/schedule/sparyNow';
import Alert from '../../../../../components/Alert/Alert.tsx';

interface DeviceInfoProps {
  device: MainDeviceState;
  mainDeviceId: number | null;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ device, mainDeviceId }) => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  // 즉시분사 뮤테이션 추가
  const sprayMutation = useMutation({
    mutationFn: sprayNow,
    onSuccess: () => {
      setAlertConfig({
        show: true,
        message: '분사가 시작되었습니다.',
      });
    },
    onError: () => {
      setAlertConfig({
        show: true,
        message: '분사에 실패했습니다.',
      });
    },
  });

  // 즉시분사 핸들러
  const handleSprayClick = () => {
    if (!device?.id) {
      setAlertConfig({
        show: true,
        message: '기기 정보를 찾을 수 없습니다.',
      });
      return;
    }
    sprayMutation.mutate(device.id);
  };

  // // 슬롯 정보 렌더링 함수
  // const renderSlotInfo = (slotNumber: number, remainingRatio: number | null) => {
  //   if (remainingRatio === null) return null;

  // ✅ `device`가 없으면 로딩 화면 표시
  if (!device || !device.defaultCombination) {
    return <div className="content">로딩 중...</div>;
  }

  return (
    <>
      {alertConfig.show && (
        <Alert
          message={alertConfig.message}
          onClose={() => setAlertConfig({ show: false, message: '' })}
          showButtons={true}
          confirmText="확인"
          cancelText=""
        />
      )}
      <div className="flex flex-col items-center w-full my-2">
        {/* 기기 이름 + 수정 버튼 */}
        <div className="relative w-full px-5 flex items-center">
          <p className="text-[18px] font-pre-medium text-center flex items-center justify-center w-full">
            {device?.name ?? '이름 없음'}
            {device?.id === mainDeviceId && (
              <img src={crownIcon} alt="Crown Icon" className="ml-1 h-4 w-4" />
            )}
          </p>

          {/* <Link to="/home/devicesetting" className="absolute right-5">
          <img src={modifyIcon} alt="modifyIcon" className="w-6 h-6" />
        </Link> */}
          <div className="absolute right-5 font-pre-light text-[12px]">
            <div className="relative">
              <img
                src={modifyIcon}
                alt="modifyIcon"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <Link
                    to="/home/edit/capsule"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    state={{
                      deviceId: device?.id,
                      initialData: {
                        name: device?.name,
                        slot1: device?.slot1,
                        slot2: device?.slot2,
                        slot3: device?.slot3,
                        slot4: device?.slot4,
                        slot1RemainingRatio: device?.slot1RemainingRatio,
                        slot2RemainingRatio: device?.slot2RemainingRatio,
                        slot3RemainingRatio: device?.slot3RemainingRatio,
                        slot4RemainingRatio: device?.slot4RemainingRatio,
                      },
                    }}
                  >
                    캡슐 수정
                  </Link>
                  <Link
                    to="/home/edit/defaultscent"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    state={{
                      deviceId: device?.id,
                      defaultCombination: device?.defaultCombination || null, // ✅ undefined 방지
                    }}
                  >
                    기본향 수정
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 기기 이미지 + 슬롯 정보 */}
        <div className="flex flex-row justify-between items-center w-full px-6">
          <div className="flex flex-row relative border-2 border-red-500">
            <img src={deviceImg} alt="deviceImg" className="w-full h-full" />
            <img
              src={PlayBtn}
              alt="btn"
              className="absolute -bottom-4 -right-2 w-[60px] h-[60px]"
              onClick={handleSprayClick}
            />
          </div>
          <div className="flex justify-center gap-2.5 mt-8 font-pre-light text-[8px]">
            {[1, 2, 3, 4].map((slot) => {
              const remainingRatio =
                device?.[
                  `slot${slot}RemainingRatio` as keyof MainDeviceState
                ] ?? 0;
              const fragranceInt = device?.[
                `slot${slot}` as keyof MainDeviceState
              ] as number | null;
              const fragranceName =
                fragranceInt !== null
                  ? mapIntToFragrance(fragranceInt)
                  : '미설정';

              // 글자 수에 따라 줄바꿈 방식 조정
              let firstLine = fragranceName;
              let secondLine = '';

              if (fragranceName.length === 4) {
                firstLine = fragranceName.slice(0, 2);
                secondLine = fragranceName.slice(2);
              } else if (fragranceName.length >= 5) {
                firstLine = fragranceName.slice(0, 3);
                secondLine = fragranceName.slice(3);
              }

              return (
                <div key={slot} className="flex flex-col items-center w-[24px]">
                  {/* 막대 그래프 */}
                  <div className="relative w-5 h-[84px] flex-shrink-0 rounded-[4px] border-[0.5px] border-white overflow-hidden">
                    {/* 배경 막대 */}
                    <div className="absolute inset-0 bg-component" />
                    {/* 내부 게이지 막대 */}
                    <div
                      className="absolute bottom-0 w-full rounded-t-[4px]"
                      style={{
                        height: `${remainingRatio}%`,
                        background:
                          'linear-gradient(180deg, #6B705C 0%, #FFF 100%)',
                      }}
                    />
                  </div>

                  {/* 향기 이름 (자동 줄바꿈) */}
                  <span
                    className="text-pre-light text-[8px] mt-2 text-center leading-tight"
                    style={{
                      width: '40px',
                      letterSpacing: '-0.5px', // 글자 간격 좁히기
                    }}
                  >
                    {firstLine}
                    {secondLine && <br />}
                    {secondLine}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceInfo;
