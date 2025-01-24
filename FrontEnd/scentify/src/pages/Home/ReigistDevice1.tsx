import Vector from "../../assets/images/Vector.png";
import { Link } from "react-router-dom"; //페이지 이동 LInk쓸지 Navigate쓸 지 안정함.

function RegistDevice1() {
  return (
    <>
      {/* 전역적으로 설정된 content전체를 묶은 main(justify-content설정)있음, 
    main을 기준으로 버튼아닌것들을묶고 버튼과 수직으로 띄워놓음
    main레이아웃에서 위아래 모두 margin 4씩 줌*/}
      <div className="NotButtonGroup flex flex-col items-center px-4 text-center">
        <h1 className="text-xl mt-4 flex-1 font-pre-bold">새 기기 등록</h1>

        <img
          src={Vector}
          alt="이미지"
          className="mt-20 h-36 w-36 object-contain"
        />

        <p className="text-sm mt-20 font-pre-regular">
          기기 등록을 시작하려면
          <br /> 다음 단계로 넘어가 순서대로 진행해주세요.
        </p>
      </div>

      <div className="mb-4 w-full px-4">
        <Link to="/home/registdevice2">
          <button className="h-12 w-full  rounded-lg bg-brand px-6 font-pre-bold text-white">
            기기 등록하기
          </button>
        </Link>
      </div>
    </>
  );
}

export default RegistDevice1;
