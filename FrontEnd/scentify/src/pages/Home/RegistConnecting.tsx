import Spinner from "../../feature/Home/Loading/Spinner";

function RegistConnecting() {
  return (
    <>
      <div className="flex flex-col items-center text-center mt-4">
        <div className="Spinner mt-20">
          <Spinner></Spinner>
        </div>
        <p className="mt-16 text-lg font-pre-regular">연결 중..</p>
        <p className="mt-4 text-sm font-pre-regular text-gray">
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
