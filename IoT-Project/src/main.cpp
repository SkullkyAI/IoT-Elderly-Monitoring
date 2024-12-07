#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <string>
#include "nvs_flash.h"

#include "utils.h"
#include "image_array1.h"
#include "image_array2.h"
#include "image_array3.h"

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
const unsigned char* images[] = {image1, image2, image3};
const unsigned int imageSizes[] = {image1_size, image2_size, image3_size};
uint8_t *imageData;
size_t imageSize = 0;
size_t imageIndex = 0;

class MyServerCallbacks: public BLEServerCallbacks {
  void onDisconnect(BLEServer* pServer) {
    deviceAdvertising->start();
  }
};

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
  imageServer->setCallbacks(new MyServerCallbacks());

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
}

void loop() {
  static unsigned int index = 0;
  
  sendImage(imageCharacteristic, images[index], imageSizes[index], 508, 10);
  index = (++index % 3);
  
  delay(4000);
}