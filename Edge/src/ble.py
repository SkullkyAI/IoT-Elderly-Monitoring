import asyncio

from bleak import BleakClient, BleakScanner

class BLEManager:

    START_MARKER = b'\xFF\xD8'
    END_MARKER = b'\xFF\xD9'

    def __init__(self, image_path, image_queue: asyncio.Queue):
        self.image_buffer = {}
        self.inprogress_image = False
        self.image_path = image_path
        self.image_queue = image_queue

        self.device = None
        self.client = None

    async def connect_client(self, service_uuid, char_uuid):
        self.client = BleakClient(self.device, timeout=60.)
        await self.client.connect()
        self.char = await self.connect_to_characteristic(self.client, service_uuid, char_uuid)

        if "notify" in self.char.properties:
            await self.client.start_notify(self.char.uuid, self.notification_handler)
    
    async def disconnect_client(self):
        if self.client:
            if self.client.is_connected:
                await self.client.disconnect()
            self.client = None

    async def scan_devices(self, name: str = None, address: str = None) -> bool:
        if name:
            device = await BleakScanner.find_device_by_name(name, timeout=30)
            if device is None:
                print(f"Could not find device with name '{name}'")
                return False
        elif address:
            device = await BleakScanner.find_device_by_address(address, timeout=30)
            if device is None:
                print(f"Could not find device with address '{address}'")
                return False
        else:
            devices = await BleakScanner.discover(timeout=30)
            for idx, d in enumerate(devices):
                print(f"{idx}: {d}")
            idx = int(input(f"Select device number [0-{len(devices) - 1}]: "))
            device = devices[idx]
        
        self.device = device
        return True

    async def connect_to_characteristic(self, client: BleakClient, service_uuid: str, char_uuid: str):
        for service in client.services:
            if service.uuid == service_uuid:
                for char in service.characteristics:
                    if char.uuid == char_uuid:
                        return char
                
                raise ValueError(f"Characteristic {char_uuid} not found in Service {service_uuid}")
            
        raise ValueError(f"Service {service_uuid} not found")

    def save_image(self, image):
        with open(self.image_path, "wb") as f:
            f.write(image)
    
    def notification_handler(self, sender, data):
        INDEX_SIZE = 4
        DATA_START = INDEX_SIZE

        if not self.inprogress_image:
            if data[DATA_START:DATA_START + 2] != self.START_MARKER:
                return
            print("Receiving new image!")
            self.inprogress_image = True
        
        index = int.from_bytes(data[:INDEX_SIZE], byteorder='little')
        image_data = data[DATA_START:]
        self.image_buffer[index] = image_data

        if data[-2:] == self.END_MARKER:
            print("Finished receiving")
            self.inprogress_image = False

            full_image = bytearray()
            for i in sorted(self.image_buffer.keys()):
                full_image.extend(self.image_buffer[i])
            
            self.save_image(full_image)

            asyncio.create_task(self.image_queue.put(self.image_path))
            
            self.image_buffer.clear()
