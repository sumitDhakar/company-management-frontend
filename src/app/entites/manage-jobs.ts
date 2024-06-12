import { Department } from "./department";
import { Designation } from "./designation";

export class ManageJobs {

    id=0;
    jobTitle=new Designation();
    jobLocation='';
    noOfVacancies='';
    experience=0;
    age=0;
     noOfViews=0;
	 totalAppliedCandidates=0;

    salaryFrom=0;
    salaryTo=0;
    jobType='';
    status='Open';
    startDate:any='';
    expiredDate:any='';
    description='';
    isDeletd=false;
    department=new Department();
}
