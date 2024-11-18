import { Buffer } from "node:buffer";
import { MqttClient, connect, IClientOptions } from "npm:mqtt";

export class MqttService {
    private client: MqttClient | null = null;
    private readonly brokerUrl = "ws://localhost:9001";
    private readonly options:IClientOptions = {
        keepalive: 60,
        clientId: "wavesafe_" + crypto.randomUUID().substring(0, 8),
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
    };

    async connect() {
        this.client = await connect(this.brokerUrl, this.options);

        this.client.on("connect", () => {
            console.log("Connected to MQTT broker");
        });

        this.client.on("error", (error: Error) => {
            console.error("MQTT connection error:", error);
        });
    }

    subscribe(topic: string, callback: (message: string) => void) {
        if (this.client) {
            this.client.subscribe(topic);
            this.client.on("message", (receivedTopic: string, message: Buffer) => {
                if (receivedTopic === topic) {
                    callback(message.toString());
                }
            });
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
        }
    }
}
