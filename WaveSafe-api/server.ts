import { Application, Router, RouterContext } from "jsr:@oak/oak";
import { oakCors } from "https://deno.land/x/cors/mod.ts";  // Corregida la importación
import { SurrealDbService } from "./services/surrealdb.ts";
import { MqttService } from "./services/mqtt.ts";
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { AuthCredentialsSys } from "./interfaces/data.interface.ts";

await load({ export: true });

const surrealDbService = new SurrealDbService();
surrealDbService.initializeDb();
const _mqttService = new MqttService(surrealDbService);

const app = new Application();
const router = new Router();

// Modificar la configuración de CORS
app.use(oakCors({
  origin: ["http://localhost:4200"], // Reemplaza con el puerto de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware de autenticación
async function authMiddleware(
  ctx: RouterContext<string>,
  next: () => Promise<unknown>,
) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { error: "No token provided" };
    return;
  }

  const token = authHeader.split(" ")[1];
  const isValid = await surrealDbService.verifyToken(token);

  if (!isValid) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid token" };
    return;
  }

  await next();
}

router
  .post("/login", async (ctx) => {
    try {
      // Obtener el body correctamente
      const body = await ctx.request.body.json();
      const auth: AuthCredentialsSys = {
        username: body.email! as string,
        password: body.password! as string,
      };
      console.log(body);
      console.log(auth);

      if (!auth.username || !auth.password) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Username and password are required" };
        return;
      }

      const { username, password } = auth;
      const result = await surrealDbService.loginUser(username, password);
      if (!result) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid credentials" };
        return;
      }
      if (!result) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid credentials" };
        return;
      }

      // Si el login es exitoso
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Login error:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Internal server error",
        message: error instanceof Error
          ? error.message
          : "An unknown error occurred",
      };
    }
  })
  // Proteger rutas existentes con el middleware
  .post("/home", authMiddleware, async (ctx) => {
    const pacientList = await surrealDbService.getPacientList();
    ctx.response.body = pacientList;
    console.log("/home node");
    return ctx.response;
  })
  .post("/pacient/:id", authMiddleware, async (ctx) => {
    const id = ctx.params.id;
    const pacientData = await surrealDbService.getPacientInfo(id);
    ctx.response.body = pacientData;
    return ctx.response;
  })
  .get("/notifications", authMiddleware, (ctx) => {
    const notifications = surrealDbService.notifications;
    surrealDbService.notifications = [];
    console.log("Getting Notifications...");
    console.log(surrealDbService.notifications);
    ctx.response.body = notifications;
    return ctx.response;
  });

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(Deno.env.get("API_PORT"));
app.listen({ port });
console.log(`Server running at http://localhost:${port}`);
