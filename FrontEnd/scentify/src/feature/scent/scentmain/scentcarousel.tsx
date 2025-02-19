import { useState } from 'react';

import Modal from './modal';
import scentImages from './scentImages';
import { ScentCard } from './scenttypes';

const ScentCarousel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ScentCard | null>(null);

  const openModal = (card: ScentCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 캐러셀 영역 */}
      <div className="w-full overflow-x-auto whitespace-nowrap">
        <div className="flex gap-4 w-max">
          {scentImages.map((scent) => (
            <div
              key={scent.id}
              onClick={() => openModal(scent)}
              className="relative w-[60px] h-[120px] bg-cover bg-center rounded-2xl shadow-md cursor-pointer"
              style={{
                backgroundImage: `url(${scent.modalImage})`,
              }}
            >
              {/* 향 이름을 중앙에 표시 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/15 rounded-2xl">
                <p className="text-white text-[7px] font-poppins-thin">
                  {scent.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedCard && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={selectedCard.modalImage}
          title={selectedCard.alt}
          description={selectedCard.description}
          use={selectedCard.use}
        />
      )}
    </div>
  );
};

export default ScentCarousel;
