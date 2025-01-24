import DoneRing from "../../assets/images/Done_ring_round.svg";

function ConnectSuccess() {
  return (
    <>
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="mt-20">
          <img src={DoneRing} alt="image" />
        </div>
        <p className="text-lg mt-16 font-pre-regular">연결에 성공했습니다!</p>
        <p className="text-sm mt-4 font-pre-regular text-gray">
          다음 단계로 넘어가주세요.
        </p>
      </div>

      <div className="mb-4 w-full px-4">
        <button className="border h-12 w-full rounded-lg border-gray px-6 font-pre-bold text-gray">
          다음
        </button>
      </div>
    </>
  );
}
export default ConnectSuccess;
