import { useLocation } from "react-router-dom";
import { Combination } from "./scentmain/scenttypes";
import { getScentName, getColor } from "../../utils/control/scentUtils";
import { useState } from "react";

const ShareFavorite = () => {
  const location = useLocation();
  const { combination, imageUrl, shareUrl } = location.state || {};
  // const [copied, setCopied] = useState(false); // 🔹 공유 링크 복사 상태
  console.log("✅ 이미지 URL:", imageUrl);

  // // 🔹 공유 링크 복사 함수
  // const handleCopyLink = () => {
  //   navigator.clipboard.writeText(shareUrl);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000); // 2초 후 복사 완료 메시지 숨기기
  // };

  //공유 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: combination?.name || "향기 공유",
          text: `이 향기를 공유합니다: ${combination?.name}`,
          url: shareUrl, // 공유할 URL
        });
        console.log("공유 성공");
      } catch (error) {
        console.error("공유 실패:", error);
      }
    } else {
      console.warn("Web Share API가 지원되지 않는 브라우저입니다.");
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };

  // 🔹 이미지 다운로드 기능 (PC/모바일 모두 지원)
  const handleDownloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "downloaded-image.jpg"; // 저장될 파일명
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl); // 메모리 해제

      console.log("이미지 다운로드 성공");
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };

  // 🔹 모바일에서 자동 저장이 어려우므로 새 창에서 열기
  const handleMobileDownload = () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.open(imageUrl, "_blank"); // 모바일에서는 새 창에서 열기
    } else {
      handleDownloadImage();
    }
  };

  return (
    <div className="content">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-lg font-pre-medium text-sub mb-4">
          AI를 기반으로 향과 어울리는 이미지를 생성해줍니다.
        </h1>
        {/* 🔹 카드 컨테이너 */}
        <div className="w-[320px] h-[390px] bg-component p-4 rounded-xl">
          {/* 🔹 생성된 이미지 */}
          <img
            src={imageUrl}
            alt="AI Generated Image"
            className="w-full h-auto rounded-lg"
          />

          {/* 🔹 향기 조합 이름 */}
          <h2 className="text-14 text-center font-pre-medium mt-5">
            {combination?.name || "이름 없는 조합"}
          </h2>

          {/* 🔹 향기 정보 */}
          <div className="text-10 text-sub font-pre-light flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((num) => {
              const scentName = getScentName(
                combination?.[`choice${num}` as keyof Combination]
              );
              const scentCount =
                combination?.[`choice${num}Count` as keyof Combination] || 0;

              if (!scentName || scentCount === 0) return null;

              return (
                <span key={num} className="flex justify-center gap-1">
                  {scentName}
                  {Array.from({ length: scentCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${getColor(scentName)}`}
                    ></div>
                  ))}
                </span>
              );
            })}
          </div>
        </div>
        {/* <div className="mt-4 p-2 bg-component rounded-lg text-sub text-sm w-[300px] break-words text-center">
          공유 링크:{" "}
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand"
          >
            {shareUrl}
          </a>
        </div>
      </div>
    </div>
  );
}; */}
        {/* 🔹 공유 링크 복사 버튼 */}
        {/* <button
          onClick={handleCopyLink}
          className="mt-4 px-4 py-2 bg-brand text-white rounded-lg"
        >
          {copied ? "링크 복사 완료!" : "공유 링크 복사"}
        </button> */}

        {/* 🔹 버튼 그룹 */}
        <div className="flex gap-4 mt-4">
          {/* 🔹 공유 버튼 */}
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-brand text-white rounded-lg"
          >
            공유
          </button>

          {/* 🔹 이미지 저장 버튼 */}
          <button
            onClick={handleMobileDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            이미지 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareFavorite;
