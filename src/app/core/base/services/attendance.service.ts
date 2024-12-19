import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  baseUrl = environment.baseApiUrl
  constructor(private http:HttpClient) { }

  getAttendance(date){
    return this.http.get<any>(this.baseUrl +`api/AttendanceSheet/${date}`)
  }
  createAttendance(data){
    return this.http.post<any>(this.baseUrl +'api/AttendanceSheet/CreateAttendanceSheet', data)
  }

  
}

