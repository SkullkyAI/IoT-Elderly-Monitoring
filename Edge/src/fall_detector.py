import os
import asyncio
from dotenv import load_dotenv

from PIL import Image
import google.generativeai as genai

class FallDetector:
    def __init__(self, image_queue: asyncio.Queue):
        self.image_queue = image_queue
        
        load_dotenv()
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel(model_name='gemini-1.5-flash')
    
    async def process_images(self):
        # while True:
            try:
                image_path = await self.image_queue.get()
                # if image_path is None:
                #     break
                image = Image.open(image_path)
                response = self.detect_fall(image)
                print(response)
                image.close()
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")

    def detect_fall(self, image):
        prompt = [image,
                  "Detect if the person in the image has fallen or not.",
                  "Always respond with a single word: 'Yes' or 'No'."]
        response = self.model.generate_content(prompt)
        try:
            response = response.candidates[0].content.parts[0].text.strip()
            return response.lower() == 'yes'
        
        except (IndexError, AttributeError) as e:
            print("Error extracting response text:", e)
            return None
