import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import greenImg from "../../../assets/userProfiles/green.svg";
import orangeImg from "../../../assets/userProfiles/orange.svg";
import peachImg from "../../../assets/userProfiles/peach.svg";
import purpleImg from "../../../assets/userProfiles/purple.svg";
import redImg from "../../../assets/userProfiles/red.svg";
import yellowgreenImg from "../../../assets/userProfiles/yellowgreen.svg";

function EditProfileImg() {
  const [selectedImage, setSelectedImage] = useState<string>(""); // 선택된 이미지 상태
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const images = [
    { src: greenImg, alt: "Green Profile" },
    { src: orangeImg, alt: "Orange Profile" },
    { src: peachImg, alt: "Peach Profile" },
    { src: purpleImg, alt: "Purple Profile" },
    { src: redImg, alt: "Red Profile" },
    { src: yellowgreenImg, alt: "Yellowgreen Profile" },
  ];

  // 이미지 클릭 핸들러
  const handleImageSelect = (src: string) => {
    setSelectedImage(src); //선택된 이미지 업데이트
    setError(""); // 에러 메시지 초기화
  };

  // 저장 버튼 핸들러
  const handleSave = () => {
    if (selectedImage) {
      alert(`프로필 사진이 변경되었습니다.`);
      navigate("/my/manageaccount");
    } else {
      setError("프로필 사진을 선택해주세요.");
    }
  };

  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      <div>
        {/* 제목 */}
        <h1 className="text-20 font-pre-bold text-center">프로필 사진 변경</h1>

        {/* 이미지 선택 영역 */}
        <div className="grid grid-cols-3 gap-4 mt-10 justify-items-center">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageSelect(image.src)}
              className={`relative w-[80px] h-[80px] cursor-pointer ${
                selectedImage === image.src ? "border-4 border-brand" : "border"
              }`}
            >
              <img src={image.src} alt={image.alt} className="w-full h-full" />
              {selectedImage === image.src && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-full">
                  {/* inset-0: top, right, bottom, left를 모두 0으로 설정해 부모 요소를 완전히 덮음 */}
                  <p className="text-white text-12 font-pre-medium">선택</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-6 text-red-500 text-12 font-pre-light text-center">
            {error}
          </p>
        )}
      </div>

      {/* 저장 버튼 */}
      <div>
        <button
          onClick={handleSave}
          className="w-full h-[48px] rounded-lg text-brand font-pre-bold border-[1px] border-brand"
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default EditProfileImg;
