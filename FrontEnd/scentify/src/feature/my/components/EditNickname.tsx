import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditNickname() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 닉네임 변경 핸들러(React.ChangeEvent는 React에서 제공하는 타입으로,폼<input>,<textarea>,<select>변경이벤트 나타냄.)
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
    setError("");
  }

  // 저장 버튼 클릭 핸들러
  function handleSave() {
    if (!nickname.trim()) {
      // 닉네임이 비어 있거나 공백만 입력된 경우
      setError("닉네임을 입력해주세요.");
      return;
    }
    alert(`닉네임이 "${nickname}"으로 변경되었습니다.`);
    navigate("/my/manageaccount");
  }

  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      {/* 제목과 입력 필드를 하나로 묶음 */}
      <div>
        {/* 제목 */}
        <h1 className="text-20 font-pre-bold text-center">닉네임 변경</h1>

        {/* 입력 필드 */}
        <div className="mt-10 text-center">
          <label className="text-12 font-pre-light mr-7" htmlFor="nickname">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={handleInputChange}
            className="w-[256px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
          />
          {/* 에러 메시지 */}
          {error && (
            <p className="mt-6 text-red-500 text-12 font-pre-light">{error}</p>
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
    </div>
  );
}

export default EditNickname;
