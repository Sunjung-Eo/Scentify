import time
import sys, os

import Jetson.GPIO as GPIO

from HX711Driver import HX711

READ_MODE_INTERRUPT_BASED = "--interrupt-based"
READ_MODE_POLLING_BASED = "--polling-based"

class LoadCell:
    def __init__(self, pin_dt, pin_sck):
        self.window_size = 30
        self.pin_dt = pin_dt
        self.pin_sck = pin_sck

        self.hx = HX711(self.pin_dt, self.pin_sck)

        self.READ_MODE = READ_MODE_POLLING_BASED

        self.initial_once_operation()

        referenceUnit = 110
        print(f"[INFO] Setting the 'referenceUnit' at {referenceUnit}.")
        self.hx.setReferenceUnit(referenceUnit)
        print(f"[INFO] Finished setting the 'referenceUnit' at {referenceUnit}.")

    def initial_once_operation(self, ):
        self.hx.setReadingFormat("MSB", "MSB")

        print("[INFO] Automatically setting the offset.")
        self.hx.autosetOffset()
        offsetValue = self.hx.getOffset()
        print(f"[INFO] Finished automatically setting the offset. The new value is '{offsetValue}'.")

        print("[INFO] You can add weight now!")

    def get_initial_weight(self, ):
        self.hx.setReadingFormat("MSB", "MSB")

        print("[INFO] Automatically setting the offset.")
        self.hx.autosetOffset()
        offsetValue = self.hx.getOffset()
        print(f"[INFO] Finished automatically setting the offset. The new value is '{offsetValue}'.")

        print("[INFO] You can add weight now!")

    def get_weight_avg(self, ):
        try:
            sum = 0
            for _ in range(self.window_size):
                sum += self.get_weight()
            sum /= self.window_size
            return round(sum, 1)
        except (KeyboardInterrupt, SystemExit):
            GPIO.cleanup()
            print("[INFO] 'KeyboardInterrupt Exception' detected. Cleaning and exiting...")
            sys.exit()

    def get_weight(self, ):
        rawBytes = self.hx.getRawBytes()
        weightValue = self.hx.rawBytesToWeight(rawBytes)
        # print(f"weight (grams): {weightValue}")
        return round(weightValue, 1)
    
if __name__ == '__main__':
    loadCell = LoadCell(pin_dt=31, pin_sck=33)
    while True:
        print(f'weight : {loadCell.get_weight_avg()} grams')