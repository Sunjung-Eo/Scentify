import Spinner from '../Loading/Spinner';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { registDevice } from '../../../apis/home/registdevice';
import { Link } from 'react-router-dom';

function RegistConnecting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serial, ipAddress, accessToken } = location.state || {};

  const isRegistered = useRef(false); // 중복 실행 방지용 ref

  useEffect(() => {
    const register = async () => {
      if (isRegistered.current) return; // 이미 실행되었으면 return
      isRegistered.current = true; // 실행되었음을 표시

      console.log('디바이스 등록 요청 몇번?');
      try {
        const response = await registDevice(serial, ipAddress, accessToken);
        console.log('디바이스 등록 성공, ID:', response.id);

        const id = response.id;

        navigate('/home/connectsuccess', { state: { id: id } });
      } catch (error: any) {
        if (error.status === 409) {
          alert('이미 등록된 기기입니다.');
          navigate('/home');
        } else if (error.status === 403) {
          alert('핸드셰이크 실패. 다시 시도해주세요.');
          navigate('/home');
        } else if (error.status === 400) {
          alert('요청이 잘못되었습니다.');
          navigate('/home');
        } else {
          alert('등록 중 오류가 발생했습니다.');
          console.error('등록 중 오류:', error);
          navigate('/home');
        }
      }
    };

    register();
  }, [navigate, serial, ipAddress, accessToken]);

  return (
    <div className="content px-4 pt-12">
      <div className="flex flex-col items-center text-center">
        <div className="Spinner mt-20">
          <Spinner></Spinner>
        </div>
        <p className="text-20 mt-16 font-pre-light">연결 중..</p>
        <p className="text-12 mt-4 font-pre-light text-gray">
          기기가 연결되기까지
          <br />
          다소 시간이 소요될 수 있습니다.
          <br />
          잠시 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
export default RegistConnecting;
