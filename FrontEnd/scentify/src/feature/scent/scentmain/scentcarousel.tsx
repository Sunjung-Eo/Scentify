import { useState } from "react";
import Modal from "./modal";
import scentImages from "./scentImages";
import { ScentCard } from "./scenttypes";

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
    <div>
      <div className="overflow-x-scroll scrollbar-hide whitespace-nowrap">
        <div className="flex gap-[10px]">
          {scentImages.map((scent) => (
            <img
              key={scent.id}
              src={scent.cardImage}
              alt={scent.alt}
              onClick={() => openModal(scent)}
              className="w-[70px] h-[150px] rounded-md cursor-pointer"
            />
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
