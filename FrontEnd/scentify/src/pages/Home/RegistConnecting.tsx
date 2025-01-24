import Spinner from "../../feature/Home/Loading/Spinner";

function RegistConnecting() {
  return (
    <>
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="Spinner mt-20">
          <Spinner></Spinner>
        </div>
        <p className="text-lg mt-16 font-pre-regular">연결 중..</p>
        <p className="text-sm mt-4 font-pre-regular text-gray">
          기기가 연결되기까지
          <br />
          다소 시간이 소요될 수 있습니다.
          <br />
          잠시 기다려 주세요.
        </p>
      </div>
    </>
  );
}
export default RegistConnecting;
