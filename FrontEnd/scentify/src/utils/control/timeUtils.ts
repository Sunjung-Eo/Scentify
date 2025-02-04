// 시간 변환
// 24시간 -> AM/PM
export const convertTo12Hour = (time24: string): [string, "AM" | "PM"] => {
  const [hours, minutes] = time24.split(":");
  let hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // 0시 → 12AM, 12시 → 12PM 처리

  return [`${hour}:${minutes}`, period];
};
// AM/PM -> 24시간
export const convertTo24Hour = (hour, minute, period) => {
  let hours = parseInt(hour);
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minute}:00`;
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
