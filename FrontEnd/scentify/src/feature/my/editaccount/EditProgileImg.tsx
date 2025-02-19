import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserImg } from "../../../apis/user/editaccount/editprofileimg";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUserStore } from "../../../stores/useUserStore";
import { getProfileImage } from "../../../utils/profileImageMapper";

function EditProfileImg() {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const accessToken = authStore.accessToken;
  // 현재 선택된 프로필 이미지 번호(초기값: 기존에 저장된\userStore.imgNum설정)
  const [selectedImage, setSelectedImage] = useState<number | null>(
    userStore.imgNum
  );
  const [error, setError] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 프로필 이미지 선택 시 실행되는 함수
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
    setError("");
  };

  // API 호출 성공시, useUserStore에 저장된 imgNum 값 업데이트
  const handleSave = async () => {
    if (selectedImage === null) {
      setError("프로필 이미지를 선택해주세요.");
      return;
    }
    const result = await updateUserImg(selectedImage, accessToken);

    if (result.success) {
      userStore.setUser({ imgNum: selectedImage }); // Zustand 상태 업데이트 (프로필 이미지 번호 변경)
      navigate("/my/manageaccount");
    } else {
      setError(result.message || "프로필 이미지 변경에 실패했습니다.");
    }
  };

  return (
    <div className="pt-4 pb-5 h-full w-full flex flex-col justify-between">
      <div>
        <h1 className="text-20 font-pre-bold text-center">
          프로필 이미지 변경
        </h1>

        {/* 이미지 선택 영역 */}
        <div className="grid grid-cols-3 gap-4 mt-10 justify-items-center">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`relative w-[80px] h-[80px] cursor-pointer ${
                selectedImage === index ? "border-4 border-brand" : "border"
              }`}
            >
              {/* 이미지 표시 (getProfileImage 함수 활용) */}
              <img
                src={getProfileImage(index)}
                alt={`Profile ${index}`}
                className="w-full h-full"
              />
              {/* 선택된 이미지 오버레이 표시 */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
                  <p className="text-white text-12 font-pre-medium">선택</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-6 text-red-500 text-12 font-pre-light">{error}</p>
        )}
      </div>

      {/* 저장 버튼 */}
      <div>
        <button
          onClick={handleSave}
          className="w-full h-[48px] rounded-lg text-brand text-16 font-pre-medium border-[1px] border-brand active:text-bg active:bg-brand active:border-0"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default EditProfileImg;
