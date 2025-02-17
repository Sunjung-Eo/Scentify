import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { readShareFavorite } from "../../apis/scent/readShareFavorite"; // API 호출 함수 가져오기

import { Combination } from "../../feature/scent/scentmain/scenttypes";
import { getScentName, getColor } from "../../utils/control/scentUtils";
import Spinner from "../../components/Loading/Spinner";
import Header from "../../layout/Header";

import html2canvas from "html2canvas";
import scentifylogo from "../../assets/icons/scentify-green-logo.svg";

const ReadShareFavorite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null); // 캡처할 카드 영역

  //URL에서 combinationId와 imageName 추출
  const queryParams = new URLSearchParams(location.search);
  const combinationId = queryParams.get("combinationId");
  const imageName = queryParams.get("imageName");

  // 상태 변수
  const [combination, setCombination] = useState<Combination | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // API 호출
  useEffect(() => {
    if (!combinationId || !imageName) {
      setLoading(false);
      return;
    }

    const numericCombinationId = parseInt(combinationId, 10); //number로 변환
    const decodedImageName = decodeURIComponent(imageName); //URL 인코딩 해제

    const fetchData = async () => {
      const data = await readShareFavorite(
        numericCombinationId,
        decodedImageName
      );

      if (!data) {
      } else {
        setCombination(data.combination ?? null);
        setImageUrl(data.s3Url ?? null);
      }

      setLoading(false);
    };

    fetchData();
  }, [combinationId, imageName]);

  //카드 캡처 및 다운로드
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
    } catch (error) {}
  };

  return (
    <div className="app">
      <Header
        showBack={false}
        showFinish={false}
        showDeviceManage={false}
        showAdd={false}
        showCancel={false}
        nextDeviceEdit={false}
      />
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-12 font-pre-light text-brand mb-4">
          AI를 기반으로 향과 어울리는 이미지 파일을 생성해줍니다.
        </h1>
        {loading ? (
          <div className="w-[280px] h-[400px] bg-component p-4 rounded-xl flex flex-col items-center justify-center">
            <Spinner />
            <p className="text-12 font-pre-light mt-16">
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

            {/* 향기 정보 */}
            <div className="text-10 text-sub font-pre-light flex justify-center gap-1 mt-6 flex-wrap-nowrap">
              {[1, 2, 3, 4].map((num) => {
                const scentChoice =
                  combination?.[`choice${num}` as keyof Combination];
                const scentName =
                  typeof scentChoice === "number"
                    ? getScentName(scentChoice)
                    : null;
                const rawScentCount =
                  combination?.[`choice${num}Count` as keyof Combination];
                const scentCount =
                  typeof rawScentCount === "number" ? rawScentCount : 0;

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

        {/*버튼 그룹*/}
        <p className="text-10 font-pre-light text-brand mt-12">
          이미지 저장은 10분간 유효합니다.
        </p>
        <div className="flex gap-4 mt-1">
          {!loading && (
            <button
              onClick={handleDownloadCardImage}
              className="border-[1px] border-brand w-[150px] h-[48px] text-brand text-16 font-pre-medium rounded-lg active:text-bg active:bg-brand active:border-0"
            >
              이미지 저장
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="border-[1px] border-brand w-[150px] h-[48px] text-brand text-16 font-pre-medium rounded-lg active:text-bg active:bg-brand active:border-0"
          >
            Scentify 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadShareFavorite;
