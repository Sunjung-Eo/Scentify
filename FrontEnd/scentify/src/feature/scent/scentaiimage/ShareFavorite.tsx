import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../stores/useAuthStore";

import { shareFavoriteCombination } from "../../../apis/scent/shareFavoriteCombination";

import Spinner from "../../../components/Loading/Spinner";
import { getScentName, getColor } from "../../../utils/control/scentUtils";
import { Combination } from "../scentmain/scenttypes";

import html2canvas from "html2canvas";
import BackIcon from "../../../assets/icons/back-arrow-btn.svg";

const ShareFavorite = () => {
  const cardRef = useRef<HTMLDivElement>(null); // 캡처할 카드 영역 참조

  const navigate = useNavigate();
  const location = useLocation(); // FavoriteScent에서 전달된 데이터 가져오기
  const { combination } = location.state || {};
  const { accessToken } = useAuthStore();
  // 상태 변수 정의
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 생성된 이미지 URL 저장
  const [shareUrl, setShareUrl] = useState<string | null>(null); // 공유 링크 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 (초기값: true)

  //공유 링크복사 사용 시
  const [copied, setCopied] = useState(false); // 공유 링크 복사 상태
  const [isMounted, setIsMounted] = useState(true);
  const hasFetched = useRef(false); // API 중복 방지

  //API 호출하여 imageUrl, shareUrl 가져오기
  useEffect(() => {
    if (hasFetched.current) return; // 이미 요청했으면 실행 안 함
    hasFetched.current = true;

    setIsMounted(true); // 마운트 여부 상태 true 설정

    const fetchImage = async () => {
      try {
        const response = await shareFavoriteCombination(
          combination.id,
          accessToken
        );

        if (response && response.combination && isMounted) {
          setImageUrl(response.s3Url ?? null);
          setShareUrl(response.shareUrl ?? null);
        }
      } catch (error) {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      setIsMounted(false); // 언마운트 시 false로 설정
    };
  }, [combination, accessToken]);

  // 공유 링크 복사 함수
  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  // 카드 영역을 캡처하여 이미지 다운로드
  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // 해상도 위해 3배 확대
        useCORS: true, // 외부 이미지를 캡처할 수 있도록 설정
        logging: false,
        allowTaint: true,
        onclone: (document) => {
          return document.fonts.ready;
        },
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "scent-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {}
  };

  const handleGoBack = () => {
    navigate("/scent");
  };

  return (
    <div className="mt-4">
      {!loading && (
        <img
          src={BackIcon}
          alt="뒤로 가기"
          onClick={handleGoBack}
          className="absolute top-4 left-4 w-6 h-6"
        />
      )}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-12 font-pre-light text-brand mb-4">
          AI를 기반으로 향과 어울리는 이미지 파일을 생성해줍니다.
        </h1>

        {/* 로딩 중이면 로딩 UI 표시 */}
        {loading ? (
          <div className="w-[280px] h-[400px] bg-component p-4 rounded-xl flex flex-col items-center justify-center">
            <Spinner />
            <p className="text-12 font-pre-light mt-16">
              이미지를 생성 중입니다.
            </p>
            <p className="text-12 font-pre-light text-lightgray mt-12 text-center">
              이미지가 생성되기 까지
              <br />
              다소 시간이 소요될 수 있습니다.
              <br />
              잠시 기다려 주세요.
            </p>
          </div>
        ) : (
          // 로딩 완료되면 이미지 정상적으로 표시
          <div
            ref={cardRef}
            className="w-[280px] h-[400px] bg-component p-4 rounded-xl"
          >
            <h2 className="text-12 text-gray text-center font-poppins-thin mb-2">
              Scentify
            </h2>
            <img
              src={imageUrl!}
              alt="AI Generated Image"
              className="w-full h-auto rounded-lg"
              crossOrigin="anonymous"
            />
            <h2 className="text-14 text-center font-pre-medium mt-4">
              {combination?.name || "이름 없는 조합"}
            </h2>

            {/* 향기 정보 */}
            <div className="text-10 text-sub font-pre-light flex justify-center gap-1 mt-4 flex-wrap-nowrap">
              {[1, 2, 3, 4].map((num) => {
                const scentName = getScentName(
                  combination?.[`choice${num}` as keyof Combination]
                );
                const scentCount =
                  combination?.[`choice${num}Count` as keyof Combination] || 0;

                if (!scentName || scentCount === 0) return null;
                return (
                  <div
                    key={num}
                    className="flex flex-col mr-1 items-center gap-2 min-w-fit"
                  >
                    {scentName}
                    <div className="flex gap-1 -space-x-[8px]">
                      {Array.from({ length: scentCount }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-[14px] h-[6px] ml-[2px] rounded-full ${getColor(scentName)}`}
                          style={{ transform: "rotate(-65deg)" }}
                        ></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 버튼 그룹 (로딩 중에는 비활성화) */}
        <p className="text-10 font-pre-light text-brand mb-4">
          이미지 저장은 10분간 유효합니다.
        </p>
        <div className="flex gap-4 absolute bottom-[50px]">
          <button
            onClick={handleCopyLink} // 즉시 공유 링크 복사
            className={`border-[1px] border-brand w-[150px] h-[48px] text-16 text-brand font-pre-medium rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "active:text-bg active:bg-brand active:border-0"}`}
            disabled={loading}
          >
            {copied ? "링크 복사 완료" : "공유 링크"}
          </button>

          <button
            onClick={handleDownloadCardImage} // 카드 캡처 & 다운로드 버튼으로 변경
            className={`border-[1px] border-brand w-[150px] h-[48px] text-16 text-brand font-pre-medium rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "active:text-bg active:bg-brand active:border-0"}`}
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
