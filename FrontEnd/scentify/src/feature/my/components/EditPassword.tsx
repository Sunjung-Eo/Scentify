import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditPassword() {
  const [currentPassword, setCurrentPassword] = useState(""); //확인 버튼눌렀을떄 기존 비밀번호 확인
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인 상태
  const [error, setError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false); //저장버튼 누를때도 기존 비밀번호 확인(확인버튼에서 기존 비밀빌번호 일치하지 않음을 띄웠지만 그래도 저장버튼을 누를 경우에 한번 더 걸러줌)

  const navigate = useNavigate();

  // 비밀번호 확인 핸들러
  function handlePasswordCheck() {
    if (!currentPassword) {
      setError("현재 비밀번호를 입력해주세요.");
      setPasswordVerified(false);
      return;
    }
    if (currentPassword !== "123456") {
      // 기존 비밀번호가 "123456"이 아닌 경우
      setError("현재 비밀번호가 일치하지 않습니다.");
      setPasswordVerified(false); //false일 경우, 저장 버튼눌러도 저장이 진행되지 않도록 설정.
    } else {
      setError("비밀번호가 확인되었습니다.");
      setPasswordVerified(true); // 기존 비밀번호 확인 완료
    }
  }

  // 저장 버튼 핸들러
  function handleSave() {
    if (!passwordVerified) {
      // 비밀번호가 확인되지 않은 경우
      setError("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    alert("비밀번호가 성공적으로 변경되었습니다.");
    navigate("/my/manageaccount");
  }
  return (
    <div className="content pt-8 pb-8 h-full flex flex-col justify-between">
      {/* 제목 */}
      <h1 className="text-20 font-pre-bold text-center">비밀번호 변경</h1>

      {/* 입력 필드 */}
      <div className="mt-10 space-y-4">
        {/* 현재 비밀번호 */}
        <div className="flex items-center">
          <label
            className="text-12 font-pre-light mr-5"
            htmlFor="current-password"
          >
            비밀번호
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-[170px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component mr-4"
          />
          <button
            onClick={handlePasswordCheck}
            className="w-[65px] h-[30px] text-12 font-pre-light border-[1px] border-lightgray rounded-lg"
          >
            확인
          </button>
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label className="text-12 font-pre-light mr-1" htmlFor="new-password">
            새 비밀번호
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-[256px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div>
          <label
            className="text-12 font-pre-light mr-1"
            htmlFor="confirm-password"
          >
            새 비밀번호 확인
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-[235px] h-[34px] px-3 text-12 font-pre-light rounded-lg bg-component"
          />
        </div>
      </div>

      {/* 에러 메시지 또는 비밀번호 확인 메시지 */}
      {error && (
        <div className="mt-6 text-center text-12 font-pre-light">
          <p
            className={
              error === "비밀번호가 확인되었습니다."
                ? "text-green-500" // 확인 메시지는 초록색
                : "text-red-500" // 에러 메시지는 빨간색
            }
          >
            {error}
          </p>
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

export default EditPassword;
