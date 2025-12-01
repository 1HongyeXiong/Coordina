import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SyncedUser {
  _id: string;
  microsoftId: string;
  name: string;
  userEmail: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly USER_ID_KEY = 'coordina_user_id';  // localStorage key

  constructor(
    private msalService: MsalService,
    private http: HttpClient
  ) { }
  
  isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  getUserName(): string | null {
    const accounts: AccountInfo[] = this.msalService.instance.getAllAccounts();
    if (accounts.length == 0){
        return null;
    }
    return accounts[0].username;
  }

  // Get Microsoft's localAccountId
  getMicrosoftId(): string | null {
    return this.msalService.instance.getActiveAccount()?.localAccountId || null;
  }

  // Get the MongoDB User _id (from localStorage)
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  // Sync Microsoft user with backend - call this after login
  syncUser(): Observable<SyncedUser | null> {
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      return of(null);
    }

    return this.http.post<SyncedUser>(`${environment.apiConfig.baseUrl}/users/sync`, {
      microsoftId: account.localAccountId,
      userEmail: account.username,        // From Microsoft account
      name: account.name || account.username  // From Microsoft profile
    }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem(this.USER_ID_KEY, user._id);
        }
      })
    );
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    localStorage.removeItem(this.USER_ID_KEY);  // Clear on logout
    this.msalService.logoutRedirect();
  }
}