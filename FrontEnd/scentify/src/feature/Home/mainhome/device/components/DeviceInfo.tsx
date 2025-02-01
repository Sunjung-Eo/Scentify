import React from 'react';
import { DeviceState } from '../../../../../types/DeviceType.ts';
import deviceImg from '../../../../../assets/images/device.svg';
import PlayBtn from '../../../../../assets/icons/PlayBtn.svg';
import modifyIcon from '../../../../../assets/icons/modify-icon.svg';
import crownIcon from '../../../../../assets/icons/crown-icon.svg';
import { Link } from 'react-router-dom';
import { mapIntToFragrance } from '../../../../../utils/fragranceUtils.ts';

interface DeviceInfoProps {
  device: DeviceState;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({ device }) => {
  return (
    <div className="grid grid-cols-3 items-center w-[300px] mb-5">
      <div></div>
      <h2 className="text-[20px] font-pre-bold text-center flex items-center justify-center">
        {device?.name ?? '이름 없음'}
        {device?.isRepresentative && (
          <img src={crownIcon} alt="Crown Icon" className="ml-1 h-4 w-4" />
        )}
      </h2>
      <Link to="/home/devicesetting">
        <img
          src={modifyIcon}
          alt="modifyIcon"
          className="justify-self-end w-[24px] h-[24px]"
        />
      </Link>

      <div className="flex justify-between items-center w-full px-7">
        <div className="relative w-[72px] h-[120px]">
          <img src={deviceImg} alt="deviceImg" className="w-full h-full" />
          <img
            src={PlayBtn}
            alt="btn"
            className="absolute -bottom-4 -right-4 w-[50px] h-[50px]"
          />
        </div>

        <div className="flex justify-around gap-2.5">
          {[1, 2, 3, 4].map((slot) => {
            const remainingRatio =
              device?.[`slot${slot}RemainingRatio` as keyof DeviceState] ?? 0;
            const fragranceInt = device?.[
              `slot${slot}` as keyof DeviceState
            ] as number | null;
            const fragranceName =
              fragranceInt !== null
                ? mapIntToFragrance(fragranceInt)
                : '미설정';

            return (
              <div key={slot} className="flex flex-col items-center">
                <div className="relative w-6 h-20 bg-[#EBEAE5] rounded overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-brand"
                    style={{ height: `${remainingRatio}%` }}
                  />
                </div>
                <span className="text-pre-light text-[8px] mt-2 leading-snug text-center">
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
