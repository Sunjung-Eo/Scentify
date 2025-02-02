import hashlib
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join('config', '.env'))

# 인증 관리
class AuthManager:
    def __init__(self):
        # self.JWT_KEY = os.getenv("JWT_SECRET_KEY")
        self.DEVICE_SERIAL = os.getenv("DEVICE_SERIAL")

    # 핸드쉐이크 시 SHA-256 검증
    def verify_handshake(self, token: str, serial: str) -> bool:
        try:
            # 기존 저장된 시리얼 넘버 해쉬화 한 값과 클라이언트가 보낸 토큰 비교
            stored_hash = hashlib.sha256(self.DEVICE_SERIAL.encode()).hexdigest()
            return stored_hash == token
        except Exception as e:
            print(f"Auth Error: {e}")
            return False
    