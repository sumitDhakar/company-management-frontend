import { Component, OnInit } from '@angular/core';
import { ManageJobs } from 'src/app/entites/manage-jobs';
import { ActivatedRoute, Routes } from '@angular/router';
import { AppliedCandidate } from 'src/app/entites/applied-candidate';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { AppliedCandidateService } from 'src/app/services/applied-candidate.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppUtils } from 'src/app/materials/utils/app-utils';
import { ManageJobsService } from 'src/app/services/admin/manage-jobs.service';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss']
})
export class JobViewComponent implements OnInit {

  aC: AppliedCandidate = new AppliedCandidate();

  manageJob: ManageJobs = new ManageJobs();
  manageJobs: ManageJobs[] = [];
  searching: ManageJobs = new ManageJobs();
  itemId: any; // To store the extracted ID
  myForm: FormGroup;

  constructor(private route: ActivatedRoute, private builder: FormBuilder,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private manageJobService: ManageJobsService
    , private appliedCandidateService: AppliedCandidateService) {

    this.myForm = this.builder.group({

      candidateName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      message: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      candidateEmail: ['', [Validators.required, this.isEmail]],
      mobileNo: new FormControl('', [Validators.required, Validators.pattern(/^[6-9]{1}[0-9]{9}$/)]),
      file: ['', [Validators.required]],
    }),
      this.manageJob.department = new Department();
    this.manageJob.jobTitle = new Designation();
    this.aC.manageJobs = new ManageJobs();
  }

  addForm() {
    this.myForm.reset();
    this.aC = new AppliedCandidate();

  }


  public isEmail(control: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(control.value)) {
      console.log('email-valid');

      return null;
    }
    console.log('email-invalid');

    return { 'invalidEmail': true };

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itemId = params['id']; // Extract the 'id' parameter from the URL
    });


    this.setEditData(0);
  }
  // setting data in edit form
  setEditData(id: number) {
    this.manageJobService.getManageJobById(this.itemId).subscribe((data: any) => {
      this.manageJob = data;
    });
  }


  selectFile(event: any) {
    this.aC.candidateFile = event.target.files[0];
  }
  addCandidate() {

    this.aC.manageJobs.id = this.itemId;
    AppUtils.formSubmittion(this.myForm);
    if (!this.myForm.valid) {
      //console.log("invalid");
      return;
    }
    this.appliedCandidateService.addCandidate(this.aC).subscribe((data: any) => {
     
      AppUtils.modelDismiss('add');
      this.aC = new AppliedCandidate();
      this.sweetAlertMessages.swalAlertMessage('success','success', 'Appliefd For This Job.')
    }, (err) => {
      if (err.status == 400)
        this.sweetAlertMessages.swalAlertMessage('error','error', 'Applied Field  are not correct.')

      else
        this.sweetAlertMessages.swalAlertMessage("error",'error', err.error.message)
    }
    )
  }

}





