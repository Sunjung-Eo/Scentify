import os
import json
import jwt
import datetime
import subprocess
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, "config", ".env")

load_dotenv(dotenv_path=ENV_PATH)

def get_websocket_url():
    return os.getenv("WEBSOCKET_URL")

def get_mqtt_url():
    return os.getenv("MQTT_URL")

def get_serial_number():
    return subprocess.run(
        "cat /proc/cpuinfo | grep Serial | awk '{print $3}'",
        shell=True,
        capture_output=True,
        text=True
    ).stdout.strip()

def get_access_token(token, private_key=os.getenv("JWT_SECRET_KEY")):
    if private_key is None:
        print("Private Key is None!!\n")

    payload = {
        "token" : token,
        "exp" : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    
    return jwt.encode(payload, private_key, algorithm="HS256")

def get_temp_and_hum():
    script_path = os.path.expanduser("~/work/sample/dht11_by_lib.py")
    result = subprocess.run(["python3", script_path], capture_output=True, text=True)
    lines = result.stdout.splitlines()  # 출력의 각 줄을 분리
    
    return lines[0], lines[1]