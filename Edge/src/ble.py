from bleak import BleakClient, BleakScanner
from bleak.backends.device import BLEDevice

class BLEManager:
    # Services
    IMAGE_SERVICE_UUID = "0000181a-0000-1000-8000-00805f9b34fb"

    # Characteristics
    IMAGE_CHARACTERISTIC_UUID = "0000181a-0000-1000-8000-00805f9b34fc"

    # Other Globals
    DEVICE_NAME = "IoT9_ESP32"
    START_MARKER = b'\xFF\xD8'
    END_MARKER = b'\xFF\xD9'

    def __init__(self, queue):
        self.queue = queue
        self.image_buffer = bytearray()
        self.inprogress_image = False
        self.saved_image = "received_image.jpg"

        self.device = None

    async def run(self):
        # Scan devices
        print("starting scan")

        await self.scan_devices(self.DEVICE_NAME)

        if not self.device:
            return
        
        async with BleakClient(self.device, timeout=60.) as client:
            print("connected")
            
            try:
                char = await self.connect_to_characteristic(client, self.IMAGE_SERVICE_UUID, self.IMAGE_CHARACTERISTIC_UUID)

                if "notify" in char.properties:
                    print(f"Subscribing to notifications from {char.uuid}")

                    await client.start_notify(char.uuid, self.notification_handler)

                    try:
                        while True:
                            pass
                    except KeyboardInterrupt:
                        print("Interrupted by user. Stopping notifications...")
                    
                    await client.stop_notify(char.uuid)
            
            except ValueError as e:
                print(e)
            
            print("disconnecting...")
        
        print("disconnected")

    async def scan_devices(self, name: str = None, address: str = None) -> BLEDevice:
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
        
        self.device = device

    async def connect_to_characteristic(self, client: BleakClient, service_uuid: str, char_uuid: str):
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

    def save_image(self):
        with open(self.saved_image, "wb") as f:
            f.write(self.image_buffer)
        print("Image saved as received_image.jpg")
    
    async def notification_handler(self, sender, data):
        if not self.inprogress_image:
            if data[:2] != self.START_MARKER:
                return
            print("Receiving new image!")
            self.inprogress_image = True
        
        self.image_buffer.extend(data)

        if data[-2:] == self.END_MARKER:
            self.save_image()
            self.inprogress_image = False
            await self.queue.put(self.saved_image)
            self.image_buffer.clear()
            print("Finished receiving")
