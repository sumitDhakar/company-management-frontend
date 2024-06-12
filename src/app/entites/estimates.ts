import { Clients } from "./clients";
import { EstimateItems } from "./estimate-items";
import { Projects } from "./projects";
import { Taxes } from "./taxes";

export class Estimates {

	id = 0;

eid='';
	clientId=new  Clients();


	projectId=new Projects();


	billDate:any=null;


	dueDate :any=null;
	// colum mtext
	note :any=null;

	lastEmailSentDate :any=null;
	// enum
	status:any=null;

	taxeId= new Taxes();

	discount :any=null;
 discountPercentage=0;

	total :any=null;
	grandTotal:any=null;
	taxCost:any = null;


	recurringInvoiceId :any=null;

	deleted = false;


	estimateItems: EstimateItems[] = [];

}



