import { useNavigate } from 'react-router-dom';
import './start.css';
import startBtnIcon from '../../assets/icons/start-btn.svg';

const Start = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="start-container flex flex-col items-start justify-between w-full h-screen">
      <div className="title mt-10 px-10 w-full">
        <p className="text-[50px] font-poppins-light text-bg">Fill your</p>
        <p className="text-[50px] font-poppins-light text-bg">home</p>
        <p className="text-[50px] font-poppins-light text-bg">with scent*</p>
      </div>
      <div className="text-2xl mb-14 font-pre-medium text-bg">
        <button
          onClick={handleStart}
          className="start-button flex items-center text-20 font-pre-medium"
        >
          시작하기
          <img
            src={startBtnIcon}
            alt="Start Button Icon"
            className="start-icon ml-2 w-18 h-18"
          />
        </button>
      </div>
    </div>
  );
};

export default Start;
