import { useLocation, useNavigate } from 'react-router-dom';
import { Combination } from './scentmain/scenttypes';
import { getScentName, getColor } from '../../utils/control/scentUtils';
import { useEffect, useState } from 'react';
import { shareFavoriteCombination } from '../../apis/scent/shareFavoriteCombination';
import { useAuthStore } from '../../stores/useAuthStore';
import Spinner from '../../components/Loading/Spinner';
import BackIcon from '../../assets/icons/back-arrow-btn.svg';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import scentifylogo from '../../assets/icons/scentify-green-logo.svg';

const ShareFavorite = () => {
  const cardRef = useRef<HTMLDivElement>(null); // 📌 캡처할 카드 영역 참조

  // 🔹 이전 페이지에서 전달된 데이터 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const { combination } = location.state || {}; // `FavoriteScent.tsx`에서 전달된 조합 정보
  const { accessToken } = useAuthStore();
  // 🔹 상태 변수 정의
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 생성된 이미지 URL 저장
  const [shareUrl, setShareUrl] = useState<string | null>(null); // 공유 링크 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 (초기값: true)

  //공유 링크복사 사용 시
  const [copied, setCopied] = useState(false); // 공유 링크 복사 상태
  const [isMounted, setIsMounted] = useState(true);
  const hasFetched = useRef(false); // API 중복 방지

  // 🔹 API 호출하여 imageUrl, shareUrl 가져오기
  useEffect(() => {
    if (hasFetched.current) return; // ✅ 이미 요청했으면 실행 안 함
    hasFetched.current = true; // ✅ 첫 실행 이후 다시 실행 방지

    setIsMounted(true); // ✅ 마운트 여부 상태 true 설정

    const fetchImage = async () => {
      try {
        console.log(
          `🔹 공유 요청 시작 - 조합 ID: ${combination.id}, AccessToken: ${accessToken}`
        );

        const response = await shareFavoriteCombination(
          combination.id,
          accessToken
        );
        console.log('🔹 API 응답:', response);

        if (response && response.combination && isMounted) {
          setImageUrl(response.s3Url ?? null);
          setShareUrl(response.shareUrl ?? null);
        }
      } catch (error) {
        console.error('공유 요청 실패:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      setIsMounted(false); // ✅ 언마운트 시 false로 설정
    };
  }, [combination, accessToken]);

  // 🔹 공유 링크 복사 함수 (버튼 클릭 시 실행)
  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2초 후 복사 완료 메시지 숨기기
  };

  // 🔹 카드 영역을 캡처하여 이미지 다운로드
  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // 📌 배경을 투명하게 유지
        scale: 3, // 📌 해상도를 높이기 위해 3배 확대
        useCORS: true, // 📌 외부 이미지를 캡처할 수 있도록 설정
        logging: false,
        allowTaint: true,
        onclone: (document) => {
          return document.fonts.ready;
        },
      });

      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = 'scent-card.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('카드 이미지 다운로드 성공');
    } catch (error) {
      console.error('카드 이미지 다운로드 실패:', error);
    }
  };

  // 🔹 뒤로 가기 버튼 클릭 시 '/scent' 페이지로 이동
  const handleGoBack = () => {
    navigate('/scent');
  };

  return (
    <div className="mt-4">
      {/* 🔹 뒤로 가기 버튼 (로딩 중에는 숨김) */}
      {!loading && (
        <img
          src={BackIcon}
          alt="뒤로 가기"
          onClick={handleGoBack}
          className="absolute top-4 left-4 w-6 h-6 cursor-pointer"
        />
      )}
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
          <div
            ref={cardRef}
            className="w-[280px] h-[400px] bg-component p-4 rounded-xl"
          >
            <img
              src={scentifylogo}
              alt="Scentify"
              className="mx-auto max-w-7 h-auto mb-2"
            />
            <img
              src={imageUrl!}
              alt="AI Generated Image"
              className="w-full h-auto rounded-lg"
              crossOrigin="anonymous"
            />
            <h2 className="text-14 text-center font-pre-medium mt-6">
              {combination?.name || '이름 없는 조합'}
            </h2>

            {/* 🔹 향기 정보 */}
            <div className="text-10 text-sub font-pre-light flex justify-center gap-1 mt-6 flex-wrap-nowrap">
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
                    <div className="flex gap-1">
                      {Array.from({ length: scentCount }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${getColor(scentName)}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔹 버튼 그룹 (로딩 중에는 비활성화) */}
        <p className="text-10 font-pre-light text-brand mt-12">
          이미지 저장은 10분간 유효합니다.
        </p>
        <div className="flex gap-4 mt-1">
          <button
            onClick={handleCopyLink} // 🔹 즉시 공유 링크 복사
            className="border-[1px] border-brand w-[150px] h-[40px] text-brand text-16 font-pre-medium rounded-lg"
            disabled={loading}
          >
            {copied ? '링크 복사 완료' : '공유 링크'}
          </button>

          <button
            onClick={handleDownloadCardImage} // 🔹 카드 캡처 & 다운로드 버튼으로 변경
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
