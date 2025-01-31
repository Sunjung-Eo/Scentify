import spidev
import time


class StinkSensor:
    def __init__(self, ):
        self.spi = spidev.SpiDev()
        self.spi.open(0, 0)  
        self.spi.max_speed_hz = 10000
        self.channel = 0
        self.window_size = 10

    def read_adc0834(self):
        if self.channel < 0 or self.channel > 3:
            raise ValueError("Channel must be 0-3")
        
        start_bit = 1
        single_ended = 1
        config_bits = (single_ended << 2) | (self.channel >> 1)
        command = [start_bit, (config_bits << 4) | ((self.channel & 1) << 3)]
        
        adc_response = self.spi.xfer2(command)
        adc_value = ((adc_response[0] & 0x01) << 7) | (adc_response[1] >> 1)
        return adc_value, (adc_value / 255.0) * 3.3

    def read_avg_data(self,):
        sum_adc, sum_voltage = 0.0, 0.0
        for _ in range(self.window_size):
            adc_value, voltage = self.read_adc0834()
            sum_adc += adc_value
            sum_voltage += voltage
        sum_adc /= self.window_size
        sum_voltage /= self.window_size
        
        return round(sum_adc, 1), round(sum_voltage, 1)
        
if __name__ == '__main__':
    stink_sensor = StinkSensor()
    while True:
        adc, voltage = stink_sensor.read_avg_data()
        print(f'adc : {adc}, voltage : {voltage} ')
        time.sleep(2)
