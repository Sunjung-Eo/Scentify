import { Link } from "react-router-dom";

function RegistDevice2() {
  return (
    <>
      {/* 전역적으로 설정된 content전체를 묶은 main있음, 
    main을 기준으로 S/N과 IP를 묶고 버튼과 수직으로 띄워놓음
    main레이아웃에서 위아래 모두 margin 4씩 줌*/}

      {/* 시리얼 번호와 IP 주소를 묶은 그룹 */}
      <div className="NotButtonGroup flex flex-col px-4">
        {/* S/N Input */}
        <div className="S/N Input mb-4 mt-4">
          <label className="text-sm mb-2 block font-pre-regular">
            시리얼 번호 (S/N)
          </label>
          <input
            type="text"
            placeholder="시리얼 번호 입력"
            className="w-full rounded-lg bg-component px-4 py-3 font-pre-regular"
          />
        </div>

        {/* IP Input */}
        <div className="ID Input">
          <label className="text-sm mb-2 block font-pre-regular">IP 주소</label>
          <div className="flex items-center gap-2">
            <input
              type="text" //number로 하면 화살표가 생김.. 일단 text로 받기
              min="0"
              max="255"
              className="w-16 rounded-lg bg-component px-2 py-2 text-center"
            />
            <span className="text-gray-500">.</span>
            <input
              type="text"
              min="0"
              max="255"
              className="w-16 rounded-lg bg-component px-2 py-2 text-center"
            />
            <span className="text-gray-500">.</span>
            <input
              type="text"
              min="0"
              max="255"
              className="w-16 rounded-lg bg-component px-2 py-2 text-center"
            />
            <span className="text-gray-500">.</span>
            <input
              type="text"
              min="0"
              max="255"
              className="w-16 rounded-lg bg-component px-2 py-2 text-center"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mb-4 w-full px-4">
        <Link to="/home/registconnecting">
          <button className="border h-12 w-full rounded-lg border-gray px-6 font-pre-bold text-gray">
            저장
          </button>
        </Link>
      </div>
    </>
  );
}
export default RegistDevice2;
