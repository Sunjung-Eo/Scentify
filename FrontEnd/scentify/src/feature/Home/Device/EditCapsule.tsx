import React, { useState } from "react";
import {
  fragranceMap,
  reverseFragranceMap,
} from "../../../utils/fragranceUtils.ts";

interface EditCapsuleProps {
  slotData: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  };
  onUpdate: (updatedData: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  }) => void;
}

const EditCapsule = ({ slotData, onUpdate }: EditCapsuleProps) => {
  const [slot1, setSlot1] = useState<string>(
    reverseFragranceMap[slotData.slot1] || ""
  );
  const [slot2, setSlot2] = useState<string>(
    reverseFragranceMap[slotData.slot2] || ""
  );
  const [slot3, setSlot3] = useState<string>(
    reverseFragranceMap[slotData.slot3] || ""
  );
  const [slot4, setSlot4] = useState<string>(
    reverseFragranceMap[slotData.slot4] || ""
  );

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

  // 슬롯 값 변경 시 호출하여 부모 컴포넌트로 전달
  const handleUpdate = () => {
    onUpdate({
      slot1: fragranceMap[slot1] || -1,
      slot2: fragranceMap[slot2] || -1,
      slot3: fragranceMap[slot3] || -1,
      slot4: fragranceMap[slot4] || -1,
    });
  };

  return (
    <div>
      {/* 슬롯 1 */}
      <div className="flex items-center justify-between mb-4">
        <label className="mr-4 text-[12px] text-pre-light">캡슐 슬롯 1</label>
        <select
          value={slot1}
          onChange={(e) => {
            setSlot1(e.target.value);
            handleUpdate();
          }}
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

      {/* 슬롯 2 */}
      <div className="flex items-center justify-between mb-4">
        <label className="mr-4 text-[12px] text-pre-light">캡슐 슬롯 2</label>
        <select
          value={slot2}
          onChange={(e) => {
            setSlot2(e.target.value);
            handleUpdate();
          }}
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

      {/* 슬롯 3 */}
      <div className="flex items-center justify-between mb-4">
        <label className="mr-4 text-[12px] text-pre-light">캡슐 슬롯 3</label>
        <select
          value={slot3}
          onChange={(e) => {
            setSlot3(e.target.value);
            handleUpdate();
          }}
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

      {/* 슬롯 4 */}
      <div className="flex items-center justify-between mb-4">
        <label className="mr-4 text-[12px] text-pre-light">캡슐 슬롯 4</label>
        <select
          value={slot4}
          onChange={(e) => {
            setSlot4(e.target.value);
            handleUpdate();
          }}
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
  );
};

export default EditCapsule;
