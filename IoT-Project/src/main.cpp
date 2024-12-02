#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <string>
#include "nvs_flash.h"

#include "utils.h"
#include "image_array1.h"

#define LED_BUILTIN 2

BLEServer *imageServer = NULL;

// Services
#define IMAGE_SERVICE_UUID "0000181a-0000-1000-8000-00805f9b34fb" // Environmental Sensing Service (ESS) UUiD: 0x181A
BLEService *imageService = NULL;

// Characteristics
#define IMAGE_CHARACTERISTIC_UUID "0000181a-0000-1000-8000-00805f9b34fc" // Body Composition Service (BCS) UUID: 0x181B
BLECharacteristic *imageCharacteristic = NULL;

// Advertising
BLEAdvertising *deviceAdvertising = NULL;

// Other Globals
const std::string DEVICE_NAME = "IoT9_ESP32";
const uint8_t END_MARKER[] = { 0xFF, 0xFF, 0xFF };
uint8_t *imageData;
size_t imageSize = 0;
size_t imageIndex = 0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);

  // Clean
  esp_err_t err = nvs_flash_init();
  if (err == ESP_ERR_NVS_NO_FREE_PAGES || err == ESP_ERR_NVS_NEW_VERSION_FOUND) {
    ESP_ERROR_CHECK(nvs_flash_erase());
    err = nvs_flash_init();
  }
  
  // Initialize BLE Device
  BLEDevice::init(DEVICE_NAME);
  imageServer = BLEDevice::createServer();

  // Main Service
  imageService = imageServer->createService(IMAGE_SERVICE_UUID);

  // Main Characteristic
  imageCharacteristic = imageService->createCharacteristic(
                          IMAGE_CHARACTERISTIC_UUID,
                          BLECharacteristic::PROPERTY_NOTIFY
                        );
  
  // Start Advertising BLE
  imageService->start();
  deviceAdvertising = BLEDevice::getAdvertising();
  deviceAdvertising->start();

  std::string message = "BLE device is now advertising with name: " + DEVICE_NAME;
  Serial.println(message.c_str());

  // Initialize image buffer to a fixed size
  imageData = (uint8_t *)malloc(512 * 512);
}

void loop() {
  static unsigned long lastAdvertisingTime = 0;
  static bool imageReady = false;

  if (millis() - lastAdvertisingTime > 10000) {
    deviceAdvertising->start();
    //Serial.println("Advertising again...");
    lastAdvertisingTime = millis();
  }

  if (Serial.available() > 0) {
    uint8_t chunk[512];
    int bytesRead = Serial.readBytes(chunk, 512);

    for (int i = 0; i < bytesRead; i++) {
      if (imageSize == 0) {
        if (imageIndex < 4) {
          imageSize |= (size_t)chunk[i] << (8 * imageIndex);
          imageIndex;
        }
      } else {
        if (imageIndex < imageSize) {
          imageData[imageIndex++] = chunk[i];
        }
      }
    }
    if (imageIndex >= imageSize) {
      imageIndex = 0;
      imageSize = 0;
      imageReady = true;
    }
  }
  
  if (imageReady) {
    sendImage(imageCharacteristic, image, image_size, 508, 10);
    imageReady = false;
  }
  
  delay(100);
}