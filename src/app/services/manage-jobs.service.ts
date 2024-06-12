import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ManageJobs } from '../entites/manage-jobs';


@Injectable({
  providedIn: 'root'
})
export class ManageJobsService {

  baseUrl=environment.hostUrl+'/administration/manageJobs';

  constructor(private httpClient:HttpClient) { }

  addManageJobs(manageJobs:ManageJobs){
    return this.httpClient.post(`${this.baseUrl}/`,manageJobs);
 }
 // get All ManageJobs
 getAllManageJobs(pageNo:number,pageSize:number,typeFor:string){
  return this.httpClient.get(`${this.baseUrl}/${pageNo}/${pageSize}/${typeFor}`);
}
deleteManageJob(deleteId: number) {
  return this.httpClient.delete(`${this.baseUrl}/${deleteId}`);
}
// 
       // get ManageJobs by status
ManageJobsByStatus(status:String,id:number,ofType:string){
  return this.httpClient.get(`${this.baseUrl}/status/${status}/${id}/${ofType}`);
}



  // search job
  searchManageJob(pageNo:number,pageSize:number,manageJob:ManageJobs){
    return this.httpClient.post(`${this.baseUrl}/search/${pageNo}/${pageSize}`,manageJob);
  }

// get  By Id
getManageJobById(jobId:number){
  return this.httpClient.get(`${this.baseUrl}/${jobId}`);
}
// update 
updateManageJob(manageJob:ManageJobs){
  return this.httpClient.put(`${this.baseUrl}/`,manageJob);

}
}
