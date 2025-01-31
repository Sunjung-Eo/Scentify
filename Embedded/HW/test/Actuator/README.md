# HW Configuration
HW/Actuator 디렉터리의 Readme는 솔레노이드 모터 제어를 위한 핀 커넥터를 위해서 만들어진 파일이다.

## L298N Motor Driver
| **L298N 핀**   | **설명**                  | **Other**                  |
|------------------|---------------------------|----------------------------|
| VCC (12V)        | 전원 입력                 | 12V 외부 전원               |
| GND              | 그라운드                  | GND                         |
| IN1              | 모터 A Input 1            | Pin 31 (GPIO 11)           |
| IN2              | 모터 A Input 2            | Pin 33 (GPIO 13)           |
| OUT1             | 출력 1                    | 솔레노이드 +극              |
| OUT2             | 출려 2                    | 솔레노이드 -극              |
