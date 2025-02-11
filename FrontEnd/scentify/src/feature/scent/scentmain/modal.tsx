import { ModalProps } from "./scenttypes";
import closeIcon from "../../../assets/icons/closeIcon.svg";

const Modal = ({ isOpen, onClose, image, title, description }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      {/* 모달 컨테이너 (고정된 크기) */}
      <div className="bg-white w-[265px] h-[350px] rounded-[20px] flex flex-col overflow-hidden relative">
        {/* 닫기 버튼 (모달 내부 우측 상단) */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10">
          <img src={closeIcon} alt="닫기" className="w-6 h-6" />
        </button>
        {/* 이미지 (상단에 고정) */}
        <div className="w-full h-[150px]">
          <img src={image} alt={title} />
        </div>

        {/* 제목과 설명 (고정된 크기, 내부 스크롤 가능) */}
        <div className="p-4 text-center bg-white flex flex-col h-[200px] overflow-y-auto">
          <h2 className="text-lg font-pre-medium text-sub mb-2">{title}</h2>
          <p className="text-sm text-gray font-pre-light leading-relaxed text-left whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
