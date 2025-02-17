import { ModalProps } from "./scenttypes";

import closeIcon from "../../../assets/icons/closeIcon.svg";

const Modal = ({
  isOpen,
  onClose,
  image,
  title,
  description,
  use,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white w-[269px] h-[332px] rounded-[20px] flex flex-col overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 z-10">
          <img src={closeIcon} alt="닫기" className="w-6 h-6" />
        </button>
        {/* 이미지 (상단에 고정) */}
        <div className="w-full h-[182px]">
          <img src={image} alt={title} />
        </div>
        {/* 제목과 설명 (고정된 크기, 내부 스크롤 가능) */}
        <div className="p-4 text-center bg-white flex flex-col h-[200px] overflow-y-auto">
          <p className="text-10 text-sub font-pre-light leading-relaxed text-left whitespace-pre-line">
            {description}
          </p>
          <p className="mt-[16px] text-[8px] text-sub font-pre-light leading-relaxed text-left whitespace-pre-line">
            {use}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
