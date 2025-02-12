import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserNickname } from "../../../apis/user/editaccount/editnickname";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUserStore } from "../../../stores/useUserStore"; // 유저 상태 업데이트
import Alert from "../../../components/Alert/AlertMy";

function EditNickname() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const accessToken = authStore.accessToken;
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // 닉네임 변경 핸들러(React.ChangeEvent는 React에서 제공하는 타입으로,폼<input>,<textarea>,<select>변경이벤트 나타냄.)
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
    setError("");
  }

  // 저장 버튼 클릭 핸들러 (API 호출)
  async function handleSave() {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    console.log("닉네임 요청:", nickname);

    const result = await updateUserNickname(nickname, accessToken);

    if (result.success) {
      userStore.setUser({ nickname }); // 유저 상태 업데이트
      setShowAlert(true); // 모달창
    } else {
      setError(result.message || "닉네임 변경에 실패했습니다.");
    }
  }

  return (
    <div className="content pt-4 pb-8 h-full flex flex-col justify-between">
      {/* 제목과 입력 필드를 하나로 묶음 */}
      <div>
        {/* 제목 */}
        <h1 className="text-20 font-pre-bold text-center">닉네임 변경</h1>

        {/* 입력 필드 */}
        <div className="mt-10 ">
          <label className="text-12 font-pre-light mr-7" htmlFor="nickname">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={handleInputChange}
            className="w-[256px] h-[34px] text-12 font-pre-light rounded-lg bg-component px-4 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-12 font-pre-light mt-2">{error}</p>
          )}
        </div>
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

      {/* 닉네임 변경 성공 모달창 */}
      {showAlert && (
        <Alert
          message="닉네임이 변경되었습니다."
          onClose={() => {
            setShowAlert(false);
            navigate("/my/manageaccount"); // 모달 닫으면 계정 관리 페이지로 이동
          }}
        />
      )}
    </div>
  );
}

export default EditNickname;
