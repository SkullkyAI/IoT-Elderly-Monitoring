#include <Arduino.h>
#include <BLEPeripheral.h>
#include <Ticker.h>

// LED pins
#define LED1 2
#define LED2 3
#define LED3 4
#define LED4 5

// BLE setup
BLEPeripheral blePeripheral;    

// Use the generated UUID for the BLE service
BLEService bleService("671da122-ba08-4a31-85cc-bb3760382d6f");  // Custom service UUID

// Create a BLE characteristic with NOTIFY property and an example characteristic UUID
BLECharacteristic bleCharacteristic("87654321-4321-8765-4321-fedcba987654", BLERead | BLENotify, 20);
BLEDescriptor cccdDescriptor("2902", "CCCD");

// Ticker for interrupt
Ticker ticker;
volatile bool updateValue = false;

// Function to toggle LED and set notification flag
void toggleLED() {
  static bool ledState = false;
  digitalWrite(LED1, ledState);
  ledState = !ledState;
  updateValue = true;
}

void setup() {
  // Initialize LEDs
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);

  // BLE setup
  blePeripheral.setLocalName("NRF52-Peripheral");
  blePeripheral.setAdvertisedServiceUuid(bleService.uuid());

  // Add characteristic and descriptor
  bleService.addCharacteristic(bleCharacteristic);
  bleCharacteristic.addDescriptor(cccdDescriptor);
  blePeripheral.addAttribute(bleService);

  // Start BLE advertising
  blePeripheral.begin();
  
  // Ticker to toggle LED every 1 second
  ticker.attach(1.0, toggleLED);

  Serial.begin(9600);
  Serial.println("BLE Peripheral Ready and Advertising...");
}

void loop() {
  blePeripheral.poll();

  if (updateValue) {
    // Generate a random value to notify
    uint8_t value[2] = { random(0, 100), random(0, 100) };
    bleCharacteristic.setValue(value, sizeof(value));

    Serial.print("Notifying value: ");
    Serial.print(value[0]);
    Serial.print(", ");
    Serial.println(value[1]);

    updateValue = false;
  }
}
