import time
import my_adafruit_dht as adafruit_dht
import board

# Jetson Nano의 GPIO 핀 설정
# DHT11의 데이터 핀에 연결된 Jetson Nano 핀을 지정
DHT_PIN = board.D27  # Jetson Nano의 GPIO4에 연결되었다고 가정

# DHT11 센서 초기화
dht_device = adafruit_dht.DHT11(DHT_PIN)

try:
    while True:
        try:
            # DHT11 센서에서 온도와 습도 데이터 읽기
            temperature = dht_device.temperature
            humidity = dht_device.humidity

            # 결과 출력
            print(f"Temperature: {temperature}°C, Humidity: {humidity}%")
        except RuntimeError as e:
            # 센서 오류 처리 (DHT11은 간헐적으로 데이터를 놓칠 수 있음)
            print(f"Sensor reading error: {e.args[0]}")
            time.sleep(1.0)
            continue

        time.sleep(2.0)  # DHT11은 2초 이상의 대기 시간이 필요
except KeyboardInterrupt:
    print("Terminating program.")
finally:
    # 리소스 정리
    dht_device.exit()
