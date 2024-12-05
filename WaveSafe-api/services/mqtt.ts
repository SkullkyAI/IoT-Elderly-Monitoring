import { Client } from "https://deno.land/x/mqtt@0.1.2/deno/mod.ts";
import { MqttData, Notifications } from "../interfaces/data.interface.ts";
import { SurrealDbService } from "./surrealdb.ts";

export class MqttService {
  private client: Client;
  private notifications: Array<Notifications> = [];
  private surrealDbService: SurrealDbService;

  constructor(SS: SurrealDbService) {
    this.client = new Client({ url: "mqtt://test.mosquitto.org" });
    this.client.connect();
    this.iniciarEscucha();
    this.surrealDbService = SS;
  }

  private iniciarEscucha() {
    this.client.subscribe("elder/monitor");

    this.client.on("message", (topic: string, message: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const rawMessage = decoder.decode(message);
        const correctedMessage = rawMessage.replace(/'/g, '"');
        const data = JSON.parse(correctedMessage);
        console.log("Datos parseados:", data);

        // Verificar si los datos son válidos antes de procesarlos
        if (data) {
          this.surrealDbService.setMqttData(data);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje MQTT:", error);
        console.error("Mensaje original:", message);
      }
    });
  }
}
