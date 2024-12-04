import { Client } from 'https://deno.land/x/mqtt/deno/mod.ts';

export class MqttService {
    private client: Client;

    constructor() {
        this.client = new Client({ url: 'mqtt://test.mosquitto.org' });
        this.client.connect();
        this.iniciarEscucha();
    }

    private iniciarEscucha() {
        // Suscribirse al topic
        this.client.subscribe('elder/monitor');
        
        // Configurar el manejador de mensajes
        this.client.on('message', (topic: string, message: Uint8Array) => {
            console.log(message);
            this.recibe(topic, message);
        });
    }

    recibe(topic: string, message: Uint8Array) {
        console.log(`Mensaje recibido: ${new TextDecoder().decode(message)} en el topic ${topic}`);
        // Aquí puedes agregar la lógica adicional para procesar los mensajes
    }
}