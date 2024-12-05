import { inject, Injectable, resource, ResourceRef } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private http = inject(HttpClient);

  constructor() { }
  async getPacientInfo(id: string): Promise<ResourceRef<any>>{
    let profile = resource({loader: async() => {
      try {
        return this.http.post(`${environment.api_url}/${id}`,
          { id },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        ).toPromise();
      } catch (error) {
        throw error;
      }
    }});
    return profile;
  }

  async getAuthenticated(email: string, password: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.api_url}/login`,
        {email, password},
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      ).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.success) {
            localStorage.setItem('token', response.data.token);
            resolve(true);
          } else {
            reject(false);
          }
        },
        error: (error) => reject(error)
      });
    });
  }

}
