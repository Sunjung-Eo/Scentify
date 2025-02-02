import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditUserinfo() {
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 저장 버튼 클릭 핸들러
  function handleSave() {
    if (!birthYear || !birthMonth || !birthDay || !gender) {
      // 하나라도 입력되지 않은 경우
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 모든 필드가 입력된 경우
    setError(""); // 에러 메시지 초기화
    alert(
      `생년월일: ${birthYear}-${birthMonth}-${birthDay}, 성별: ${gender}으로 변경됩니다.`
    );
    navigate("/my/manageaccount"); // 페이지 이동
  }

  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      {/* 제목 */}
      <h1 className="text-20 font-pre-bold text-center">회원정보 변경</h1>

      {/* 입력 필드 */}
      <div className="mt-10">
        {/* 생년월일 입력 */}
        <div className="mb-4 flex items-center">
          <label className="text-12 font-pre-light mr-4" htmlFor="birth">
            생년월일
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="년(4자)"
              maxLength={4}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-[82px] h-[30px] px-3 text-12 font-pre-light rounded-lg border-[1px] border-lightgray placeholder-black"
            />
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="w-[82px] h-[30px] px-3 text-12 font-pre-light rounded-lg border-[1px] border-lightgray"
            >
              <option value="">월</option> {/*option의 기본 선택값은 빈 값 */}
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="일"
              maxLength={2}
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="w-[82px] h-[30px] px-3 text-12 font-pre-light rounded-lg border-[1px] border-lightgray placeholder-black"
            />
          </div>
        </div>

        {/* 성별 선택 */}
        <div className="flex items-center">
          <label className="text-12 font-pre-light mr-8">성별</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("여성")}
              className={`w-[50px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === "여성"
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              여성
            </button>
            <button
              onClick={() => setGender("남성")}
              className={`w-[50px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === "남성"
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("선택하지 않음")}
              className={`w-[90px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === "선택하지 않음"
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              선택하지 않음
            </button>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-6 text-red-500 text-12 font-pre-light text-center">
          {error}
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="mt-auto">
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

export default EditUserinfo;
