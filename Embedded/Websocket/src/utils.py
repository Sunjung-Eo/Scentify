import os
import jwt
import datetime
import subprocess
from dotenv import load_dotenv


load_dotenv(dotenv_path=os.path.join('../config', '.env'))

def get_serial_number():
    return subprocess.run(
        "cat /proc/cpuinfo | grep Serial | awk '{print $3}'",
        shell=True,
        capture_output=True,
        text=True
    ).stdout.strip()

def get_access_token(token, private_key=os.getenv("JWT_SECRET_KEY")):
    payload = {
        "token" : token,
        "exp" : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }

    return jwt.encode(payload, private_key, algorithm="HS256")
