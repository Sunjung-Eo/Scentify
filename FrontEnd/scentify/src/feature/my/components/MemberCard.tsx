import { useState } from "react";
import Modal from "../../../components/Alert/Modal";
import { MemberCardProps } from "../groupTypes";
import crownIcon from "../../../assets/icons/crown-icon.svg";

const MemberCard = ({
  nickname,
  onDelete,
  showDeleteButton,
  isAdmin,
}: MemberCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 삭제 버튼 클릭 시 모달 열기
  const handleDeleteButtonClick = () => {
    setModalOpen(true);
  };

  // 모달의 확인 버튼 클릭 시 onDelete 호출하고 모달 닫기
  const handleConfirm = () => {
    onDelete();
    setModalOpen(false);
  };

  // 모달의 취소 버튼 클릭 시 모달 닫기
  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full h-[70px] border-b-[0.7px] border-gray">
        {/*개인 멤버 박스 */}
        <div className="flex flex-col ml-3">
          <div className="flex items-center">
            {isAdmin && (
              <img src={crownIcon} alt="Admin" className="w-4 h-4 mr-2" />
            )}
            <p className="text-16 font-pre-medium">{nickname}</p>
          </div>
        </div>

        {/* showDeleteButton이 true일 때만 삭제 버튼 표시 */}
        {showDeleteButton && (
          <button
            onClick={handleDeleteButtonClick}
            className="ml-auto mr-3 w-[65px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
          >
            삭제
          </button>
        )}
      </div>
      {/* 삭제 버튼 클릭 시 모달창 */}
      {modalOpen && (
        <Modal
          message="멤버를 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default MemberCard;
