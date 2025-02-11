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

// 향 별 색상
export const getColor = (scent: string) => {
  switch (scent) {
    case "레몬":
      return "bg-yellow-400";
    case "유칼립투스":
      return "bg-green-500";
    case "페퍼민트":
      return "bg-teal-400";
    case "라벤더":
      return "bg-purple-500";
    case "시더우드":
      return "bg-amber-800";
    case "카모마일":
      return "bg-orange-300";
    case "샌달우드":
      return "bg-green-700";
    case "화이트머스크":
      return "bg-blue-100";
    case "오렌지블라썸":
      return "bg-orange-500";
    default:
      return "bg-yellow-400";
  }
};
