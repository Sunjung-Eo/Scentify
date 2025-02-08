import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../../apis/user/editaccount/getUserInfo";
import { updateUserInfo } from "../../../apis/user/editaccount/updateUserInfo";
import { useAuthStore } from "../../../stores/useAuthStore"; // 인증 상태 (accessToken)

function EditUserinfo() {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const accessToken = authStore.accessToken;

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState<number | null>(null);
  const [error, setError] = useState("");

  // 생년월일 포맷팅 함수 (YYYY-MM-DD → ["YYYY", "MM", "DD"])
  const formatBirthdate = (birth: string) => {
    const [year, month, day] = birth.split("-");
    setBirthYear(year);
    setBirthMonth(String(parseInt(month, 10))); // 월을 숫자로 변환 후 문자열로 저장
    setBirthDay(day);
  };
  // 회원 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const result = await getUserInfo(accessToken);
      if (result.success && result.birth && result.gender !== undefined) {
        formatBirthdate(result.birth);
        setGender(result.gender);
      } else {
        setError(result.message || "회원 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserInfo();
  }, [accessToken]);

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!birthYear || !birthMonth || !birthDay || gender === null) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    const birthDate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

    const result = await updateUserInfo(
      { gender, birth: birthDate },
      accessToken
    );

    if (result.success) {
      alert("회원 정보가 변경되었습니다.");
      navigate("/my/manageaccount");
    } else {
      setError(result.message || "회원 정보 변경에 실패했습니다.");
    }
  };

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
              onClick={() => setGender(0)}
              className={`w-[50px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === 0
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              여성
            </button>
            <button
              onClick={() => setGender(1)}
              className={`w-[50px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === 1
                  ? "bg-brand text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender(2)}
              className={`w-[90px] h-[30px] rounded-lg border-[1px] border-lightgray text-12 font-pre-light ${
                gender === 2
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
