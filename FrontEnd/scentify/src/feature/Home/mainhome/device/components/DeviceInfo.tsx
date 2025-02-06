import React from 'react';
import { MainDeviceState } from '../../../../../types/MainDeviceType.ts';
import deviceImg from '../../../../../assets/images/device.svg';
import PlayBtn from '../../../../../assets/icons/PlayBtn.svg';
import modifyIcon from '../../../../../assets/icons/modify-icon.svg';
import crownIcon from '../../../../../assets/icons/crown-icon.svg';
import { Link } from 'react-router-dom';
import { mapIntToFragrance } from '../../../../../utils/fragranceUtils.ts';

interface DeviceInfoProps {
  device: MainDeviceState;
  mainDeviceId: number | null;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ device, mainDeviceId }) => {
  return (
    <div className="flex flex-col items-center w-full my-2">
      {/* 기기 이름 + 수정 버튼 */}
      <div className="relative w-full px-5 flex items-center">
        <h2 className="text-[20px] font-pre-bold text-center flex items-center justify-center w-full">
          {device?.name ?? '이름 없음'}
          {device?.id === mainDeviceId && (
            <img src={crownIcon} alt="Crown Icon" className="ml-1 h-4 w-4" />
          )}
        </h2>
        <Link to="/home/devicesetting" className="absolute right-5">
          <img src={modifyIcon} alt="modifyIcon" className="w-6 h-6" />
        </Link>
      </div>
      {/* 기기 이미지 + 슬롯 정보 */}
      <div className="flex flex-row justify-between items-center w-full px-8">
        <div className="flex flex-row relative border-2 border-red-500">
          <img src={deviceImg} alt="deviceImg" className="w-full h-full" />
          <img
            src={PlayBtn}
            alt="btn"
            className="absolute -bottom-4 -right-4 w-[60px] h-[60px]"
          />
        </div>
        <div className="flex justify-around gap-2.5 mt-8 font-pre-light text-[8px]">
          {[1, 2, 3, 4].map((slot) => {
            const remainingRatio =
              device?.[`slot${slot}RemainingRatio` as keyof MainDeviceState] ??
              0;
            const fragranceInt = device?.[
              `slot${slot}` as keyof MainDeviceState
            ] as number | null;
            const fragranceName =
              fragranceInt !== null
                ? mapIntToFragrance(fragranceInt)
                : '미설정';

            return (
              <div key={slot} className="flex flex-col items-center">
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
                <span className="text-pre-light text-2 mt-2 leading-snug text-center">
                  {fragranceName.length > 5 ? (
                    <>
                      {fragranceName.slice(0, 3)}
                      <br />
                      {fragranceName.slice(3)}
                    </>
                  ) : (
                    fragranceName
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;
