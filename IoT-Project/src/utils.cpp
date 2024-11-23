#include "utils.h"

void sendImage(BLECharacteristic *pCharacteristic, const unsigned char* image, size_t image_size, size_t chunkSize, uint32_t delayTime) {
    Serial.println("Sending Image");
    for (size_t i = 0; i < image_size; i += chunkSize) {
        size_t remaining = image_size - i;
        size_t sendSize = (remaining > chunkSize) ? chunkSize : remaining;
        pCharacteristic->setValue((uint8_t*)&image[i], sendSize);
        pCharacteristic->notify();
        delay(delayTime);
    }
    Serial.println("Image Sent");
}