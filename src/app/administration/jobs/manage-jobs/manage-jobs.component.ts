import { PageEvent } from '@angular/material/paginator';
import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { ManageJobs } from 'src/app/entites/manage-jobs';

import { ManageJobsService } from 'src/app/services/manage-jobs.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

import { DepartmentService } from 'src/app/services/admin/department.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Permissions } from 'src/app/entites/permissions';
import { AppUtils } from 'src/app/materials/utils/app-utils';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';

@Component({
  selector: 'app-manage-jobs',
  templateUrl: './manage-jobs.component.html',
  styleUrls: ['./manage-jobs.component.scss'],
  providers: [DatePipe]

})
export class ManageJobsComponent implements OnInit {
  date = new Date
  todayDates = this.date.toISOString().slice(0, 10)//this.datePipe.transform(new Date(),"yyyy-MM-dd")

  myForm: FormGroup;

  Eadit: FormGroup;

  manageJob: ManageJobs = new ManageJobs();
  manageJobs: ManageJobs[] = [];
  searching: ManageJobs = new ManageJobs();

  constructor(private location: Location, private datePipe: DatePipe, private authService: AuthService, private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private builder: FormBuilder, private departmentService: DepartmentService, private designationService: DesignationService,
    private manageJobService: ManageJobsService, private employeeDesignation: EmployeeDesignationService
  ) {
    this.myForm = this.builder.group({

      jobTitle: ['', [Validators.required]],
      jobLocation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      noOfVacancies: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      experience: ['', [Validators.required, Validators.pattern("^[0-35]$"), Validators.min(1), Validators.max(35)]],
      department: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      expiredDate: ['', [Validators.required, Validators.min(this.manageJob.startDate)]],
      startDate: ['', [Validators.required]],
      jobType: ['', [Validators.required]],

      salaryTo: ['', [Validators.required, Validators.min(8000)]],
      salaryFrom: ['', [Validators.required, Validators.min(this.manageJob.salaryTo),]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.min(15), Validators.max(99)]],
    }),
    this.Eadit = this.builder.group({

      jobTitle: ['', [Validators.required]],
      jobLocation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      noOfVacancies: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      experience: ['', [Validators.required, Validators.pattern("^[0-35]$"), Validators.min(1), Validators.max(35)]],
      department: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      expiredDate: ['', [Validators.required, Validators.min(this.manageJob.startDate)]],
      startDate: ['', [Validators.required]],
      salaryTo: ['', [Validators.required, Validators.min(8000)]],
      salaryFrom: ['', [Validators.required, Validators.min(this.manageJob.salaryTo),]],
      age: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.min(18), Validators.max(99)]],
    })

  }

  addForm() {
    this.myForm.reset();
    this.manageJob = new ManageJobs();

  }
  ngOnInit(): void {
    this.getAllDesignations();
    this.getAllDepartments();
    this.getAllManageJobs();
    this.setPermissions();
    this.setBaseUrl();
  }

  baseRoute = 'employee-dash'

  setBaseUrl() {
    this.baseRoute = this.authService.getUrl();
  }

  permissions: Permissions = new Permissions();
  setPermissions() {
    this.authService.isUserPermitted(this.location.path(), false).then(data => {
      if (data == null)
        this.authService.navigate(this.baseRoute);
      this.permissions = data;
    })
  }


  departments: Department[] = [];
  designations: Designation[] = [];



  getAllDepartments() {

    this.departmentService.getAllDepartment().subscribe((data: any) => {
      this.departments = data;
    })
  }

  getAllDesignations() {
    this.employeeDesignation.getAllDesignation(0, 1000).subscribe((data: any) => {
      this.designations = data;
    })
  }

  getAllDesignationsByDepartment(id: any) {
    this.designationService.getAllDesignationByDepartmentId(id.value).subscribe((data: any) => {
      this.designations = data;

    })
  }

  optionSelected(tag: any) {
    this.getAllDesignationsByDepartment(tag.value);
    this.manageJob.department.id = tag.value;
  }


  // adding employee
  addManageJobs() {
    AppUtils.formSubmittion(this.myForm);
    if (!this.myForm.valid) {
      //console.log("invalid");
      return;
    }

    this.manageJobService.addManageJobs(this.manageJob).subscribe((data: any) => {
      this.getAllManageJobs();
      this.sweetAlertMessages.alertMessage('success', ' New Job Created SuccesFully')
      AppUtils.modelDismiss('add');
      this.manageJob = new ManageJobs();
      this.sweetAlertMessages.swalAlertMessage('success', 'success', "New Job Created SuccesFully");

    }, (err: any) => {
      this.sweetAlertMessages.alertMessage('error', err.error.status);
    });
  }
  sequence: any = 0;


  getAllManageJobs() {
    this.manageJobService.getAllManageJobs(this.pageIndex, this.pageSize, 'manageJobs').subscribe((data: any) => {
      this.manageJobs = data.content;
      this.length = data.totalElements
      this.sequence = data.pageable.pageNumber * data.pageable.pageSize;

    })
  }

  // setting data in edit form
  setEditData(id: number) {
    this.manageJobService.getManageJobById(id).subscribe((data: any) => {
      this.manageJob = data;
    });
  }

  // updating data
  updateManageJobs() {
    AppUtils.formSubmittion(this.Eadit);
    if (!this.Eadit.valid) {
      return;
    }
    this.manageJobService.updateManageJob(this.manageJob).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Job Data Changed !!')
      this.manageJob = new ManageJobs();
      this.getAllManageJobs();
      this.sweetAlertMessages.swalAlertMessage('success', 'success', " Job Updated SuccesFully");

    }, (err: any) => {
      this.sweetAlertMessages.alertMessage('error', err.error.status);
    });

  }



  // searching the user
  filter() {
    console.log(this.searching);
    //this.searching.designation.setDepartment(null);
    this.manageJobService.searchManageJob(this.pageIndex, this.pageSize, this.searching).subscribe((data: any) => {
      this.manageJobs = data.content;
    })
  }

  // setting id for delete
  confirm(id: number) {
    this.manageJob.id = id;
  }

  //  deleteManageJob
  deleteManageJob() {
    this.manageJobService.deleteManageJob(this.manageJob.id).subscribe((data: any) => {
      this.manageJobs = this.manageJobs.filter(a => {
        return a.id != this.manageJob.id;
      })
      this.length = this.length - 1
    })
  }



  updateManageJobStatus(id: number, status: string, ofType: string) {
    this.manageJobService.ManageJobsByStatus(status, id, ofType).subscribe((data: any) => {
      this.getAllManageJobs();
    });
  }

  // pagination

  length = 1000000;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [1, 2, 5, 10];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAllManageJobs();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }




}

