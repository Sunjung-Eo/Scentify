import lemonModal from "../../../assets/images/scentmodal/lemonC.png";
import orangeblossomModal from "../../../assets/images/scentmodal/orangeC.png";
import sandalwoodModal from "../../../assets/images/scentmodal/sanderwoodC.png";
import eucalyptusModal from "../../../assets/images/scentmodal/eucalyptusC.png";
import cedarwoodModal from "../../../assets/images/scentmodal/cedarwoodC.png";
import lavendarModal from "../../../assets/images/scentmodal/lavendarC.png";
import peppermintModal from "../../../assets/images/scentmodal/peppermintC.png";
import whitemuskModal from "../../../assets/images/scentmodal/whitemuskC.png";
import chamomileModal from "../../../assets/images/scentmodal/chamomileC.png";
// 향기 데이터 배열
const scentImages = [
  {
    id: 1,
    modalImage: lemonModal,
    alt: "Lemon",
    description: `레몬 향은 상쾌한 시트러스 향으로 공간에 활기를 더합니다. 상큼한 향이 기분 전환과 에너지 충전에 효과적입니다.`,

    use: `활용 가능 공간
주방: 청결하고 산뜻한 분위기 연출.
거실: 활기차고 생기 넘치는 공간을 조성.
욕실: 상쾌하고 깨끗한 느낌을 더함.`,
  },
  {
    id: 2,
    modalImage: orangeblossomModal,
    alt: "Orange Blossom",
    description: `오렌지 블라썸 향은 달콤하고 신선한 플로럴 시트러스 향으로, 공간에 생기를 더합니다.
상큼한 향이 기분을 전환시켜 활력을 되찾게 합니다.`,

    use: `활용 가능 공간
주방: 밝고 생기 넘치는 분위기 조성.
거실: 에너제틱한 공간 연출.
욕실/스파 공간: 상쾌하고 활기찬 느낌 강화.`,
  },
  {
    id: 3,
    modalImage: sandalwoodModal,
    alt: "Sandalwood",
    description: `샌달우드 향은 따뜻하고 고급스러운 나무 향으로, 시간이 지날수록 깊이감이 더해집니다.
감각적인 우디 향이 공간에 차분함과 우아함을 더합니다.`,

    use: `활용 가능 공간
서재/작업실: 고요하고 안정적인 환경 조성.
거실: 고급스럽고 세련된 공간 연출.
침실: 편안하고 차분한 분위기를 만들어 숙면 도움.`,
  },
  {
    id: 4,
    modalImage: eucalyptusModal,
    alt: "Eucalyptus",
    description: `유칼립투스 향은 신선하고 상쾌한 허브 향으로, 공간을 청량하고 깨끗하게 만듭니다.
마음을 맑게 하고 집중력을 높이는 데 효과적입니다.`,

    use: `활용 가능 공간
서재/작업실: 집중력 강화.
욕실: 청결하고 상쾌한 분위기 조성.
거실: 자연의 느낌을 더해 편안한 공간 연출.`,
  },
  {
    id: 5,
    modalImage: cedarwoodModal,
    alt: "Cedarwood",
    description: `시더우드 향은 깊고 진한 우디 향으로 공간에 안정감과 고급스러움을 제공합니다.
잔잔한 나무 향이 차분하고 편안한 환경을 조성합니다.`,

    use: `활용 가능 공간
거실: 안정감 있는 분위기 연출.
서재: 고요하고 집중적인 환경 조성.
침실: 편안하고 차분한 휴식 공간.`,
  },
  {
    id: 6,
    modalImage: lavendarModal,
    alt: "Lavender",
    description: `라벤더 향은 부드럽고 편안한 허브 향으로 스트레스를 완화시켜줍니다.
마음을 차분하게 하고 편안한 분위기를 제공합니다.`,

    use: `활용 가능 공간
침실: 숙면과 편안한 분위기 조성.
욕실/스파 공간: 힐링과 안정감을 더함.
거실: 차분하고 고요한 환경 조성.`,
  },
  {
    id: 7,
    modalImage: peppermintModal,
    alt: "Peppermint",
    description: `페퍼민트 향은 청량한 민트와 허브가 어우러진 상쾌한 향입니다.
활력을 주고 머리를 맑게 하며 피로 해소에 도움을 줍니다.`,

    use: `활용 가능 공간
서재/작업실: 집중력과 창의력을 높이는 데 도움.
주방: 생기 있는 환경 조성.
거실: 활력과 상쾌함을 더해 활기찬 분위기 연출.`,
  },
  {
    id: 8,
    modalImage: whitemuskModal,
    alt: "White Musk",
    description: `화이트 머스크 향은 부드러운 파우더리 향으로 포근하고 따뜻한 분위기를 더합니다.
은은한 향이 오래 지속되어 편안한 환경을 만들어줍니다.`,

    use: `활용 가능 공간
침실: 부드럽고 안락한 분위기로 휴식의 질 향상.
거실: 포근하고 아늑한 공간 연출.
욕실/스파 공간: 청결하고 상쾌한 느낌 부여.`,
  },
  {
    id: 9,
    modalImage: chamomileModal,
    alt: "Chamomile",
    description: `카모마일 향은 달콤하고 부드러운 허브 향으로, 마음을 차분하게 하고 편안한 휴식을 제공합니다.
심신의 안정을 돕고 아늑한 분위기를 조성합니다.`,

    use: `활용 가능 공간
침실: 아늑하고 편안한 휴식 공간.
욕실/스파 공간: 힐링과 스트레스 완화.
거실: 차분하고 안정적인 환경 연출.`,
  },
];

export default scentImages;
