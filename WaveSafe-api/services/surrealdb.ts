
import { Surreal, RootAuth } from "@surrealdb/surrealdb";
import {SurrealConfig} from "../interfaces/surreal.interfaces.ts";
import {load} from "jsr:@std/dotenv";

export class SurrealDbService {

    private db: Surreal;
    private config!: SurrealConfig;
  
    constructor() {
      this.db = new Surreal();
      this.initializeConfig();
      console.log("SurrealDbService initialized");
    }

    private async initializeConfig(): Promise<void> {
        const env = await load(); // Cargar variables de entorno desde .env
        this.config = {
          url: env.SURREALDB_URL,
          port: parseInt(env.SURREALDB_PORT),
          namespace: env.SURREALDB_NAMESPACE,
          database: env.SURREALDB_DATABASE,
          username: env.SURREALDB_ROOT_USERNAME,
          password: env.SURREALDB_ROOT_PASSWORD
        };
        console.log(this.config);
    }
  
    async initializeDb(): Promise<boolean> {
      try {
        await this.db.connect(this.config.url +':' + this.config.port + '/rpc');
  
        // Iniciar sesión con las credenciales
        const rootAuth: RootAuth ={
            username: this.config.username,
            password: this.config.password
        }
        console.log(rootAuth);
        await this.db.signin(rootAuth);
        console.log("SurrealDB connected");
        // Usar el namespace y database configurados
        await this.db.use({
          namespace: this.config.namespace,
          database: this.config.database,
        });
        console.log("SurrealDB namespace and database set");  
        return true;
      } catch (error) {
        console.error('Error initializing SurrealDB:', error);
        throw error;
      }
    }
/*
// Create a new record
async create<T>(table: string, data: T): Promise<T> {
    try {
        const created = await this.db.create(table, data);
        return created[0];
    } catch (error) {
        console.error(`Error creating record in ${table}:`, error);
        throw error;
    }
}

// Read a single record by ID
async getById<T>(table: string, id: string): Promise<T | null> {
    try {
        const result = await this.db.select(`${table}:${id}`);
        return result[0] || null;
    } catch (error) {
        console.error(`Error fetching record from ${table}:`, error);
        throw error;
    }
}

// Read all records from a table
async getAll<T>(table: string): Promise<T[]> {
    try {
        return await this.db.select(table);
    } catch (error) {
        console.error(`Error fetching all records from ${table}:`, error);
        throw error;
    }
}

// Update a record
async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    try {
        const updated = await this.db.merge(`${table}:${id}`, data);
        return updated[0];
    } catch (error) {
        console.error(`Error updating record in ${table}:`, error);
        throw error;
    }
}

// Delete a record
async delete(table: string, id: string): Promise<void> {
    try {
        await this.db.delete(`${table}:${id}`);
    } catch (error) {
        console.error(`Error deleting record from ${table}:`, error);
        throw error;
    }
}*/
  }