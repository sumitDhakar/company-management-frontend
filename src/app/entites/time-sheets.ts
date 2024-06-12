import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { Users } from "./users";

export class TimeSheets {

	   id=0;

	  assignedHour:any=0;
	  workedHours:any=0;

	  timeSheetDate:any;

	  description='';

	   hours:any=0;


        user= new Users();


	  projectId=new Projects();

	  taskId=new Tasks();
	
	  deleted=false;	
	
}



