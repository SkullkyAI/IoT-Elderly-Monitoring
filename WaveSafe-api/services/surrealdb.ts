import { create, verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import * as argon2 from "jsr:@felix/argon2";
import { Surreal, RootAuth } from "@surrealdb/surrealdb";
import {QueryResult, SurrealConfig} from "../interfaces/surreal.interfaces.ts";
import {load} from "jsr:@std/dotenv";
import { MqttData, Notifications, Pacient } from '../interfaces/data.interface.ts';
import {  AuthCredentials } from '../interfaces/surreal.interfaces.ts';
await load({ export: true });

export class SurrealDbService {

    private db: Surreal;
    private config!: SurrealConfig;
    public notifications: Array<Notifications> = [];
    private jwtSecret!:CryptoKey;
  
    constructor() {
      this.db = new Surreal();
      this.initializeConfig();
      console.log("SurrealDbService initialized");
      this.initializeJwtSecret();
    }

    private async initializeJwtSecret() {
      this.jwtSecret = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(Deno.env.get('JWT_SECRET_KEY')),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign", "verify"]
      );
    }

    private async _verifyPassword(hash: string, password: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }

    private initializeConfig() {
        this.config = {
          url: Deno.env.get('SURREALDB_URL')!,
          port: parseInt(Deno.env.get('SURREALDB_PORT')!),
          namespace: Deno.env.get('SURREALDB_NAMESPACE')!,
          database: Deno.env.get('SURREALDB_DATABASE')!,
          username: Deno.env.get('SURREALDB_ROOT_USERNAME')!,
          password: Deno.env.get('SURREALDB_ROOT_PASSWORD')!
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
        if (this.db.ready) {
        console.log("SurrealDB connected");
        }
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
    async getPacientInfo(id: string){
        const _route:string = `pacient:${id}`;
        const result = await this.db.query(`select * from pacient:${id}`);
        console.log(result);
        return result ;
    }
    async getPacientList(){
        const result = await this.db.select('pacient');
        return result;
    }
    async updatePacientData(id: string, data:MqttData){
        try {
            // Generar un ID aleatorio entre 1 y 10000
            const randomId = Math.floor(Math.random() * 10000) + 1;
            const _ = await this.db.query
                (`
                create data:${randomId} set falling=${data.isFallen}, movement=${data.time_movement};
                `);
        } catch (error) {
            console.error(`Error updating record in pacient:`, error);
            throw error;
        }
    }
    async setMqttData(message: MqttData){
        if (message.isFallen){
            
            const temp = await this.db.query<[QueryResult[]]>(`select id, name, ->data_pacient->residence.{floor,room} as residence from pacient:${message.idPacient}`);
            const pacientInfo:Notifications = {
                id:'',
                namePacient:temp[0][0].name, 
                floor:temp[0][0].residence[0].floor, 
                room:temp[0][0].residence[0].room
            };
            this.notifications.push({
                id:message.idPacient,
                namePacient: pacientInfo.namePacient,
                floor: pacientInfo.floor,
                room: pacientInfo.room
            })
            console.log(this.notifications);
        }
        await this.updatePacientData(message.idPacient, message);

    }

    private async generateToken(userId: string): Promise<string> {
        const payload = {
            sub: userId,
            exp: new Date().getTime() + (2*60 * 60 * 1000), // 2 horas
        };
        return await create({ alg: "HS512", typ: "JWT" }, payload, this.jwtSecret);
    }

    public async verifyToken(token: string): Promise<boolean> {
        try {
            await verify(token, this.jwtSecret);
            return true;
        } catch {
            return false;
        }
    }

    async loginUser(user: string, password: string) {
        try {
            const [userAuth] = await this.db.query<[{ id: string, username: string }]>(`
                SELECT id, username FROM user 
                WHERE user = $user
            `, { user });
            console.log(userAuth);
            const username = userAuth.username;

            if (!user) return null;
            
            const aa = await this.db.query<[boolean]>(
                `RETURN fn::verification($username, $password);`,
                {
                  username,
                  password,
                }
              );
            console.log(aa);

            // const isValid = await this._verifyPassword(user.passwd, password);
            // if (!isValid) return null;

            const token = await this.generateToken(userAuth.id);
            return {
                token,
                user: {
                    id: userAuth.id,
                    username: userAuth.username
                }
            };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}