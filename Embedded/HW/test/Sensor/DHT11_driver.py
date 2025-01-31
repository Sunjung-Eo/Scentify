import RPi.GPIO as GPIO
import time

from array import array

DHT11_MAX_CNT : int = 32000

class DHT11:
    def __init__(self, pin):
        self.pin = pin
        self._max_pulses = 81
        self.__hiLevel = 51
        GPIO.setmode(GPIO.BOARD)  # BCM 핀 번호 사용
        GPIO.setup(self.pin, GPIO.OUT)

    def _pulses_to_binary(self, pulses : array, start: int, stop: int) -> int:
        binary = 0
        hi_sig = False
        for bit_inx in range(start, stop):
            if hi_sig:
                bit = 0
                if pulses[bit_inx] > self.__hiLevel:
                    bit = 1
                binary = binary << 1 | bit

            hi_sig = not hi_sig

        return binary

    def make_pulse(self, ):
        """
        TODO
        - 여기 DHT11이 데이터 보내겠다는 LOW 8us, HIGH 8us 체크하기
        - Bouncing 문제 있는지 한번 확인해볼 필요 있음 -> 커패시터 달 수 있으면 달기
        - 총 통신 시간 최소 3200us, 최대 4800us
        """

        #DHT11에서 데이터를 읽어옴.
        
        pulses = array("H")
        transitions = []

        # 초기화 신호 전송
        GPIO.setup(self.pin, GPIO.OUT)
        GPIO.output(self.pin, GPIO.HIGH)
        time.sleep(0.1)

        GPIO.output(self.pin, GPIO.LOW)
        time.sleep(0.018)  # 18ms 동안 LOW 신호 전송
        # GPIO.output(self.pin, GPIO.HIGH)
        # time.sleep(0.00002)  # 20µs 동안 HIGH 신호 전송
        timestamp = time.monotonic()
        dhtval = True
        GPIO.setup(self.pin, GPIO.IN, GPIO.PUD_UP)  # 입력 모드로 전환

        while time.monotonic() - timestamp < 0.25:
            if dhtval != GPIO.input(self.pin):
                dhtval = not dhtval
                timestamp = time.monotonic()
                transitions.append(timestamp)
                
        
        transition_start = max(1, len(transitions) - self._max_pulses)
        for i in range(transition_start, len(transitions)):
            pulses_micro_sec = int(1000000 * (transitions[i] - transitions[i - 1]))
            pulses.append(min(pulses_micro_sec, 65535))

        return pulses

    def read(self):
        pulses = self.make_pulse()
        if len(pulses) < 80:
            # We got *some* data just not 81 bits
            raise RuntimeError("A full buffer was not returned. Try again.")

        buf = array("B")
        for byte_start in range(0, 80, 16):
            buf.append(self._pulses_to_binary(pulses, byte_start, byte_start + 16))

        new_humidity = buf[0]
        # temperature is 1 byte for integral and 1 byte for 1st decimal place
        new_temperature = buf[2] + (buf[3] & 0x0F) / 10
        
        # calc checksum
        chk_sum = 0
        for b in buf[0:4]:
            chk_sum += b

        # checksum is the last byte
        if chk_sum & 0xFF != buf[4]:
            # check sum failed to validate
            raise RuntimeError("Checksum did not validate. Try again.")

        if new_humidity < 0 or new_humidity > 100:
            # We received unplausible data
            raise RuntimeError("Received unplausible data. Try again.")

        return new_humidity, new_temperature


    def _wait_for_signal(self, signal, timeout):
        """
        주어진 신호(LOW 또는 HIGH)를 기다림.
        """
        start_time = time.time()
        while GPIO.input(self.pin) != signal:
            if time.time() - start_time > timeout:
                return False
        return True

    def _read_duration(self):
        """
        DHT11에서 40비트 데이터를 읽어옴 (미리 할당 방식).
        """
        # 40개의 unsigned char 배열을 미리 할당 (초기값은 0)
        durations = array('I', [0] * 80)

        for i in range(0, 80, 2):
            # LOW 신호 대기
            while not GPIO.input(self.pin):
                durations[i] += 1
                if durations[i] > DHT11_MAX_CNT:
                    print(i, durations[i])
                    raise "Exceed DHT11_MAX_CNT"

            while GPIO.input(self.pin):
                durations[i + 1] += 1
                if durations[i + 1] > DHT11_MAX_CNT:
                    print(i + 1, durations[i + 1])
                    raise "Exceed DHT11 MAX_CNT"
        
        return durations


    def _parse_data(self, bits):
        """
        40비트 데이터를 해석하여 습도와 온도를 반환.
        """
        bytes_data = []
        for i in range(0, 40, 8):
            byte = 0
            for j in range(8):
                byte = (byte << 1) | bits[i + j]
            print(f"{i} th data : {byte}")
            bytes_data.append(byte)

        # 데이터 검증 (체크섬 확인)
        if sum(bytes_data[:4]) & 0xFF != bytes_data[4]:
            raise "check sum fail"

        humidity = bytes_data[0]
        # temperature is 1 byte for integral and 1 byte for 1st decimal place
        temperature = bytes_data[2] + (bytes_data[3] & 0x0F) / 10

        if humidity > 100 or humidity < 0:
            raise "humidity Error (> 100 or < 0)"

        return humidity, temperature

    def cleanup(self):
        """
        GPIO 리소스 정리.
        """
        GPIO.cleanup()

# 예제 실행 코드
if __name__ == "__main__":
    dht11_sensor = DHT11(pin=8)  # DHT11의 데이터 핀이 연결된 GPIO 핀 번호 (BCM 기준)
    try:
        # while True:
        humidity, temperature = dht11_sensor.read()
        if humidity is not None and temperature is not None:
            print(f"Temperature: {temperature}°C")
            print(f"Humidity: {humidity}%")
        else:
            print("Failed to read data from DHT11.")
            print(humidity, temperature)
            pass
    except KeyboardInterrupt:
        print("Exiting program.")
    finally:
        dht11_sensor.cleanup()
