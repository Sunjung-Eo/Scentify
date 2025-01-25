import kakaoLogo from "../../assets/icons/kakao-logo.svg";
import googleLogo from "../../assets/icons/google-logo.svg";
import { useNavigate } from "react-router-dom";

const SocialLogoBtn = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-5 pt-4">
      <button onClick={() => navigate("/auth/kakao")}>
        <img src={kakaoLogo} alt="Kakao Logo" className="h-10 w-10" />
      </button>
      <button onClick={() => navigate("/auth/google")}>
        <img src={googleLogo} alt="Google Logo" className="h-10 w-10" />
      </button>
    </div>
  );
};

export default SocialLogoBtn;
