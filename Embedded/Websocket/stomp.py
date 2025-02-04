def get_connect_frame(host):
    return (
        "CONNECT\n"
        "accept-version:1.1\n"
        f"host:{host}\n"
        "\n\x00"
    )   
    


def get_subscribe_frame(id, destination):
    return  (
        "SUBSCRIBE\n"
        f"id:{id}\n"
        f"destination:{destination}\n"
        "ack:auto\n"
        "\n\x00"
    )

def parse_stomp_message(stomp_message):
    """STOMP 메시지를 Header와 Body로 파싱하는 함수"""
    lines = stomp_message.split("\n")  # 개행 기준으로 나누기

    headers = {}
    body = None
    is_body = False

    for line in lines:
        if line.strip() == "":  # 빈 줄을 만나면 Body 시작
            is_body = True
            continue
        
        if is_body:
            body = line.strip().split("\x00")[0] # Body 부분 (JSON)
            print(body)
            break
        else:
            key_value = line.split(":", 1)  # "key: value" 형태 분리
            if len(key_value) == 2:
                headers[key_value[0].strip()] = key_value[1].strip()

    return headers, body

 
# TODO: Send에 Error 있음
# def get_send_frame(destination, msg):
#     return (
#         "SEND\n"
#         f"destination:{destination}\n"
#         "content-type:text/plain\n"
#         f'{msg}\x00'
#     )