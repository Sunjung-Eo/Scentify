import { useState } from 'react';

export const GroupList = () => {
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 선택된 기기 상태
  const [selectedGroup, setSelectedGroup] = useState('A기기');
  // 기기 목록
  const groups = ['A기기', 'B기기', 'C기기'];

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // 기기 선택 함수
  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group);
    setIsDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        {/* 멤버 목록 */}
        <div className="font-pre-medium text-12 text-gray">멤버 목록</div>
        {/* 상단 메뉴 */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-2 h-[32px] shadow-sm text-[12px] font-pre-light rounded-lg border-0.2 border-lightgray focus:outline-none focus:ring-1 focus:ring-brand"
              onClick={toggleDropdown}
            >
              <span className="text-orange-500">👑</span>
              <span>{selectedGroup}</span>
              <span>▼</span>
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute mt-1 w-[90px] bg-white border rounded-lg shadow-lg">
                {groups.map((group) => (
                  <button
                    key={group}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-12 font-pre-light"
                    onClick={() => handleSelectGroup(group)}
                  >
                    {group === 'A기기' && (
                      <span className="text-orange-500">👑</span>
                    )}
                    {group}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 초대하기 버튼 */}
          <button className="w-[70px] h-[32px] text-[12px] font-pre-light rounded-lg border-0.2 border-lightgray focus:outline-none focus:ring-1 focus:ring-brand">
            초대하기
          </button>
        </div>
      </div>
      {/* 빈 컨텐츠 */}
      <div className="flex justify-center items-center h-48 text-gray-300 text-2xl">
        텅
      </div>
    </>
  );
};
