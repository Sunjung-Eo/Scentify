// userType.ts가 완성되지 않은 상태라 임의의 Membercard 타입정의(멤버카드CSS를 보기위해 넣어놓음, 교체 바람!)
type MemberCardProps = {
  profileImg: string; // 프로필 이미지 경로
  id: string; // 멤버 ID
  nickname: string; // 멤버 닉네임
  onDelete: () => void; // 삭제 버튼 클릭 핸들러
};

const MemberCard = ({
  profileImg,
  id,
  nickname,
  onDelete,
}: MemberCardProps) => (
  <div className="flex items-center justify-between py-2">
    {/* 프로필 이미지 */}
    <div className="flex items-center">
      <img src={profileImg} alt="profileImg" className="w-10 h-10" />
      {/* ID와 닉네임 */}
      <div className="flex flex-col ml-4">
        <p className="text-16 font-pre-medium">{id}</p>
        <p className="text-16 font-pre-medium">{nickname}</p>
      </div>
    </div>
    {/* 삭제 버튼 */}

    <button
      onClick={onDelete}
      className="ml-auto w-[65px] h-[25px] text-12 font-pre-light text-sub border-[1px] border-lightgray rounded-lg"
    >
      삭제
    </button>
  </div>
);

export default MemberCard;
