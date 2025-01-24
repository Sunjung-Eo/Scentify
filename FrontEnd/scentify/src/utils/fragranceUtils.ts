//향기와 숫자를 매핑하는 객체
export const fragranceMap: { [key: string]: number } = {
  레몬: 0,
  유칼립투스: 1,
  페퍼민트: 2,
  라벤더: 3,
  시더우드: 4,
  카모마일: 5,
  샌달우드: 6,
  화이트머스크: 7,
  오렌지블라썸: 8,
};

// 숫자를 향기로 매핑하는 객체
export const reverseFragranceMap: { [key: number]: string } =
  Object.fromEntries(
    Object.entries(fragranceMap).map(([key, value]) => [value, key])
  );

/**
 * 숫자를 향기로 매핑하는 함수
 */
export const mapIntToFragrance = (value: number): string => {
  return reverseFragranceMap[value] || "알 수 없음";
};

/**
 * 향기를 숫자로 매핑하는 함수
 */
export const mapFragranceToInt = (fragrance: string): number => {
  return fragranceMap[fragrance] ?? -1;
};
