import { useNavigate } from 'react-router-dom';
import './start.css';
import startBtnIcon from '../../assets/icons/start-btn.svg';

const Start = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="start-container">
      <div className="text-2xl mb-14 font-pre-medium text-bg">
        <button
          onClick={handleStart}
          className="start-button flex items-center"
        >
          시작하기
          <img
            src={startBtnIcon}
            alt="Start Button Icon"
            className="start-icon ml-2"
          />
        </button>
      </div>
    </div>
  );
};

export default Start;
