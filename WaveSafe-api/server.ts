import { Application, Router } from "jsr:@oak/oak";
import { SurrealDbService } from "./services/surrealdb.ts";
import { MqttService } from "./services/mqtt.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

await load({ export: true });

const surrealDbService = new SurrealDbService();
surrealDbService.initializeDb()
const _mqttService = new MqttService(surrealDbService)

const app = new Application();
const router = new Router();

router
  .post("/home", async (ctx) => {
    const pacientList = await surrealDbService.getPacientList();
    ctx.response.body = pacientList;
    console.log("7home node")
    return ctx.response;
  })

  .post("/pacient/:id", async (ctx) => {
    const id = ctx.params.id;
    const pacientData = await surrealDbService.getPacientInfo(id);
    ctx.response.body = pacientData;
    return ctx.response
  })
  .get("/notifications", () => {
    const notifications = surrealDbService.notifications;
    surrealDbService.notifications = [];
    console.log("Getting Notifications...");
    return notifications;
  });

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(Deno.env.get('API_PORT'));
app.listen( {port});
console.log(`Server running at http://localhost:${port}`);
