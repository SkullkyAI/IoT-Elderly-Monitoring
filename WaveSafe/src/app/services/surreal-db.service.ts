import { Injectable } from '@angular/core';
import Surreal from 'surrealdb';

@Injectable({
  providedIn: 'root'
})
export class SurrealDbService {

  private db: any;

  constructor() { }

  async initializeDb(): Promise<void> {
    this.db = new Surreal();
    await this.db.initialize();
  }

}
