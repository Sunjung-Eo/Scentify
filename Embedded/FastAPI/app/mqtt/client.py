from fastapi_mqtt import FastMQTT, MQTTConfig
import json

# MQTT 설정
mqtt_config = MQTTConfig(
    host="localhost",  # MQTT 브로커 주소
    # port=,        # MQTT 브로커 포트
)

# FastMQTT 인스턴스 생성
mqtt_client = FastMQTT(config=mqtt_config)

# MQTT 연결 이벤트 핸들러
@mqtt_client.on_connect()
def connect(client): # MQTT로부터 추가 정보 받으면 파라미터 추가 가능(flags, rc, properties 등등)
    print("Connection Success")
    # fastapi에서 토픽 구독을 한다면 여기에 추가

# MQTT 메시지 수신 핸들러
@mqtt_client.on_message()
async def message_handler(payload): # MQTT로부터 추가 정보 받으면 파라미터 추가 가능(client,topic, qos, properties 등등)
    try:    
        data = json.loads(payload.decode()) # MQTT는 JSON형식으로 전송하더라도 Byte형태로 전달 => 변환 필요
        
        # type을 통해 수신한 json 데이터 분류
        message_type = data.get("type")
        
        if message_type:
            pass

        #MQTT로 메세지 보내기
        # mqtt_client.publish(message_dict)

            
    # 예외처리
    except Exception as e:
        print(f"Error processing MQTT message: {str(e)}")