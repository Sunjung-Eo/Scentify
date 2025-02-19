import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { GroupList } from "../../feature/my/main/GroupList";
import { Routes, Route } from "react-router-dom";
import ManageAccount from "../../feature/my/main/ManageAccount";
import EditNickname from "../../feature/my/editaccount/EditNickname";
import EditUserinfo from "../../feature/my/editaccount/EdituUserinfo";
import EditPassword from "../../feature/my/editaccount/EditPassword";
import EditProfileImg from "../../feature/my/editaccount/EditProgileImg";
import MyUserCard from "../../feature/my/main/MyUserCard";
import Invite from "../../feature/my/invite/Invite";
import InviteCodeInput from "../../feature/my/invite/InviteCodeInput";
import manageaccountIcon from "../../assets/icons/manageaccount.svg";
import managegroupsIcon from "../../assets/icons/managegroups.svg";

const My = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login"); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <>
      <Routes>
        {/* 기본 경로: 계정 관리 페이지 */}
        <Route
          index
          element={
            <div className="flex flex-col h-full w-full">
              {/* 계정 관리 */}

              <div className="flex flex-col h-full mt-[6px] w-full">
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between items-center text-center">
                    <div className="flex items-center font-pre-medium text-16">
                      <img
                        src={manageaccountIcon}
                        alt="계정 관리 아이콘"
                        className="w-5 h-5 mr-1"
                      />
                      <span>계정 관리</span>
                    </div>
                    <button
                      className="w-[65px] h-[30px] text-12 font-pre-light rounded-lg border-[0.7px] border-gray active:text-component active:bg-brand active:border-0"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                  <div className="mt-[10px]">
                    <MyUserCard />
                  </div>
                </div>
                {/** 그룹 관리 */}
                <div className="relative flex flex-col h-full mt-8">
                  <div className="flex items-center font-pre-medium text-16">
                    <img
                      src={managegroupsIcon}
                      alt="그룹 관리 아이콘"
                      className="w-5 h-5 mr-1"
                    />
                    <span>그룹 관리</span>
                  </div>
                  <GroupList />
                </div>
              </div>
            </div>
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
    </>
  );
};

export default My;
