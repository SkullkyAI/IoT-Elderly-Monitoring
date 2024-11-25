import { Buffer } from "node:buffer";
import { MqttClient, connect, IClientOptions } from "npm:mqtt";
import { EventEmitter } from "node:events";

interface MqttMessage {
    topic: string;
    payload: string;
    timestamp: Date;
}

export class MqttService extends EventEmitter {
    private client: MqttClient | null = null;
    private readonly brokerUrl = "ws://localhost:9001";
    private readonly options: IClientOptions = {
        keepalive: 60,
        clientId: `wavesafe_${crypto.randomUUID().substring(0, 8)}`,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false // Add if using self-signed certificates
    };

    constructor() {
        super();
    }

    async connect(): Promise<void> {
        try {
            this.client = await connect(this.brokerUrl, this.options);
            this.setupEventHandlers();
        } catch (error) {
            console.error("Connection failed:", error);
            await this.reconnect();
        }
    }

    private setupEventHandlers(): void {
        if (!this.client) return;

        this.client.on("connect", () => {
            console.log("Connected to MQTT broker");
            this.client.emit("connected");
        });

        this.client.on("error", (error: Error) => {
            console.error("MQTT connection error:", error);
            this.client.emit("error", error);
        });

        this.client.on("close", () => {
            console.log("MQTT connection closed");
            this.client.emit("disconnected");
        });
    }

    private async reconnect(): Promise<void> {
        console.log("Attempting to reconnect...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.connect();
    }

    subscribe(topic: string, callback: (message: MqttMessage) => void): void {
        if (!this.client) {
            throw new Error("Client not connected");
        }

        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error(`Subscribe error for topic ${topic}:`, err);
                return;
            }
            console.log(`Subscribed to ${topic}`);
        });

        this.client.on("message", (receivedTopic: string, message: Buffer) => {
            if (receivedTopic === topic) {
                const mqttMessage: MqttMessage = {
                    topic: receivedTopic,
                    payload: message.toString(),
                    timestamp: new Date()
                };
                callback(mqttMessage);
                this.client.emit("message", mqttMessage);
            }
        });
    }

    publish(topic: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                reject(new Error("Client not connected"));
                return;
            }

            this.client.publish(topic, message, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    disconnect(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.client) {
                resolve();
                return;
            }

            this.client.end(false, {}, () => {
                this.client = null;
                resolve();
            });
        });
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}
