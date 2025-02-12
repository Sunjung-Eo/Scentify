import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserImg } from "../../../apis/user/editaccount/editprofileimg";
import { useAuthStore } from "../../../stores/useAuthStore"; // 인증 상태 (accessToken)
import { useUserStore } from "../../../stores/useUserStore"; // Zustand로 유저 상태 업데이트
import { getProfileImage } from "../../../utils/profileImageMapper"; //프로필 사진매핑함수
import Alert from "../../../components/Alert/AlertMy";

function EditProfileImg() {
  // Zustand에서 사용자 정보 가져오기 (현재 프로필 이미지 번호 포함)
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const navigate = useNavigate();

  // 로그인된 사용자의 인증 토큰
  const accessToken = authStore.accessToken;

  // 현재 선택된 프로필 이미지 번호(초기값은 기존에 저장된 사용자 프로필 이미지 번호(userStore.imgNum)로 설정)
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

  /**
   * 저장 버튼 클릭 시 실행되는 함수
   * 선택된 프로필 이미지 번호를 서버에 전송하여 변경
   * API 호출이 성공하면, useUserStore에 저장된 imgNum 값을 업데이트하여 앱 전반에 반영.
   */
  const handleSave = async () => {
    if (selectedImage === null) {
      setError("프로필 이미지를 선택해주세요."); // 이미지 선택되지 않은 경우 에러 메시지 표시
      return;
    }

    console.log("선택된 이미지 번호:", selectedImage); // 선택된 이미지 번호 콘솔 출력

    const result = await updateUserImg(selectedImage, accessToken); // API 호출하여 서버에 데이터 전송

    if (result.success) {
      userStore.setUser({ imgNum: selectedImage }); // Zustand 상태 업데이트 (프로필 이미지 번호 변경)
      setShowAlert(true); // 모달창
    } else {
      setError(result.message || "프로필 이미지 변경에 실패했습니다.");
    }
  };

  return (
    <div className="content pt-4 pb-8 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-20 font-pre-bold text-center">
          프로필 이미지 변경
        </h1>

        {/* 이미지 선택 영역 */}
        <div className="grid grid-cols-3 gap-4 mt-10 justify-items-center">
          {/* 6개의 프로필 이미지 선택 */}
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
              {/* 선택된 이미지에 오버레이 표시 */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
                  <p className="text-white text-12 font-pre-medium">선택</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 에러 메시지 출력 */}
        {error && (
          <p className="mt-6 text-red-500 text-12 font-pre-light">{error}</p>
        )}
      </div>

      {/* 저장 버튼 */}
      <div>
        <button
          onClick={handleSave} // 저장 버튼 클릭 시 API 호출
          className="w-full h-[48px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          저장
        </button>
      </div>

      {showAlert && (
        <Alert
          message="프로필 이미지가 변경되었습니다."
          onClose={() => {
            setShowAlert(false);
            navigate("/my/manageaccount"); // 모달 닫으면 계정 관리 페이지로 이동
          }}
        />
      )}
    </div>
  );
}

export default EditProfileImg;
