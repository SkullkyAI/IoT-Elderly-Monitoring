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

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);

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
}

void loop() {
  static unsigned long lastAdvertisingTime = 0;

  if (millis() - lastAdvertisingTime > 10000) {
    deviceAdvertising->start();
    Serial.println("Advertising again...");
    lastAdvertisingTime = millis();
  }
  sendImage(imageCharacteristic, image, image_size, 508, 10);
  delay(100);
}