// 시간 변환
// 24시간 -> 오전 / 오후
export const convertTo12Hour = (time24: string): [string, "오전" | "오후"] => {
  const [hours, minutes] = time24.split(":");
  let hour = parseInt(hours, 10);
  const period = hour >= 12 ? "오후" : "오전";
  const paddedHour =
    period === "오전" && hour === 0
      ? "00" // 오전 00시 처리
      : (hour % 12 || 12).toString().padStart(2, "0"); // 나머지 시간 처리

  return [`${paddedHour}:${minutes}`, period];
};
// AM/PM -> 24시간
export const convertTo24Hour = (
  hour: number,
  minute: number,
  period: string
) => {
  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
};

// 요일 비트마스크
export const DAYS_BIT = {
  월: 1 << 6, // 64
  화: 1 << 5, // 32
  수: 1 << 4, // 16
  목: 1 << 3, // 8
  금: 1 << 2, // 4
  토: 1 << 1, // 2
  일: 1, // 1
};
