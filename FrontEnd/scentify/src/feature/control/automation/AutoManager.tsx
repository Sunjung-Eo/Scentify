import AutoIcon from "../../../assets/icons/auto-icon.svg";

export default function AutoManager() {
  return (
    <div className="flex items-center gap-1">
      <img src={AutoIcon} alt="자동화 이미지" />
      <h1>자동화 모드 설정</h1>
    </div>
  );
}
