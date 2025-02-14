import { useLocation } from "react-router-dom";
import { Combination } from "./scentmain/scenttypes";
import { getScentName, getColor } from "../../utils/control/scentUtils";
import { useEffect, useState } from "react";
import { shareFavoriteCombination } from "../../apis/scent/shareFavoriteCombination";
import { useAuthStore } from "../../stores/useAuthStore";
import Spinner from "../Home/Loading/Spinner";

const ShareFavorite = () => {
  // 🔹 이전 페이지에서 전달된 데이터 가져오기
  const location = useLocation();
  const { combination } = location.state || {}; // `FavoriteScent.tsx`에서 전달된 조합 정보
  const { accessToken } = useAuthStore();
  // 🔹 상태 변수 정의
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 생성된 이미지 URL 저장
  const [shareUrl, setShareUrl] = useState<string | null>(null); // 공유 링크 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 (초기값: true)

  //공유 링크복사 사용 시
  const [copied, setCopied] = useState(false); // 공유 링크 복사 상태

  // 🔹 API 호출하여 imageUrl, shareUrl 가져오기
  // 일반적인 상황에서는 페이지 최초 진입 시 한 번만 실행됨.
  // 새로고침하거나 다른 공유 페이지에서 다시 들어오면 다시 실행됨. 뒤로가기 금지?
  useEffect(() => {
    let isMounted = true; // ✅ 컴포넌트가 마운트되어 있는지 체크

    const fetchImage = async () => {
      try {
        console.log(
          `🔹 공유 요청 시작 - 조합 ID: ${combination.id}, AccessToken: ${accessToken}`
        );

        const response = await shareFavoriteCombination(
          combination.id,
          accessToken
        );
        console.log("🔹 API 응답:", response);

        if (response && response.combination && isMounted) {
          setImageUrl(response.s3Url ?? null);
          setShareUrl(response.shareUrl ?? null);
        }
      } catch (error) {
        console.error("공유 요청 실패:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false; // ✅ 컴포넌트가 언마운트되면 API 실행 방지
    };
  }, [combination, accessToken]);

  // // 🔹 공유 기능 (Web Share API 활용)
  // const handleShare = async () => {
  //   if (navigator.share && shareUrl) {
  //     try {
  //       await navigator.share({
  //         title: combination?.name || "향기 공유",
  //         text: `이 향기를 공유합니다: ${combination?.name}`,
  //         url: shareUrl,
  //       });
  //       console.log("공유 성공");
  //     } catch (error) {
  //       console.error("공유 실패:", error);
  //     }
  //   } else {
  //     alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
  //   }
  // };

  // 🔹 공유 링크 복사 함수 (버튼 클릭 시 실행)
  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2초 후 복사 완료 메시지 숨기기
  };

  // 🔹 이미지 다운로드 기능 (PC/모바일 지원)
  const handleDownloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      // 🔹 Blob을 가리키는 URL 생성
      const blobUrl = URL.createObjectURL(blob);
      // 🔹 <a> 태그 생성하여 다운로드 기능 구현
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "downloaded-image.jpg"; // 다운로드될 파일 이름 설정
      // 🔹 <a> 태그 클릭하여 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 🔹 생성한 URL 해제하여 메모리 누수 방지
      URL.revokeObjectURL(blobUrl); // 메모리 해제
      console.log("이미지 다운로드 성공");
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
    }
  };

  // 🔹 모바일에서 자동 저장이 어려우므로 새 창에서 열기
  const handleMobileDownload = () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.open(imageUrl!, "_blank"); // 모바일에서는 새 창에서 이미지 열기
    } else {
      handleDownloadImage(); // PC에서는 이미지 다운로드 실행
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-12 font-pre-light text-sub mb-4">
          AI를 기반으로 향과 어울리는 이미지 파일을 생성해줍니다.
        </h1>

        {/* 🔹 로딩 중이면 로딩 UI 표시 */}
        {loading ? (
          <div className="w-[280px] h-[400px] bg-component p-4 rounded-xl flex flex-col items-center justify-center">
            {/* 🔹 회전 애니메이션 (로딩 표시) */}
            <Spinner />
            <p className="text-14 font-pre-light mt-16">
              이미지를 생성 중입니다.
            </p>
            <p className="text-12 font-pre-light text-sub mt-12 text-center">
              AI 이미지가 생성되는 데 30초정도 소요됩니다.
              <br />
              잠시 기다려 주세요.
            </p>
          </div>
        ) : (
          // 🔹 이미지가 로딩 완료되면 정상적으로 표시
          <div className="w-[280px] h-[400px] bg-component pt-2 p-4 rounded-xl">
            <p className="text-center font-pre-medium text-12 text-brand ">
              Scentify
            </p>
            <img
              src={imageUrl!}
              alt="AI Generated Image"
              className="w-full h-auto rounded-lg pt-1"
            />
            <h2 className="text-14 text-center font-pre-medium mt-8">
              {combination?.name || "이름 없는 조합"}
            </h2>

            {/* 🔹 향기 정보 */}
            <div className="text-10 text-sub font-pre-light flex justify-center gap-2 mt-6">
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
        )}

        {/* 🔹 버튼 그룹 (로딩 중에는 비활성화) */}
        {/* <div className="flex gap-4 mt-4">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-brand text-white rounded-lg"
            disabled={loading}
          >
            공유
          </button> */}
        <p className="text-10 font-pre-light text-brand mt-12">
          공유 링크와 이미지 저장 모두 10분간 유효합니다.
        </p>
        <div className="flex gap-4 mt-1">
          <button
            onClick={handleCopyLink} // 🔹 즉시 공유 링크 복사
            className="border-[1px] border-brand w-[150px] h-[40px] text-brand text-16 font-pre-medium rounded-lg"
            disabled={loading}
          >
            {copied ? "링크 복사 완료" : "공유 링크"}
          </button>

          <button
            onClick={handleMobileDownload}
            className="border-[1px] border-brand w-[150px] h-[40px] text-brand text-16 font-pre-medium rounded-lg"
            disabled={loading}
          >
            이미지 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareFavorite;
