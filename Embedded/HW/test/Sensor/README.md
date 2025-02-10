# HW Configuration
HW/Sensor 디렉터리의 Readme는 하드웨어 센서들의 핀 커넥터를 위해서 만들어진 파일이다.

## GSAT-P110 + ADC0834

* 여기서 Pin으로 쓴 것은 Jetson Orin Nano의 핀이다.

### GSAT-P110
| **GSAT-P110 핀** | **설명**                  | **Other**                  |
|------------------|---------------------------|----------------------------|
| VCC              | 전원 입력                 | Pin 1 (3.3 V)              |
| GND              | 그라운드                  | ADC 0834 GND               |
| Vout             | 아날로그 입력 채널        | ADC 0834 CH0               |

### ADC0834
| **ADC0834 핀**   | **설명**                  | **Other**                  |
|------------------|---------------------------|----------------------------|
| VCC, VREF, V+    | 전원 입력                 | Pin 1 (3.3V)               |
| DGND, AGND       | 그라운드                  | Pin 6 (GND)                |
| CH0              | 아날로그 입력 채널        | GSAT-P110 Vout              |
| CS               | 칩 선택                   | Pin24 (SPI ChipSelect)     |
| CLK              | 클록 신호 입력            | Pin23 (SPI SCLK)           |
| DO               | 데이터 출력 (ADC → Jetson)| Pin19 (SPI MISO)           |
| DI               | 데이터 입력 (Jetson → ADC)| Pin19 (SPI MOSI)           |


## LoadCell + HX711

- 꼭 HX711과 Jetson Orin Nano는 3.3V로 공급해주자.

### LoadCell
| **LoadCell 핀**   | **설명**                  | **HX711 핀**                  |
|------------------|---------------------------|----------------------------|
| E+               | (Excitation, VCC)         | E+                         |
| E-               | (Excitation, GND)         | E-                         |
| S+               | (Signal+, OUT+)           | A+                         |
| S-               | (Signal-, OUT-)           | A-                         |

### HX711
| **HX711 핀**      | **설명**                  | **Jetson Orin Nano핀**           |
|------------------|---------------------------|----------------------------|
| VCC               | Vcc                       | Pin 1 (3.3V)               |
| GND               | Ground                    | Pin 6 (GND)                |
| DT                | Sensor Data               | Pin 31 (GPIO 11)           |
| SCK               | Clock                     | Pin 33 (GPIO 13)           |


## DHT 11
DHT11 은 Raspberry Pi에 연결하자.
### DHT 11
| **DHT 11 핀**      | **설명**                  | **Raspberry Pi 5핀**           |
|------------------|---------------------------|----------------------------|
| VCC               | Vcc                       | Pin 1 (3.3V)               |
| GND               | Ground                    | Pin 6 (GND)                |
| Vout                | Sensor Data               | Pin 8 (GPIO 14)           |