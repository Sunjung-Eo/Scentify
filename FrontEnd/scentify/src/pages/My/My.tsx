import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import MyUserCard from "../../feature/my/components/MyUserCard";
import { GroupList } from "../../feature/my/components/GroupList";
import { Routes, Route } from "react-router-dom";
import ManageAccount from "../../feature/my/components/ManageAccount";
import EditNickname from "../../feature/my/components/EditNickname";
import EditUserinfo from "../../feature/my/components/EdituUserinfo";
import EditPassword from "../../feature/my/components/EditPassword";
import EditProfileImg from "../../feature/my/components/EditProgileImg";

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
                  <div className="py-4 font-pre-medium text-20">계정 관리</div>
                  <button
                    className="w-[70px] h-[32px] text-[12px] font-pre-light border-0.2 border-lightgray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
                <MyUserCard />
              </div>
              <div className="h-[25px]"></div>

              {/** 그룹 관리 */}
              <div>
                <div className="py-4 font-pre-medium text-20">그룹 관리</div>
                <GroupList />
              </div>

              {/** 가족 초대 */}
              <button className="text-12 font-pre-light  absolute bottom-10">
                초대코드로 입력
              </button>
            </>
          }
        />
        <Route path="manageaccount" element={<ManageAccount />} />
        <Route path="editnickname" element={<EditNickname />} />
        <Route path="edituserinfo" element={<EditUserinfo />} />
        <Route path="editpassword" element={<EditPassword />} />
        <Route path="editprofileimg" element={<EditProfileImg />} />v
      </Routes>
    </div>
  );
};

export default My;
