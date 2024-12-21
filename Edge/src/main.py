import asyncio
import signal

from ble import BLEManager
from fall_detector import FallDetector
from mqtt import MqttClient

# Services
IMAGE_SERVICE_UUID = "0000181a-0000-1000-8000-00805f9b34fb"

# Characteristics
IMAGE_CHARACTERISTIC_UUID = "0000181a-0000-1000-8000-00805f9b34fc"

# Other Globals
DEVICE_NAME = "IoT9_ESP32"

async def main():
    image_path = "received_image.jpg"
    stop_event = asyncio.Event()
    
    def shutdown_handler():
        print()
        print("Shutdown signal received")
        stop_event.set()

    image_queue = asyncio.Queue()
    notification_queue = asyncio.Queue()
    ble_manager = BLEManager(image_path, image_queue)
    detector = FallDetector(image_queue, notification_queue)
    mqtt_client = MqttClient(notification_queue)
    try:
        loop = asyncio.get_running_loop()
        loop.add_signal_handler(signal.SIGINT, shutdown_handler)
        loop.add_signal_handler(signal.SIGTERM, shutdown_handler)
        
        print(f"Connecting to {DEVICE_NAME}...")
        connected = await ble_manager.scan_devices(DEVICE_NAME)
        if not connected:
            return
        await ble_manager.connect_client(IMAGE_SERVICE_UUID, IMAGE_CHARACTERISTIC_UUID)
        print("BLE Client connected. Press Ctrl+C to exit")
        
        asyncio.create_task(detector.process_images())
        asyncio.create_task(mqtt_client.send_loop())

        await stop_event.wait()
    finally:
        print(f"Disconnecting from {DEVICE_NAME} and from broker")
        await ble_manager.disconnect_client()
        mqtt_client.disconnect()
        print("Disconnected")

if __name__ == "__main__":
    asyncio.run(main())
