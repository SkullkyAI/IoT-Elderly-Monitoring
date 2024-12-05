import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
import random
import time
import asyncio
import json

class MqttClient:
    BROKER = "test.mosquitto.org"
    PORT = 1883
    TOPIC = "elder/monitor"
    CLIENT_ID = f"python-mqtt-{random.randint(0, 1000)}"
    USERNAME = None
    PASSWORD = None
    FALL_ALERT = "SA CAÍDO, NO ES UN SIMULACRO, SA CAÍDO"
    PERIODIC_PAYLOAD = "todo en orden, nada que reportar"

    def __init__(self, notification_queue):
        self.notification_queue = notification_queue

        self.client = mqtt.Client(client_id=self.CLIENT_ID, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
        self.client.connect_timeout = 30
        
        if self.USERNAME and self.PASSWORD:
            self.client.username_pw_set(self.USERNAME, self.PASSWORD)
        
        def on_connect(client, userdata, flags, rc, properties):
            if rc == 0:
                print("Connected to MQTT broker!")
            else:
                print(f"Failed to connect, return code {rc}")

        self.client.on_connect = on_connect
        
        print("[MQTT]: Connecting to broker...")
        self.client.connect(self.BROKER, self.PORT)

        self.patient_state = {
            "idPacient": str(random.randint(1, 13)),
            "isFallen": False,
            "time_movement": random.randint(0, 3600)
        }

    async def send_loop(self):
        while True:
            now = datetime.now()
            next_hour = (now + timedelta(minutes=1)).replace(second=0, microsecond=0)
            time_until_next_hour = (next_hour - now).total_seconds()
            self.patient_state["time_movement"] = random.randint(0, 3600)

            try:
                fallen = await asyncio.wait_for(self.notification_queue.get(), timeout=time_until_next_hour)

                if fallen: # Should always enter, but here it is just in case
                    print(f"Fall detected, publishing patient state")
                    self.patient_state["isFallen"] = True
                    self.send_message(self.patient_state)
                    self.patient_state["isFallen"] = False
            except asyncio.TimeoutError:
                print(f"No fall detected, publishing periodic message at {datetime.now()}")
                self.send_message(self.patient_state)

    def send_message(self, message):
        payload = json.dumps(message)
        result = self.client.publish(self.TOPIC, payload)
        status = result[0]
        if status == 0:
            print(f"Sent '{payload}' to topic {self.TOPIC}")
        else:
            print(f"Failed to send message to topic {self.TOPIC}")
    
    def disconnect(self):
        print("Stopping client...")
        self.client.loop_stop()
        self.client.disconnect()

if __name__ == "__main__":
    c = MqttClient(2)
    while True:
        state = {
            "idPacient": str(random.randint(1, 13)),
            "isFallen": True,
            "time_movement": random.randint(0, 3600)
        }
        c.send_message(state)
        time.sleep(10)
