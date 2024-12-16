import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'src/app/modules/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.baseApiUrl
  constructor(private http:HttpClient) { }

  getEmployee(){
        return this.http.get<any>(this.baseUrl +`api/Employee/GetAll`)
  }
  addEmployee(data:Employee){
    console.log(data)
    return this.http.post<any>(this.baseUrl +`api/Employee/CreateEmployee`,data)
}
 updateEmployee(data:Employee){
  return this.http.put<any>(this.baseUrl +`api/Employee/UpdateEmployee/${data.employeeId}`,data)
}
  employeeGetById(id){
  return this.http.get<any>(this.baseUrl +`api/Employee/${id}`)
}
  deleteEmployee(id){
  return this.http.delete<any>(this.baseUrl +`api/Employee/DeleteEmployee/${id}`)
}
employeeEmailExist(email){
  return this.http.get<any>(this.baseUrl +`api/Employee/CheckEmployeeEmailExist?email=${email}`)
}
employeeMobileNumberExist(num){
  return this.http.get<any>(this.baseUrl +`api/Employee/CheckEmployePhoneNumberExists?mobile=${num}`)
}

}
