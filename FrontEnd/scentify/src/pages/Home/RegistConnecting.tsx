import Spinner from "../../feature/Home/Loading/Spinner";
import { Link } from "react-router-dom";
//나중에 눌러라 버튼 지우기
function RegistConnecting() {
  return (
    <div className="content px-4 pt-6">
      <div className="flex flex-col items-center text-center">
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
        <Link to="/home/connectsuccess">
          <button>눌러라</button>
        </Link>
      </div>
    </div>
  );
}
export default RegistConnecting;
