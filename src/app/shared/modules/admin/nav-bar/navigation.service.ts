import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  // Fetch all company data from Firebase Realtime Database
  getCompanies() {
    return null;
  }

  getInvoices(financialYear: string, companyName: string){
    return null;
  }
}
