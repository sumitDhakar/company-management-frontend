import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Resignation } from '../entites/resignation';

@Injectable({
  providedIn: 'root'
})
export class ResignationService {

  baseUrl=environment.hostUrl+'/resignations';

  constructor(private httpClient:HttpClient) { }
// add resignations
  addResignation(resignationReason:string){
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
      //'Content-type':'multipart/form-data;boundary=BOEC8DO7-EBF1-4EA7-966C-E492A9F2C36E'
    });
       const formData = new FormData();
       formData.append("data",new Blob([JSON.stringify(resignationReason)],{type:'application/json'}));

    return this.httpClient.post(`${this.baseUrl}/`,formData,{headers});
 }
// update 
updateResignation(resignations:Resignation){
  return this.httpClient.put(`${this.baseUrl}/`,resignations);

}
//delete resignations   
deleteResignation(deleteId: number) {
  return this.httpClient.delete(`${this.baseUrl}/${deleteId}`);
}
// get resignations By Id
getResignationByID(resignationsId:number){
  return this.httpClient.get(`${this.baseUrl}/${resignationsId}`);
}

// get resignations 
getResignationOfCurrent(){
  return this.httpClient.get(`${this.baseUrl}/`);
}


  // get All resignations
  getAllResignation(pageNo:number,pageSize:number){
    return this.httpClient.get(`${this.baseUrl}/${pageNo}/${pageSize}`);
 }



  // search resignations
  searchResignation(pageNo:number,pageSize:number,resignations:Resignation){
    return this.httpClient.post(`${this.baseUrl}/search/${pageNo}/${pageSize}`,resignations);
  }

}