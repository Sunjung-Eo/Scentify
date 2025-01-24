import { Link } from "react-router-dom";

function RegistDevice2() {
  return (
    <div className="content px-4 pt-6 pb-8">
      {/* 전역적으로 설정된 content전체를 묶은 main있음, 
    main을 기준으로 S/N과 IP를 묶고 버튼과 수직으로 띄워놓음
    main레이아웃에서 위아래 모두 margin 4씩 줌*/}

      <div className="ButtonTextGroup flex flex-col justify-between h-full">
        {/* 시리얼 번호와 IP 주소를 묶은 그룹 */}
        <div className="NotButtonGroup flex flex-col">
          {/* S/N Input */}
          <div className="S/N Input mt-4 mb-4">
            <label className="text-sm font-pre-regular mb-2 block">
              시리얼 번호 (S/N)
            </label>
            <input
              type="text"
              placeholder="시리얼 번호 입력"
              className="w-full px-4 py-3 rounded-lg bg-component font-pre-regular"
            />
          </div>

          {/* IP Input */}
          <div className="ID Input">
            <label className="text-sm font-pre-regular mb-2 block">
              IP 주소
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text" //number로 하면 화살표가 생김.. 일단 text로 받기
                min="0"
                max="255"
                className="w-16 px-2 py-2 rounded-lg text-center bg-component"
              />
              <span className="text-gray-500">.</span>
              <input
                type="text"
                min="0"
                max="255"
                className="w-16 px-2 py-2 rounded-lg text-center bg-component"
              />
              <span className="text-gray-500">.</span>
              <input
                type="text"
                min="0"
                max="255"
                className="w-16 px-2 py-2 rounded-lg text-center bg-component"
              />
              <span className="text-gray-500">.</span>
              <input
                type="text"
                min="0"
                max="255"
                className="w-16 px-2 py-2 rounded-lg text-center bg-component"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <Link to="/home/registconnecting">
            <button className="w-full h-12 px-6 rounded-lg text-gray font-pre-bold border border-gray">
              저장
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default RegistDevice2;
