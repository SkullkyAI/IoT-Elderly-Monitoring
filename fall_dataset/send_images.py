import os
import glob
import time
import serial

from PIL import Image

ser = serial.Serial('COM3', 115200)

l_images = glob.glob('fall_dataset/images/*')

try:
    for image_path in l_images:

        with Image.open(image_path) as img:
            img_resized = img.resize((512, 512), Image.LANCZOS)
            
            basename = os.path.splitext(image_path)[0]
            resized_image_path = basename + '.jpg'
            img_resized.save(resized_image_path)

    while True:
        for image_path in l_images:
            while ser.out_waiting > 0:
                print("Waiting for empty buffer...")
                time.sleep(0.01)
            img_size = os.path.getsize(image_path)
            print(img_size)
            ser.write(img_size.to_bytes(4, byteorder='little'))
            with open(image_path, 'rb') as img_file:
                while True:
                    chunk = img_file.read(512)
                    if not chunk:
                        break
                    ser.write(chunk)
                    time.sleep(0.1)
            print("Image Sent")
except KeyboardInterrupt:
    pass
finally:
    ser.close()