import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
interface Designation {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  desigUrl = environment.baseApiUrl
  constructor(private http:HttpClient) { }

  getDesigName(){
        return this.http.get<any>(this.desigUrl +`api/Designation/GetAll`)
  }
  addDesigName(data){
    return this.http.post<any>(this.desigUrl +`api/Designation/CreateDesignation`,data)
}
 updateDesigName(data){
  return this.http.put<any>(this.desigUrl +`api/Designation/UpdateDesignation/${data.designationId}`,data)
}
  desigNameGetById(id){
  return this.http.get<any>(this.desigUrl +`api/Designation/${id}`)
}
  deletedesignName(id){
  return this.http.delete<any>(this.desigUrl +`api/Designation/DeleteDesignation/${id}`)
}
}
