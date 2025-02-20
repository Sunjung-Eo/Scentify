interface ScentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScentGuideModal({
  isOpen,
  onClose,
}: ScentGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-[320px] max-h-[80vh] flex flex-col">
        {/* X 버튼 추가 */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#2D3319"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="overflow-y-auto pr-2 scrollbar-hidden">
          <h3 className="text-14 font-pre-bold mb-2">향 설정 방법</h3>
          <div className="text-12 font-pre-light space-y-2 pb-5">
            <p>
              • 각 향의 분사량을 공간 크기에 따라 3 또는 6 단계로 설정할 수
              있습니다.
            </p>
            <p>
              • 모든 향의 분사량 합은 선택한 크기(3 또는 6)을 초과할 수
              없습니다.
            </p>
            <p>• 같은 단계를 다시 클릭하면 0으로 초기화됩니다.</p>
          </div>

          <h3 className="text-14 font-pre-bold mb-2">향기별 비율 가이드</h3>
          <div className="text-12 font-pre-light space-y-2">
            <p>
              <span className="font-pre-medium">
                • 시트러스 향 (레몬, 오렌지블라썸) :
              </span>{' '}
              <p>
                비율을 높이면 활기찬 분위기를 연출하며, 개운한 느낌을 줍니다.
                아침이나 집중이 필요한 공간에 적합합니다.
              </p>
            </p>

            <p>
              <span className="font-pre-medium">
                • 허브 향 (유칼립투스, 페퍼민트) :
              </span>{' '}
              <p>
                비율을 높이면 시원하고 깔끔한 느낌을 줍니다. 운동 후 회복이나
                상쾌한 공간을 만들 때 추천됩니다.
              </p>
            </p>

            <p>
              <span className="font-pre-medium">
                • 플로럴 향 (라벤더, 카모마일) :
              </span>{' '}
              <p>
                비율을 높이면 부드럽고 따뜻한 분위기를 조성하여 안정감을 줍니다.
                휴식과 수면 공간에 적합합니다.{' '}
              </p>
            </p>
            <p>
              <span className="font-pre-medium">
                • 우디 향 (시더우드, 샌달우드) :
              </span>{' '}
              <p>
                비율을 높이면 고급스럽고 묵직한 느낌을 줍니다. 차분하고 안정적인
                분위기를 만들고 싶을 때 추천됩니다.{' '}
              </p>
            </p>
            <p>
              <span className="font-pre-medium">
                • 머스크 향 (화이트머스크) :
              </span>{' '}
              <p>
                비율을 높이면 포근하고 부드러운 향이 강조되며, 편안한 느낌을
                줍니다. 부드러운 감성을 원할 때 추천됩니다.
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
