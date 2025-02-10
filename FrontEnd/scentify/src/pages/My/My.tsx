import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import UserCard from "../../feature/Home/mainhome/user/UserCard";
import { GroupList } from "../../feature/my/components/GroupList";
import { Routes, Route } from "react-router-dom";
import ManageAccount from "../../feature/my/components/ManageAccount";
import EditNickname from "../../feature/my/components/EditNickname";
import EditUserinfo from "../../feature/my/components/EdituUserinfo";
import EditPassword from "../../feature/my/components/EditPassword";
import EditProfileImg from "../../feature/my/components/EditProgileImg";
import { useUserStore } from "../../stores/useUserStore";
import MyUserCard from "../../feature/my/components/MyUserCard";
import Invite from "../../feature/invite/Invite";
import InviteCodeInput from "../../feature/invite/InviteCodeInput";
import manageaccountIcon from "../../assets/icons/manageaccount.svg";
import managegroupsIcon from "../../assets/icons/managegroups.svg";

const My = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { nickname, imgNum, mainDeviceId } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login"); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="userComponent w-full mx-5 relative">
      <Routes>
        {/* 기본 경로: 계정 관리 페이지 */}
        <Route
          index
          element={
            <>
              {/** 계정 관리 */}
              <div>
                <div className="flex flex-row justify-between items-center text-center">
                  <div className="flex items-center py-4 font-pre-medium text-20">
                    <img
                      src={manageaccountIcon}
                      alt="계정 관리 아이콘"
                      className="w-6 h-6 mr-2"
                    />
                    <span>계정 관리</span>
                  </div>
                  <button
                    className="w-[70px] h-[32px] text-[12px] font-pre-light border-0.2 border-lightgray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
                <MyUserCard
                  nickname={nickname ?? "사용자"} // 기본값 처리
                  imgNum={imgNum ?? 1}
                  mainDeviceId={mainDeviceId ?? 0}
                />
              </div>
              <div className="h-[25px]"></div>

              {/** 그룹 관리 */}
              <div>
                <div className="flex items-center py-4 font-pre-medium text-20">
                  <img
                    src={managegroupsIcon}
                    alt="그룹 관리 아이콘"
                    className="w-6 h-6 mr-2"
                  />
                  <span>그룹 관리</span>
                </div>
                <GroupList />
              </div>
            </>
          }
        />
        <Route path="manageaccount" element={<ManageAccount />} />
        <Route path="editnickname" element={<EditNickname />} />
        <Route path="edituserinfo" element={<EditUserinfo />} />
        <Route path="editpassword" element={<EditPassword />} />
        <Route path="editprofileimg" element={<EditProfileImg />} />
        <Route path="invite" element={<Invite />} />
        <Route path="invitecodeinput" element={<InviteCodeInput />} />
      </Routes>
    </div>
  );
};

export default My;
