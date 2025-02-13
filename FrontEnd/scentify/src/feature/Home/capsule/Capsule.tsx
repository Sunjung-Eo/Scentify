import React, { useEffect, useState } from 'react';
import {
  fragranceMap,
  reverseFragranceMap,
} from '../../../utils/fragranceUtils';
import { CreateCapsuleRequest } from './capsuletypes';

interface CapsuleProps {
  name: string;
  onSubmit: (data: CreateCapsuleRequest) => void;
  initialData?: {
    slot1: number;
    slot2: number;
    slot3: number;
    slot4: number;
  } | null;
}

const Capsule = ({ name, onSubmit, initialData }: CapsuleProps) => {
  console.log('🩵 initialData', initialData);

  const slot1Options = ['레몬', '유칼립투스', '페퍼민트'];
  const slot2Options = ['라벤더', '시더우드', '카모마일'];
  const slot3and4Options = [
    '레몬',
    '유칼립투스',
    '페퍼민트',
    '라벤더',
    '시더우드',
    '카모마일',
    '샌달우드',
    '화이트머스크',
    '오렌지블라썸',
  ];

  const [slot1, setSlot1] = useState<string>(() => {
    if (initialData && typeof initialData.slot1 === 'number') {
      return reverseFragranceMap[initialData.slot1] || '';
    }
    return '';
  });

  const [slot2, setSlot2] = useState<string>(() => {
    if (initialData && typeof initialData.slot2 === 'number') {
      return reverseFragranceMap[initialData.slot2] || '';
    }
    return '';
  });

  const [slot3, setSlot3] = useState<string>(() => {
    if (initialData && typeof initialData.slot3 === 'number') {
      return reverseFragranceMap[initialData.slot3] || '';
    }
    return '';
  });

  const [slot4, setSlot4] = useState<string>(() => {
    if (initialData && typeof initialData.slot4 === 'number') {
      return reverseFragranceMap[initialData.slot4] || '';
    }
    return '';
  });

  // ✅ `initialData`가 변경될 때만 드롭다운 값 업데이트 (초기값 보장)
  useEffect(() => {
    if (!initialData) return;

    setSlot1(reverseFragranceMap[initialData.slot1] || '');
    setSlot2(reverseFragranceMap[initialData.slot2] || '');
    setSlot3(reverseFragranceMap[initialData.slot3] || '');
    setSlot4(reverseFragranceMap[initialData.slot4] || '');
  }, [initialData]);

  useEffect(() => {
    onSubmit({
      name,
      slot1: fragranceMap[slot1] || 0,
      slot2: fragranceMap[slot2] || 0,
      slot3: fragranceMap[slot3] || 0,
      slot4: fragranceMap[slot4] || 0,
    });
  }, [name, slot1, slot2, slot3, slot4, onSubmit]);

  const selectStyles =
    'w-[200px] p-2 text-[12px] border border-gray-300 rounded bg-white focus:outline-none focus:border-2 focus:border-brand';

  return (
    <div>
      <div className="text-pre-regular font-pre-light text-12">
        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 1</label>
          <select
            value={slot1}
            onChange={(e) => setSlot1(e.target.value)}
            className={selectStyles}
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

        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 2</label>
          <select
            value={slot2}
            onChange={(e) => setSlot2(e.target.value)}
            className={selectStyles}
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

        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 3</label>
          <select
            value={slot3}
            onChange={(e) => setSlot3(e.target.value)}
            className={selectStyles}
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

        <div className="flex items-center justify-between mb-4">
          <label className="mr-4 text-[12px]">캡슐 슬롯 4</label>
          <select
            value={slot4}
            onChange={(e) => setSlot4(e.target.value)}
            className={selectStyles}
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
