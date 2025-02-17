import Vector from '../../../assets/images/Vector.png';
import { Link } from 'react-router-dom'; //페이지 이동 LInk쓸지 Navigate쓸 지 안정함.

function RegistDevice1() {
  return (
    <div className="content px-4 pt-6 pb-8">
      {/* 전역적으로 설정된 content전체를 묶은 main(justify-content설정)있음, 
    main을 기준으로 버튼아닌것들을묶고 버튼과 수직으로 띄워놓음
    main레이아웃에서 위아래 모두 margin 4씩 줌*/}
      <div className="ButtonTextGroup flex flex-col justify-between h-full">
        <div className="NotButtonGroup flex flex-col items-center text-center">
          <h1 className="flex-1 text-20 font-pre-bold">새 기기 등록</h1>

          <img
            src={Vector}
            alt="이미지"
            className="object-contain w-36 h-36 mt-20"
          />

          <p className="text-12 mt-20 font-pre-light">
            기기 등록을 시작하려면
            <br /> 다음 단계로 넘어가 순서대로 진행해주세요.
          </p>
        </div>

        <div className="w-full">
          <Link to="/home/registdevice2">
            <button className="w-full h-12 px-6 rounded-lg bg-brand text-bg text-16 font-pre-medium">
              기기 등록하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegistDevice1;
