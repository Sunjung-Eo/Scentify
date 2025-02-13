import Jetson.GPIO as GPIO
import time

class StinkSensor:
    def __init__(self, cs: int = 24, clk: int = 23, dio: int = 19, frequency: int = 50_000) -> None:
        self.cs = cs
        self.clk = clk
        self.dio = dio
        self.frequency = frequency
        self.window_size = 10
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.cs, GPIO.OUT)
        GPIO.setup(self.clk, GPIO.OUT)

    def read_adc0834(self, channel: int = 0) -> int:
        # Set CS pin to low to enable the ADC
        GPIO.output(self.cs, 0)

        # Set DIO pin to output to setup the ADC to read from the specified channel
        GPIO.setup(self.dio, GPIO.OUT)

        # Start bit
        self._set_clock_low()
        GPIO.output(self.dio, 1)
        self._set_clock_high()

        # SGL/DIF
        self._set_clock_low()
        GPIO.output(self.dio, 1)
        self._set_clock_high()

        # ODD/SIGN
        self._set_clock_low()
        GPIO.output(self.dio, channel % 2)
        self._set_clock_high()

        # SELECT1
        self._set_clock_low()
        GPIO.output(self.dio, int(channel > 1))
        self._set_clock_high()

        # Allow the MUX to settle for 1/2 clock cycle
        self._set_clock_low()

        # Switch DIO pin to input to read data
        GPIO.setup(self.dio, GPIO.IN)

        # Read data from MSB to LSB
        val1 = 0
        for i in range(0, 8):
            self._set_clock_high()
            self._set_clock_low()
            val1 = val1 << 1
            val1 = val1 | GPIO.input(self.dio)

        # Read data from LSB to MSB
        val2 = 0
        for i in range(0, 8):
            bit = GPIO.input(self.dio) << i
            val2 = val2 | bit
            self._set_clock_high()
            self._set_clock_low()

        # Set CS pin to high to clear all internal registers
        GPIO.output(self.cs, 1)

        # Done reading, set DIO pin back to output
        GPIO.setup(self.dio, GPIO.OUT)

        # Compare the two values to ensure they match
        if val1 == val2:
            return val1
        else:
            return 0

    def _set_clock_high(self):
        GPIO.output(self.clk, GPIO.HIGH)
        self._tick()

    def _set_clock_low(self):
        GPIO.output(self.clk, GPIO.LOW)
        self._tick()

    def _tick(self):
        period = 1 / self.frequency
        period_half = period / 2
        time.sleep(period_half)

    def read_avg_data(self,):
        sum_adc = 0
        for _ in range(self.window_size):
            adc_value = self.read_adc0834()
            sum_adc += adc_value
        sum_adc /= self.window_size
        
        return round(sum_adc, 1)
        
if __name__ == '__main__':
    stink_sensor = StinkSensor()
    while True:
        adc = stink_sensor.read_avg_data()
        print(f'adc : {adc}')
        time.sleep(1)
