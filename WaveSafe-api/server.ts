import { Application, Router } from "jsr:@oak/oak";
import { SurrealDbService } from "./services/surrealdb.ts";
import { MqttService } from "./services/mqtt.ts";

const surrealDbService = new SurrealDbService();
surrealDbService.initializeDb()
const _mqttService = new MqttService()

const app = new Application();
const router = new Router();

router
  .post("/home", async (ctx) => {
    const pacientList = await surrealDbService
  })

  .post("/pacient/:id", async (ctx) => {
    const id = ctx.params.id;
    const pacientData = await surrealDbService.getPacientInfo(id);
    ctx.response.body = pacientData;
  });

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(Deno.env.get('API_PORT'));
app.listen( {port});
console.log(`Server running at http://localhost:${port}`);
