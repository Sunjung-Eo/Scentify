import React, { useEffect, useState } from "react";
import { fragranceMap } from "../../../utils/fragranceUtils.ts";
import { CreateCapsuleRequest } from "./capsuletypes.ts";

interface CapsuleProps {
  name: string; // 기기명
  onSubmit: (requestData: CreateCapsuleRequest) => void; // 완료 버튼 클릭 시 호출될 함수
}

const Capsule = ({ name, onSubmit }: CapsuleProps) => {
  const [slot1, setSlot1] = useState<string>(""); // 슬롯 1 상태
  const [slot2, setSlot2] = useState<string>(""); // 슬롯 2 상태
  const [slot3, setSlot3] = useState<string>(""); // 슬롯 3 상태
  const [slot4, setSlot4] = useState<string>(""); // 슬롯 4 상태

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

  // useEffect를 통해 슬롯 값과 이름이 변경될 때마다 상위로 데이터 전달
  useEffect(() => {
    onSubmit({
      name, // 상위에서 전달받은 name 사용
      slot1: fragranceMap[slot1],
      slot2: fragranceMap[slot2],
      slot3: fragranceMap[slot3],
      slot4: fragranceMap[slot4],
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
