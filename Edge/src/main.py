import asyncio

from ble import BLEManager
from chatbot import Chatbot

async def main():
    queue = asyncio.Queue()

    ble_manager = BLEManager(queue)
    chatbot = Chatbot(queue)

    asyncio.gather(
        ble_manager.run(),
        chatbot.run()
    )

if __name__ == "__main__":
    asyncio.run(main())
