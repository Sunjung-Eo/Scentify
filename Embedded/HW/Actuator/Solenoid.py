import Jetson.GPIO as GPIO
import time

GPIO_SIG = 31
GPIO_GND = 33

GPIO.setmode(GPIO.BOARD)
GPIO.setup(GPIO_SIG, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(GPIO_GND, GPIO.OUT, initial=GPIO.LOW)

try:
    while True:
        GPIO.output(GPIO_SIG, GPIO.HIGH)
        GPIO.output(GPIO_GND, GPIO.LOW)
        time.sleep(2)

        GPIO.output(GPIO_SIG, GPIO.LOW)
        GPIO.output(GPIO_GND, GPIO.LOW)
        time.sleep(2)
except KeyboardInterrupt:
    print("Exiting")
    GPIO.cleanup()
