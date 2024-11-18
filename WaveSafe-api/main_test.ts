import { assertEquals } from "@std/assert";
import { SurrealDbService } from "./services/surrealdb.ts";
const bd = new SurrealDbService();
Deno.test(async function dbInit() {
    assertEquals(await bd.initializeDb(), true);
});
