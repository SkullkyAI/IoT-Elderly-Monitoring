#include "utils.h"

void sendImage(BLECharacteristic *pCharacteristic, const unsigned char* image, size_t image_size, size_t chunkSize, uint32_t delayTime) {
    Serial.println("Sending Image");

    const size_t indexSize = 4;
    const size_t totalChunkSize = indexSize + chunkSize;
    uint8_t* chunk = new uint8_t[totalChunkSize];

    for (size_t i = 0; i < image_size; i += chunkSize) {
        size_t remaining = image_size - i;
        size_t dataSize = (remaining > chunkSize) ? chunkSize : remaining;

        uint32_t index = i / chunkSize;
        chunk[0] = (index >> 24);
        chunk[1] = (index >> 16);
        chunk[2] = (index >> 8);
        chunk[3] = index & 0xFF;

        memcpy(chunk + indexSize, &image[i], dataSize);

        pCharacteristic->setValue(chunk, dataSize + indexSize);
        pCharacteristic->notify();
        delay(delayTime);
    }
    Serial.println("Image Sent");
}