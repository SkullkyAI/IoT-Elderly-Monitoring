# IoT-Elderly-Monitoring

An IoT system for monitoring elderly individuals by detecting unusual movement and sound. The system consists of multiple components working together:

## System Components

1. **IoT Device (ESP32)**
- Located in [IoT-Project/](IoT-Project/)
- Uses Arduino framework with ESP32 microcontroller
- Captures and sends images via BLE
- Configure and build using PlatformIO:
```bash
cd IoT-Project/
pio run
```

2. **Web Application (Angular)**
- Located in [WaveSafe/](WaveSafe/)
- Frontend interface for monitoring
- Installation:
```bash
npm install -g @angular/cli
cd WaveSafe/
npm install
ng serve -o
```

3. **Backend API (Deno)**
- Located in [WaveSafe-api/](WaveSafe-api/)
- Handles data processing and business logic
- Installation & running:
```bash
cd WaveSafe-api/
# Create .env file with required environment variables
deno task dev
```

4. **Database (SurrealDB)**
- Stores monitoring data and user information
- Start the database:
```bash
surreal start -A --log debug surrealkv://./database/surrealdb.db
```

## Prerequisites

- Node.js & npm
- Angular CLI
- Deno 2.0+
- SurrealDB
- PlatformIO (for ESP32 development)
- Python dependencies:
```bash
pip install -r requirements.txt
```

## Getting Started

1. Clone the repository
2. Setup database by running SurrealDB
3. Start the backend API server
4. Launch the Angular frontend
5. Flash the ESP32 device with the IoT code

## Development Workflow

1. **IoT Device Development**
- Use PlatformIO in Visual Studio Code
- Code is in [IoT-Project/src/](IoT-Project/src/)
- Main device code: [main.cpp](IoT-Project/src/main.cpp)

2. **Frontend Development**
- Angular project in [WaveSafe/](WaveSafe/)
- Development server at http://localhost:4200

3. **Backend Development**
- Deno server in [WaveSafe-api/](WaveSafe-api/)
- Development mode with auto-reload: `deno task dev`

## Configuration

- ESP32: Update BLE settings in [IoT-Project/src/main.cpp](IoT-Project/src/main.cpp)
- Backend: Create `.env` file in WaveSafe-api/
- Database: Configure connection settings

## Note

- The system processes images and sound data from the IoT device
- Uses BLE for communication between ESP32 and backend
- Implements fall detection and sound monitoring
- Stores monitoring data in SurrealDB

## Project Structure

```
.
├── AudioProcessor/         # Audio processing components
├── Edge/                  # Edge computing models
├── IoT-Project/          # ESP32 device code
├── WaveSafe/             # Angular frontend
├── WaveSafe-api/         # Deno backend
└── database/             # Database files
```
