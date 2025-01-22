import asyncio
import logging
from src.websocket_server import WebSocketServer

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def main():
    server = WebSocketServer()
    await server.start()

if __name__ == "__main__":
    asyncio.run(main())
