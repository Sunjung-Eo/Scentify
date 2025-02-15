import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { readShareFavorite } from "../../apis/scent/readShareFavorite"; // API 호출 함수 가져오기
import { Combination } from "../../feature/scent/scentmain/scenttypes";
import { getScentName, getColor } from "../../utils/control/scentUtils";
import Spinner from "../Home/Loading/Spinner";
import html2canvas from "html2canvas";
import scentifylogo from "../../assets/icons/scentify-green-logo.svg";
import Header from "../../layout/Header";
import { useNavigate } from "react-router-dom";

const ReadShareFavorite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null); // 📌 캡처할 카드 영역

  // 🔹 URL에서 combinationId와 imageName 추출
  const queryParams = new URLSearchParams(location.search);
  const combinationId = queryParams.get("combinationId");
  const imageName = queryParams.get("imageName");

  // 🔹 상태 변수
  const [combination, setCombination] = useState<Combination | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 API 호출
  useEffect(() => {
    if (!combinationId || !imageName) {
      console.error("❌ 잘못된 URL입니다.");
      setLoading(false);
      return;
    }

    const numericCombinationId = parseInt(combinationId, 10); // 🔹 string → number 변환
    const decodedImageName = decodeURIComponent(imageName); // 🔹 URL 인코딩 해제

    const fetchData = async () => {
      const data = await readShareFavorite(
        numericCombinationId,
        decodedImageName
      );

      if (!data) {
        console.error("❌ 공유된 향기 정보를 불러오지 못했습니다.");
      } else {
        setCombination(data.combination ?? null); // 🔹 undefined 방지
        setImageUrl(data.s3Url ?? null);
      }

      setLoading(false);
    };

    fetchData();
  }, [combinationId, imageName]);

  // 🔹 카드 캡처 및 다운로드
  const handleDownloadCardImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
        allowTaint: false,
        onclone: (document) => {
          return document.fonts.ready;
        },
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "shared-scent-card.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ 카드 이미지 다운로드 성공");
    } catch (error) {
      console.error("❌ 카드 이미지 다운로드 실패:", error);
    }
  };

  return (
    <div className="app">
      <Header
        showBack={false} // 뒤로가기 버튼 활성화
        showFinish={false}
        showDeviceManage={false}
        showAdd={false}
      />
      <div className="mt-4 flex flex-col items-center justify-center">
        {loading ? (
          <div className="w-[280px] h-[400px] bg-component p-4 rounded-xl flex flex-col items-center justify-center">
            <Spinner />
            <p className="text-14 font-pre-light mt-16">
              이미지를 불러오는 중입니다.
            </p>
          </div>
        ) : (
          <div
            ref={cardRef}
            className="w-[280px] h-[400px] bg-component p-4 rounded-xl"
          >
            <img
              src={scentifylogo}
              alt="Scentify"
              className="mx-auto max-w-7 h-auto mb-2"
            />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="AI Generated Image"
                className="w-full h-auto rounded-lg"
                crossOrigin="anonymous"
              />
            ) : (
              <p className="text-center text-sub font-pre-light text-sm">
                이미지를 불러올 수 없습니다.
              </p>
            )}
            <h2 className="text-14 text-center font-pre-medium mt-6">
              {combination?.name || "이름 없는 조합"}
            </h2>

            {/* 🔹 향기 정보 */}
            <div className="text-10 text-sub font-pre-light flex justify-center gap-1 mt-6 flex-wrap-nowrap">
              {[1, 2, 3, 4].map((num) => {
                const scentName = getScentName(
                  (combination?.[
                    `choice${num}` as keyof Combination
                  ] as number) ?? 0
                );

                const scentCount =
                  Number(
                    combination?.[`choice${num}Count` as keyof Combination]
                  ) ?? 0;

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

        {/* 🔹 이미지 저장 버튼 */}
        {!loading && (
          <button
            onClick={handleDownloadCardImage}
            className="border-[1px] border-brand w-[167.3px] h-[40px] text-brand text-16 font-pre-medium rounded-lg mt-4"
          >
            이미지 저장
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="border-[1px] border-brand w-[167.3px] h-[40px] text-brand text-16 font-pre-medium rounded-lg "
        >
          Scentify 시작하기
        </button>
      </div>
    </div>
  );
};

export default ReadShareFavorite;
