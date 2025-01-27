import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlarmIcon from "../../../assets/icons/alarm-icon.svg";
import ModifyIcon from "../../../assets/icons/modify-icon.svg";
import DeviceSelect from "../../../components/Control/DeviceSelect";
import HeartButton from "../../../components/Button/HeartButton";
import DeleteConfirmModal from "./DeleteReservationModal";
import {
  Reservations,
  HeartStatus,
  ReservationManagerProps,
} from "./ReservationType";

export default function ReservationManager({
  selectedDevice,
  onDeviceChange,
}: ReservationManagerProps) {
  const navigate = useNavigate();

  // 대표기기, 기기 명, 각 기기 별 예약 목록 - api나 저장소, 상위 컴포넌트에서 가져오기
  const [heartStatus, setHeartStatus] = useState<HeartStatus>({});
  const reservations: Reservations = {
    기기A: [],
    기기B: ["예약 1", "예약 2"],
    기기C: ["예약 3"],
  };
  const devices = Object.keys(reservations);

  // 삭제 모달
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reservationDelete, setReservationDelete] = useState<string | null>(
    null
  );
  const handleDeleteClick = (reservation: string) => {
    setReservationDelete(reservation);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    // 삭제 API 호출 추가
    if (reservationDelete) {
      // TODO: 추후 로직 추가 예정
    }
    setDeleteModalOpen(false);
    setReservationDelete(null);
  };
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setReservationDelete(null);
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-start gap-1">
          <img src={AlarmIcon} alt="알람 이미지" />
          <h2>예약 관리</h2>
        </div>
        <div className="absolute left-[209px] top-[-4px] z-40">
          <DeviceSelect
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceChange={onDeviceChange}
          />
        </div>
      </div>
      {reservations[selectedDevice].length > 0 ? (
        <div className="mt-5">
          {reservations[selectedDevice].map((reservation, index) => (
            <div
              key={index}
              className="flex p-3 border-b-0.2 border-lightgray justify-between"
            >
              <div className="text-base font-pre-medium">{reservation}</div>
              <div className="flex flex-col justify-between gap-3">
                <div className="flex justify-between gap-2">
                  {/* 찜하기 버튼 상태는 Scent탭 눌렀을 때 적용 */}
                  <HeartButton
                    isLiked={heartStatus[reservation]}
                    onToggle={(newState) => {
                      setHeartStatus((prev) => ({
                        ...prev,
                        [reservation]: newState,
                      }));
                    }}
                  />
                  <button
                    onClick={() =>
                      navigate(`/modify-reservation/${reservation}`)
                    }
                  >
                    <img src={ModifyIcon} alt="수정 이미지" />
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteClick(reservation)}
                  className="w-[65px] h-[30px] border-0.2 border-lightgray font-pre-light text-12 rounded-lg"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          {deleteModalOpen && (
            <DeleteConfirmModal
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          )}
        </div>
      ) : (
        <p className="mt-40 font-pre-light text-14 text-gray text-center">
          + 버튼을 눌러 예약을 설정해주세요.
        </p>
      )}
    </div>
  );
}
