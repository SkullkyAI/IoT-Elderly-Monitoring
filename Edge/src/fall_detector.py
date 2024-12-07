import asyncio
import torch

from ultralytics import YOLO

class FallDetector:
    def __init__(self, image_queue: asyncio.Queue, notification_queue: asyncio.Queue):
        self.image_queue = image_queue
        self.notification_queue = notification_queue

        self.model = YOLO('models/best_ncnn_model', task="detect")
    
    async def process_images(self):
        while True:
            try:
                image_path = await self.image_queue.get()
                if image_path is None:
                    break
                response = await self.detect_fall(image_path)
                if response:
                    asyncio.create_task(self.notification_queue.put(response))
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")

    async def detect_fall(self, image_path):
        responses = self.model.predict(image_path, max_det=1, classes=[0])
        if torch.any(responses[0].boxes.cls == 0.).item():
            return True
        else:
            return False
    