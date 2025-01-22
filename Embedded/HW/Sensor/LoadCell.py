import time
import sys, os
import Jetson.GPIO as GPIO

from hx711v0_5_1 import HX711

READ_MODE_INTERRUPT_BASED = "--interrupt-based"
READ_MODE_POLLING_BASED = "--polling-based"

class LoadCell:
    def __init__(self, ):
        # GPIO.BOARD
        self.hx = HX711(31, 33)

        self.READ_MODE = READ_MODE_POLLING_BASED
        if len(sys.argv) > 1 and sys.argv[1] == READ_MODE_POLLING_BASED:
            self.READ_MODE = READ_MODE_POLLING_BASED
            print("[INFO] Read mode is 'polling based'.")
        else:
            print("[INFO] Read mode is 'interrupt based'.")

        self.initial_once_operation()

        referenceUnit = 108
        print(f"[INFO] Setting the 'referenceUnit' at {referenceUnit}.")
        self.hx.setReferenceUnit(referenceUnit)
        print(f"[INFO] Finished setting the 'referenceUnit' at {referenceUnit}.")

        if self.READ_MODE == READ_MODE_INTERRUPT_BASED:
            print("[INFO] Enabling the callback.")
            self.hx.enableReadyCallback(self.printAll)
            print("[INFO] Finished enabling the callback.")

    def initial_once_operation(self, ):
        self.hx.setReadingFormat("MSB", "MSB")

        print("[INFO] Automatically setting the offset.")
        self.hx.autosetOffset()
        offsetValue = self.hx.getOffset()
        print(f"[INFO] Finished automatically setting the offset. The new value is '{offsetValue}'.")

        print("[INFO] You can add weight now!")

    def operation(self, ):
        while True:
            try:
                if self.READ_MODE == READ_MODE_POLLING_BASED:
                    self.getRawBytesAndPrintAll()
                
            except (KeyboardInterrupt, SystemExit):
                GPIO.cleanup()
                print("[INFO] 'KeyboardInterrupt Exception' detected. Cleaning and exiting...")
                sys.exit()
            

    def printRawBytes(self, rawBytes):
        print(f"[RAW BYTES] {rawBytes}")

    def printLong(self, rawBytes):
        print(f"[LONG] {self.hx.rawBytesToLong(rawBytes)}")

    def printLongWithOffset(self, rawBytes):
        print(f"[LONG WITH OFFSET] {self.hx.rawBytesToLongWithOffset(rawBytes)}")

    def printWeight(self, rawBytes):
        print(f"[WEIGHT] {self.hx.rawBytesToWeight(rawBytes)} gr")

    def printAll(self, rawBytes):
        longValue = self.hx.rawBytesToLong(rawBytes)
        longWithOffsetValue = self.hx.rawBytesToLongWithOffset(rawBytes)
        weightValue = self.hx.rawBytesToWeight(rawBytes)
        print(f"[INFO] INTERRUPT_BASED | longValue: {longValue} | longWithOffsetValue: {longWithOffsetValue} | weight (grams): {weightValue}")

    def getRawBytesAndPrintAll(self, ):
        rawBytes = self.hx.getRawBytes()
        longValue = self.hx.rawBytesToLong(rawBytes)
        longWithOffsetValue = self.hx.rawBytesToLongWithOffset(rawBytes)
        weightValue = self.hx.rawBytesToWeight(rawBytes)
        print(f"[INFO] POLLING_BASED | longValue: {longValue} | longWithOffsetValue: {longWithOffsetValue} | weight (grams): {weightValue}")
    
if __name__ == '__main__':
    loadCell = LoadCell()
    loadCell.operation()