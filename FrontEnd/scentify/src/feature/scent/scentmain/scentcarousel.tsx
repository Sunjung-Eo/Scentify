import sanderwood from "../../../assets/images/sanderwood.png";
import lemon from "../../../assets/images/lemon.png";
import orangeblossom from "../../../assets/images/orangeblossom.png";
import eucalyptus from "../../../assets/images/eucalyptus.png";
import cedarwood from "../../../assets/images/cedarwood.png";
import lavendar from "../../../assets/images/lavendar.png";
import peppermint from "../../../assets/images/peppermint.png";
import whitemusk from "../../../assets/images/whitemusk.png";
import chamomile from "../../../assets/images/chamomile.png";

const scentImages = [
  { src: lemon, alt: "Lemon" },
  { src: orangeblossom, alt: "Orange Blossom" },
  { src: sanderwood, alt: "Sandalwood" },
  { src: eucalyptus, alt: "Eucalyptus" },
  { src: cedarwood, alt: "Cedarwood" },
  { src: lavendar, alt: "Lavender" },
  { src: peppermint, alt: "Peppermint" },
  { src: whitemusk, alt: "White Musk" },
  { src: chamomile, alt: "Chamomile" },
];
const ScentCarousel = () => {
  return (
    <div>
      <div className="overflow-x-scroll scrollbar-hide whitespace-nowrap">
        {/* 가로 스크롤 여전히 보임, 아직 해결 못함 */}
        <div className="flex gap-[10px]">
          {scentImages.map((scent, index) => (
            <img
              key={index}
              src={scent.src}
              alt={scent.alt}
              className="w-[70px] h-[150px] rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScentCarousel;
