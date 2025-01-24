import DoneRing from "../../assets/images/Done_ring_round.svg";

function ConnectSuccess() {
  return (
    <div className="content px-4 pt-6">
      <div className="ButtonTextGroup flex flex-col justify-between h-full">
        <div className="flex flex-col items-center text-center">
          <div className="mt-20">
            <img src={DoneRing} alt="image" />
          </div>
          <p className="mt-16 text-lg font-pre-regular">연결에 성공했습니다!</p>
          <p className="mt-4 text-sm font-pre-regular text-gray">
            다음 단계로 넘어가주세요.
          </p>
        </div>

        <div className="w-full">
          <button className="w-full h-12 px-6 rounded-lg text-gray font-pre-bold border border-gray">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConnectSuccess;
