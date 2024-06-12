import { ManageJobs } from "./manage-jobs";

export class AppliedCandidate {
    id = 0;

    candidateName:any=null;
    candidateEmail:any;

    message:any;

    candidateCV:any;
    fileName :any;

    manageJobs=new  ManageJobs();
	candidateFile!:File;


    applyDate:any;
    mobileNo:any;
    status ='Open';
}
