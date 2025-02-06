import Jetson.GPIO as GPIO
import time

class Solenoid:
    def __init__(self, gpio_in1, gpio_in2):
        if gpio_in1 is None or gpio_in2 is None:
            raise "Must Provide GPIO Number!"
        self.gpio_in1 = gpio_in1
        self.gpio_in2 = gpio_in2

        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.gpio_in1, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(self.gpio_in2, GPIO.OUT, initial=GPIO.LOW)        

    def operate_once(self, time_duration=1):
        GPIO.output(self.gpio_in1, GPIO.HIGH)
        GPIO.output(self.gpio_in2, GPIO.LOW)
        time.sleep(time_duration)

        GPIO.output(self.gpio_in1, GPIO.LOW)
        GPIO.output(self.gpio_in2, GPIO.LOW)
        time.sleep(time_duration)
        

    def operate_repeat(self, repeat_num, time_duration=1):
        for _ in range(0, repeat_num):
            self.operate_once(time_duration)
    

    def __del__(self, ):
        GPIO.cleanup()

if __name__ == '__main__':
    solenoid = Solenoid(31, 33)
    solenoid.operate_repeat(repeat_num=3, time_duration=3)