function SpaceDescription() {
  return (
    <div className="flex justify-center">
      <div className="text-[10px] font-pre-light">
        <h2 className="text-lightgray mb-1">잠깐! 공간 크기는요..</h2>
        <div className="px-4 py-2 bg-white w-[320px] h-[99px] rounded-lg">
          <div className="mb-3">
            <h3 className="text-gray mb-1">소형 공간: 10평 이하</h3>
            <p className="text-gray">
              • 예시 : 작은 방, 욕실, 개인 서재, 소규모 침실
            </p>
          </div>

          <div className="">
            <h3 className="text-gray mb-1">중/대 공간: 11평 ~ 25평</h3>
            <p className="text-gray">• 예시 : 거실, 중형 침실, 원룸/투룸</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SpaceDescription;
