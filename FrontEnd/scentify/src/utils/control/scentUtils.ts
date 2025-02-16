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
      return "bg-lemon";
    case "유칼립투스":
      return "bg-eucalyptus";
    case "페퍼민트":
      return "bg-peppermint";
    case "라벤더":
      return "bg-lavender";
    case "시더우드":
      return "bg-cedarwood";
    case "카모마일":
      return "bg-chamomile";
    case "샌달우드":
      return "bg-sandalwood";
    case "화이트머스크":
      return "bg-whitemusk border-0.2 border-gray";
    case "오렌지블라썸":
      return "bg-orangeblossom";
    default:
      return "bg-lemon";
  }
};
