import { inject, Injectable, resource, ResourceRef } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Pacient, PacientAInfo } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private http = inject(HttpClient);

  constructor() { }
  async getPacientInfo(id: string): Promise<PacientAInfo>{
    return new Promise((resolve, reject) => {
      this.http.post<PacientAInfo>(`${environment.api_url}/pacient/${id}`,
        {id},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      ).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      });
    });
  }

  async getPacientList(): Promise<Array<Pacient>> {
    return new Promise((resolve, reject) => {
      this.http.post<Array<Pacient>>(`${environment.api_url}/home`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      ).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      });
    });
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
