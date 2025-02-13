import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "../../../stores/useAuthStore";
import { useFavoriteStore } from "../../../stores/useFavoriteStore";

import { deleteCustomSchedule } from "../../../apis/control/deleteCustomSchedule";
import { getCombinationById } from "../../../apis/control/getCombinationById";
import { getAllFavorite } from "../../../apis/scent/getAllFavorite";
import { createFavorite } from "../../../apis/scent/createFavorite";
import { deleteAllFavorite } from "../../../apis/scent/deleteFavorite";

import Modal from "../../../components/Alert/Modal";
import { mapIntToFragrance } from "../../../utils/fragranceUtils";
import { DAYS_BIT, convertTo12Hour } from "../../../utils/control/timeUtils";
import { ReservationManagerProps } from "./ReservationType";

import ModifyIcon from "../../../assets/icons/modify-icon.svg";
import HeartButton from "../../../components/Button/HeartButton";

export default function ReservationManager({
  reservationData,
  selectedDevice,
}: ReservationManagerProps) {
  const navigate = useNavigate();

  // 마운트 시 동기화
  const queryClient = useQueryClient();
  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
  // }, []);

  // 인증토큰
  const authStore = useAuthStore();
  const accessToken = authStore.accessToken;

  const customSchedules = reservationData?.customSchedules || []; // 기기 한개의 예약 데이터 저장
  const [combinations, setCombinations] = useState<{ [key: number]: any }>({}); // 해당 예약의 조합 데이터 저장

  // 삭제 모달
  const [reservationDelete, setReservationDelete] = useState<number | null>(
    null
  );
  const deleteMutation = useMutation({
    mutationFn: (scheduleId: number) => {
      if (selectedDevice === null) {
        throw new Error("선택된 기기가 없습니다.");
      }
      return deleteCustomSchedule(scheduleId, selectedDevice, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setModalOpen(false);
      setReservationDelete(null);
    },
    onError: (error) => {
      console.error("예약 삭제 실패:", error);
    },
  });
  // 삭제 버튼 핸들러
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지
  const handleDeleteClick = (scheduleId: number) => {
    setReservationDelete(scheduleId);
    setModalMessage("예약을 삭제하시겠습니까?");
    setModalOpen(true);
  };
  // 삭제 모달창
  const handleDeleteConfirm = () => {
    if (reservationDelete && selectedDevice !== null) {
      deleteMutation.mutate(reservationDelete);
    }
  };
  const handleDeleteCancel = () => {
    setModalOpen(false);
    setReservationDelete(null);
  };

  // 요일 비트마스크 변환
  const getDaysFromBitMask = (bitmask: number): string[] => {
    return Object.entries(DAYS_BIT)
      .filter(([_, bit]) => (bitmask & bit) > 0)
      .map(([day]) => day);
  };

  // 해당 예약의 향 정보 가져오기
  useEffect(() => {
    const fetchCombinationData = async () => {
      try {
        const combinationData = await Promise.all(
          customSchedules.map((schedule) =>
            getCombinationById(schedule.combinationId, accessToken)
          )
        );
        const combinationMap = combinationData.reduce(
          (acc, curr, index) => {
            const combinationId = customSchedules[index].combinationId;
            if (curr) {
              acc[combinationId] = curr;
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

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ["favoritesData"],
    queryFn: () => getAllFavorite(accessToken),
    staleTime: 0,
    refetchOnMount: "always",
    initialData: { favorites: [] },
  });

  console.log("제발되라", favoritesData);
  // 찜 id 리스트
  const { setFavorites } = useFavoriteStore();

  // DB 찜 리스트
  const favorites =
    favoritesData?.favorites
      ?.filter((item) => item?.combination) // undefined 항목 제거
      ?.map((item) => item.combination.id) || [];
  // const favorites = useFavoriteStore((state) => state.favorites);
  // 현재 찜 리스트
  const [currentFavorites, setCurrentFavorites] = useState<number[]>([
    ...favorites,
  ]);
  useEffect(() => {
    if (favorites.length > 0 && currentFavorites.length === 0) {
      setCurrentFavorites(favorites);
    }
  }, [favorites, currentFavorites]);

  console.log("DB저장", favorites);
  const currentFavoritesRef = useRef(currentFavorites);
  useEffect(() => {
    currentFavoritesRef.current = currentFavorites;
  }, [currentFavorites]);
  useEffect(() => {
    console.log("current", currentFavorites);
  }, [favorites, currentFavorites]);

  // 현재 찜 추가 핸들러
  const addCurrentFavorites = (id: number) => {
    setCurrentFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  // 현재 찜 제거 핸들러
  const removeCurrentFavorites = (id: number) => {
    setCurrentFavorites((prev) => prev.filter((fId) => fId !== id));
  };

  // 찜 추가 mutation
  const createFavoriteMutation = useMutation({
    mutationFn: (ids: number[]) =>
      createFavorite({ combinationIds: ids }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
    },
  });
  // 찜 삭제 mutation
  const deleteFavoriteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteAllFavorite(ids, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoritesData"] });
    },
  });

  useEffect(() => {
    // 컴포넌트 언마운트 시 실행 (탭 이동 시)
    return () => {
      const newAddFavorites = currentFavoritesRef.current.filter(
        (fav) => !favorites.includes(fav)
      );
      const newDeleteFavorites = favorites.filter(
        (fav) => !currentFavoritesRef.current.includes(fav)
      );

      try {
        if (newAddFavorites.length > 0) {
          createFavoriteMutation.mutate(newAddFavorites);
        }
        if (newDeleteFavorites.length > 0) {
          deleteFavoriteMutation.mutate(newDeleteFavorites);
        }

        setFavorites([...currentFavoritesRef.current]);

        queryClient.setQueryData(["favoritesData"], (old: any) => ({
          ...old,
          favorites: currentFavoritesRef.current,
        }));
      } catch (error) {
        console.error("Favorite 업데이트 실패:", error);
      }
    };
  }, []);

  return (
    <div>
      {customSchedules.length > 0 ? (
        <div className="mt-3 pb-3 max-h-[350px] overflow-y-auto">
          {customSchedules.map((schedule) => {
            const selectedDays = getDaysFromBitMask(schedule.day);
            const [startTime, startPeriod] = convertTo12Hour(
              schedule.startTime
            );
            const [endTime, endPeriod] = convertTo12Hour(schedule.endTime);
            const combinationData = combinations[schedule.combinationId];
            const fragrances = combinationData
              ? [
                  {
                    choice: combinationData.choice1,
                    count: combinationData.choice1Count,
                  },
                  {
                    choice: combinationData.choice2,
                    count: combinationData.choice2Count,
                  },
                  {
                    choice: combinationData.choice3,
                    count: combinationData.choice3Count,
                  },
                  {
                    choice: combinationData.choice4,
                    count: combinationData.choice4Count,
                  },
                ]
                  .filter(({ count }) => count > 0)
                  .map(({ choice }) => mapIntToFragrance(choice))
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
                      <HeartButton
                        isLiked={
                          (currentFavorites?.length > 0
                            ? currentFavorites
                            : favoritesData?.favorites
                          )?.includes(schedule.combinationId) ?? false
                        }
                        onToggle={(newState) => {
                          if (newState) {
                            addCurrentFavorites(schedule.combinationId);
                          } else {
                            removeCurrentFavorites(schedule.combinationId);
                          }
                        }}
                      />
                      <button
                        onClick={() =>
                          navigate("/control/reservation/modify", {
                            state: { schedule },
                          })
                        }
                      >
                        <img src={ModifyIcon} alt="수정 이미지" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col font-pre-light text-12">
                    <div className="mt-3">
                      <div>{selectedDays.join(", ")}</div>
                      <div>
                        {startPeriod} {startTime} ~ {endPeriod} {endTime}
                      </div>
                    </div>
                    <div className="mt-2">{fragrances}</div>
                  </div>
                  <div className="font-pre-light text-12">
                    <div className="mt-4 text-16 text-right">
                      {schedule.modeOn ? "On" : "Off"}
                    </div>
                    <button
                      onClick={() => handleDeleteClick(schedule.id)}
                      className="w-[65px] h-[30px] mt-2 border-0.2 border-lightgray rounded-lg"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {modalOpen && (
            <Modal
              message={modalMessage}
              showButtons={true}
              confirmText="확인"
              cancelText="취소"
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
