import { Injectable, inject } from '@angular/core';
import Surreal from 'surrealdb';
import { environment } from '../../environments/environment';
import { StorageService } from './StorageService.service';
import {SurrealConfig} from '../interfaces/surreal.interfaces';



@Injectable({
  providedIn: 'root'
})
export class SurrealDbService {

  private db: Surreal;
  private storageManager = inject(StorageService);
  private config: SurrealConfig;

  constructor() {
    this.db = new Surreal();
    this.config = {
      url: environment.surrealdb_url,
      namespace: environment.surrealdb_namespace,
      database: environment.surrealdb_database,
      username: environment.surrealdb_auth_username,
      password: environment.surrealdb_auth_password
    };
  }

  async initializeDb(): Promise<void> {
    try {
      await this.db.connect(this.config.url);

      // Iniciar sesión con las credenciales
      await this.db.signin({
        username: this.config.username,
        password: this.config.password,
      });

      // Usar el namespace y database configurados
      await this.db.use({
        namespace: this.config.namespace,
        database: this.config.database,
      });

    } catch (error) {
      console.error('Error initializing SurrealDB:', error);
      throw error;
    }
  }


}
