import React, { useEffect, useState } from "react";
import {
  fragranceMap,
  reverseFragranceMap,
} from "../../../utils/fragranceUtils";
import { CreateCapsuleRequest } from "./capsuletypes";

//capsuleDatasms는 캡슐 등록 시 설정된 향기 (예: slot1 = 레몬, slot2 = 라벤더)
//scents는 각 슬롯에서 선택된 향기의 사용량(count) (예: slot1 = 2, slot2 = 1)

interface CapsuleProps {
  name: string; // 기기명
  onSubmit: (requestData: CreateCapsuleRequest) => void; // 완료 버튼 클릭 시 호출될 함수
  initialData?: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }; // 초기 데이터 (수정용)
}

const Capsule = ({ name, onSubmit, initialData }: CapsuleProps) => {
  // 슬롯 상태를 초기값 또는 빈 문자열로 설정
  const [slot1, setSlot1] = useState<string>(
    initialData?.slot1 !== undefined
      ? reverseFragranceMap[initialData.slot1]
      : ""
  );
  const [slot2, setSlot2] = useState<string>(
    initialData?.slot2 !== undefined
      ? reverseFragranceMap[initialData.slot2]
      : ""
  );
  const [slot3, setSlot3] = useState<string>(
    initialData?.slot3 !== undefined
      ? reverseFragranceMap[initialData.slot3]
      : ""
  );
  const [slot4, setSlot4] = useState<string>(
    initialData?.slot4 !== undefined
      ? reverseFragranceMap[initialData.slot4]
      : ""
  );

  // 슬롯별 선택 가능한 옵션
  const slot1Options = ["레몬", "유칼립투스", "페퍼민트"];
  const slot2Options = ["라벤더", "시더우드", "카모마일"];
  const slot3and4Options = [
    "레몬",
    "유칼립투스",
    "페퍼민트",
    "라벤더",
    "시더우드",
    "카모마일",
    "샌달우드",
    "화이트머스크",
    "오렌지블라썸",
  ];

  // 슬롯 상태가 변경될 때마다 상위로 데이터 전달
  useEffect(() => {
    onSubmit({
      name,
      slot1: fragranceMap[slot1] || 0,
      slot2: fragranceMap[slot2] || 0,
      slot3: fragranceMap[slot3] || 0,
      slot4: fragranceMap[slot4] || 0,
    });
  }, [name, slot1, slot2, slot3, slot4, onSubmit]);

  return (
    <div>
      <div className="text-pre-regular">
        {/* 슬롯 1 드롭다운 */}
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 1</label>
          <select
            value={slot1}
            onChange={(e) => setSlot1(e.target.value)}
            className="w-[200px] p-2 text-[12px] border border-gray-300 rounded bg-white focus:outline-none focus:ring focus:ring-brand"
          >
            <option value="" disabled>
              -- 선택하세요 --
            </option>
            {slot1Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* 슬롯 2 드롭다운 */}
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 2</label>
          <select
            value={slot2}
            onChange={(e) => setSlot2(e.target.value)}
            className="w-[200px] p-2 text-[12px] border border-gray-300 rounded bg-white focus:outline-none focus:ring focus:ring-brand"
          >
            <option value="" disabled>
              -- 선택하세요 --
            </option>
            {slot2Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* 슬롯 3 드롭다운 */}
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 3</label>
          <select
            value={slot3}
            onChange={(e) => setSlot3(e.target.value)}
            className="w-[200px] p-2 text-[12px] border border-gray-300 rounded bg-white focus:outline-none focus:ring focus:ring-brand"
          >
            <option value="" disabled>
              -- 선택하세요 --
            </option>
            {slot3and4Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* 슬롯 4 드롭다운 */}
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 4</label>
          <select
            value={slot4}
            onChange={(e) => setSlot4(e.target.value)}
            className="w-[200px] p-2 text-[12px] border border-gray-300 rounded bg-white focus:outline-none focus:ring focus:ring-brand"
          >
            <option value="" disabled>
              -- 선택하세요 --
            </option>
            {slot3and4Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Capsule;
