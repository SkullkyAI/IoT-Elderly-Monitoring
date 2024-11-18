import { SurrealDbService } from "./services/surrealdb.ts";

const surrealDbService = new SurrealDbService();
surrealDbService.initializeDb().then(() => {
  console.log("SurrealDB initialized");
}).catch((error) => {
  console.error("Error initializing SurrealDB:", error);
});
