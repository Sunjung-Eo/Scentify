import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/useAuthStore";
import { getCombinationById } from "../../../apis/control/getCombinationById";
import AlarmIcon from "../../../assets/icons/alarm-icon.svg";
import ModifyIcon from "../../../assets/icons/modify-icon.svg";
import HeartButton from "../../../components/Button/HeartButton";
import DeleteConfirmModal from "./DeleteReservationModal";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";
import { DAYS_BIT, convertTo12Hour } from "../../../utils/control/timeUtils";
import {
  Reservations,
  HeartStatus,
  ReservationManagerProps,
} from "./ReservationType";

export default function ReservationManager({
  reservationData,
  // selectedDevice,
}: ReservationManagerProps) {
  const navigate = useNavigate();

  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const customSchedules = reservationData?.customSchedules || []; // 기기 한개의 예약 데이터 저장
  const [combinations, setCombinations] = useState<{ [key: number]: any }>({}); // 해당 예약의 조합 데이터 저장

  // 삭제 모달
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reservationDelete, setReservationDelete] = useState<string | null>(
    null
  );
  const handleDeleteClick = (id: number) => {
    setReservationDelete(id);
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

  // 요일 비스마스크 변환
  const getDaysFromBitMask = (bitmask: number): string[] => {
    return Object.entries(DAYS_BIT)
      .filter(([_, bit]) => (bitmask & bit) > 0)
      .map(([day]) => day);
  };

  // 해당 예약의 향조합정보 가져오기
  useEffect(() => {
    const fetchCombinationData = async () => {
      try {
        // 모든 combinationId에 대해 API 호출
        const combinationData = await Promise.all(
          customSchedules.map((schedule) =>
            getCombinationById(schedule.combinationId, accessToken)
          )
        );

        // combination 데이터를 객체 형태로 변환
        const combinationMap = combinationData.reduce(
          (acc, curr) => {
            // curr이 존재하는지 확인
            if (curr && curr.id) {
              // curr.combination 대신 curr 직접 사용
              acc[curr.id] = curr;
            }
            return acc;
          },
          {} as { [key: number]: any }
        );

        setCombinations(combinationMap);
      } catch (error) {
        console.error("조합 데이터 패칭 실패:", error);
      }
    };

    if (customSchedules.length > 0 && accessToken) {
      fetchCombinationData();
    }
  }, [customSchedules]);

  return (
    <div>
      <div className="relative">
        <div className="flex items-start gap-1">
          <img src={AlarmIcon} alt="알람 이미지" />
          <h2>예약 관리</h2>
        </div>
      </div>
      {customSchedules.length > 0 ? (
        <div className="mt-5 max-h-96 overflow-y-auto">
          {customSchedules.map((schedule) => {
            const selectedDays = getDaysFromBitMask(schedule.day);
            const [startTime, startPeriod] = convertTo12Hour(
              schedule.startTime
            );
            const [endTime, endPeriod] = convertTo12Hour(schedule.endTime);
            const combinationData = combinations[schedule.combinationId];
            const fragrances = combinationData
              ? [
                  mapIntToFragrance(combinationData.choice1),
                  mapIntToFragrance(combinationData.choice2),
                  mapIntToFragrance(combinationData.choice3),
                  mapIntToFragrance(combinationData.choice4),
                ]
                  .filter((scent) => scent)
                  .join(", ")
              : "";
            return (
              <div
                key={schedule.id}
                className="flex flex-col p-3 border-b-0.2 border-lightgray"
              >
                <div className="flex justify-between">
                  <div className="text-16 font-pre-medium">{schedule.name}</div>
                  <div className="flex flex-col justify-between gap-3">
                    <div className="flex justify-between gap-2">
                      <HeartButton />
                      {/* 찜하기 버튼 상태는 Scent탭 눌렀을 때 적용 */}
                      {/* <HeartButton
                      isLiked={heartStatus[reservation]}
                      onToggle={(newState) => {
                        setHeartStatus((prev) => ({
                          ...prev,
                          [reservation]: newState,
                          }));
                          }}
                          /> */}
                      <button
                        onClick={() =>
                          navigate(`/modify-reservation/${schedule}`)
                        }
                      >
                        <img src={ModifyIcon} alt="수정 이미지" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col font-pre-light text-12">
                    <div>{selectedDays.join(", ")}</div>
                    <div>
                      {startTime} {startPeriod} ~ {endTime} {endPeriod}
                    </div>
                    <div>{fragrances}</div>
                  </div>
                  <div className="font-pre-light text-12">
                    <div>{schedule.modeOn ? "On" : "Off"}</div>
                    <button
                      onClick={() => handleDeleteClick(schedule.id)}
                      className="w-[65px] h-[30px] border-0.2 border-lightgray rounded-lg"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
