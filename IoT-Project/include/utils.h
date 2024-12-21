#ifndef UTILS_H
#define UTILS_H

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

void sendImage(BLECharacteristic*, const unsigned char*, size_t, size_t, uint32_t);

#endif // UTILS_H