import React, { useState } from "react";
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
      <div className="flex items-center justify-between py-2">
        {/* 닉네임 영역 */}
        <div className="flex flex-col ml-4">
          <div className="flex items-center">
            <p className="text-16 font-pre-medium">{nickname}</p>
            {isAdmin && (
              <img src={crownIcon} alt="Admin" className="w-4 h-4 ml-2" />
            )}
          </div>
        </div>

        {/* showDeleteButton이 true일 때만 삭제 버튼 표시 */}
        {showDeleteButton && (
          <button
            onClick={handleDeleteButtonClick}
            className="ml-auto w-[65px] h-[25px] text-[12px] text-sub font-pre-light rounded-lg border-[1px] border-lightgray focus:outline-none focus:ring-1 focus:ring-brand"
          >
            삭제
          </button>
        )}
      </div>
      {/* 모달창: 삭제 버튼 클릭 시 "멤버를 삭제하시겠습니까?" 메시지와 함께 표시 */}
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
