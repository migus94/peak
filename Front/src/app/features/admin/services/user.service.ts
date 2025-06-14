import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiBase = '/api';
  private readonly userUrl = '/users';
  private readonly rolUrl = '/rol';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBase}${this.userUrl}`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiBase}${this.userUrl}/${id}`);
  }


  changeUserRole(userId: number) {
    return this.http.patch(`${this.apiBase}${this.userUrl}/${userId}${this.rolUrl}`, {});
  }

}
