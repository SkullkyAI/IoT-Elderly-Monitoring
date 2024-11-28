import { Injectable, resource, ResourceRef } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  constructor() { }
  async getPacientInfo(id: string): Promise<ResourceRef<any>>{


    let profile = resource({loader: async() => {
      try {
        const response = await (await fetch(`${environment.api_url}/${id}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })).json();
        return response;

      } catch (error) {
        throw error;
      }
    }});
    return profile;
  }
}
