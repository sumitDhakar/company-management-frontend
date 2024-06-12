import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ManageJobs } from './entites/manage-jobs';

@Injectable({
  providedIn: 'root'
})
export class ManageJobsService {

  baseUrl=environment.hostUrl+'/administration/manageJobs';

  constructor(private httpClient:HttpClient) { }

 
}
