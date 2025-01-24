
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
 
def get_send_frame(destination, msg):
    return (
        "SEND\n"
        f"destination:{destination}\n"
        "content-type:text/plain\n"
        f'{msg}\x00'
    )