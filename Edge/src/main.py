import argparse
import asyncio

from bleak import BleakClient, BleakScanner
from bleak.backends.device import BLEDevice
import uuid

# Services
IMAGE_SERVICE_UUID = "0000181a-0000-1000-8000-00805f9b34fb"

# Characteristics
IMAGE_CHARACTERISTIC_UUID = "0000181a-0000-1000-8000-00805f9b34fc"

# Other Globals
DEVICE_NAME = "IoT9_ESP32"
START_MARKER = b'\xFF\xD8'
END_MARKER = b'\xFF\xD9'
image_buffer = bytearray()
transfer_complete = asyncio.Event()
inprogress_image = False

async def scan_devices(name: str = None, address: str = None) -> BLEDevice:
    if name:
        device = await BleakScanner.find_device_by_name(name)
        if device is None:
            print(f"could not find device with name '{name}'")
            return
    elif address:
        device = await BleakScanner.find_device_by_address(address)
        if device is None:
            print(f"could not find device with address '{address}'")
            return
    else:
        devices = await BleakScanner.discover()
        for idx, d in enumerate(devices):
            print(f"{idx}: {d}")
        idx = int(input(f"Select device number [0-{len(devices) - 1}]: "))
        device = devices[idx]
    
    return device

async def connect_to_characteristic(client: BleakClient, service_uuid: str, char_uuid: str):
    for service in client.services:
        print(f"[Service] {service.uuid}")
        if service.uuid == service_uuid:
            for char in service.characteristics:
                print(f"[Characteristic] {char.uuid}")
                if char.uuid == char_uuid:
                    print(f" -> Found target characteristic: {char.uuid}")
                    return char
            
            raise ValueError(f"Characteristic {char_uuid} not found in Service {service_uuid}")
        
    raise ValueError(f"Service {service_uuid} not found")

def send_image():
    with open("received_image.jpg", "wb") as f:
        f.write(image_buffer)
    print("Image saved as received_image.jpg")

def notification_handler(sender, data):
    global image_buffer, inprogress_image
    if not inprogress_image:
        if data[:2] != START_MARKER:
            return
        print("Receiving new image!")
        inprogress_image = True
    
    image_buffer.extend(data)

    if data[-2:] == END_MARKER:
        send_image()
        inprogress_image = False
        image_buffer.clear()
        print("Finished receiving")

async def main():
    # Scan for devices
    print("starting scan...")

    device = await scan_devices(name=DEVICE_NAME)

    if not device:
        return

    print(f"connecting to device {device}...")

    async with BleakClient(device, timeout=60.) as client:
        print("connected")
        
        try:
            char = await connect_to_characteristic(client, IMAGE_SERVICE_UUID, IMAGE_CHARACTERISTIC_UUID)

            if "notify" in char.properties:
                print(f"Subscribing to notifications from {char.uuid}")
                
                await client.start_notify(char.uuid, notification_handler)
                
                try:
                    await transfer_complete.wait()
                except KeyboardInterrupt:
                    print("Interrupted by user. Stopping notifications...")
                
                await client.stop_notify(char.uuid)
                output_file = "received_image.jpg"
                with open(output_file, "wb") as img_file:
                    img_file.write(image_buffer[:-3])
        
        except ValueError as e:
            print(e)

        print("disconnecting...")
    
    print("disconnected")


if __name__ == "__main__":
    asyncio.run(main())