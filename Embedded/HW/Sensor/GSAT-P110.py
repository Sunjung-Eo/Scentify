import spidev
import time

spi = spidev.SpiDev()
spi.open(0, 0)  
spi.max_speed_hz = 10000

def read_adc0834(channel):
    if channel < 0 or channel > 3:
        raise ValueError("Channel must be 0-3")
    
    start_bit = 1
    single_ended = 1
    config_bits = (single_ended << 2) | (channel >> 1)
    command = [start_bit, (config_bits << 4) | ((channel & 1) << 3)]
    
    adc_response = spi.xfer2(command)
    adc_value = ((adc_response[0] & 0x01) << 7) | (adc_response[1] >> 1)
    return adc_value

channel = 0
while True:
    value = read_adc0834(channel)
    voltage = (value / 255.0) * 3.3  
    print(f"ADC Value: {value}, Voltage: {voltage:.2f}V")
    time.sleep(0.5)
