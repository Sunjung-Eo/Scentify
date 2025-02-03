// 향기 번호 이름으로 변환
export const getScentName = (choice: number): string => {
  const scentOptions = [
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

  return scentOptions[choice];
};
