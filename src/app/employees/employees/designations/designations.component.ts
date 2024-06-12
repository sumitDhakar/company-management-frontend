
import { Component, OnInit } from '@angular/core';
import { Designation } from 'src/app/entites/designation';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { DepartmentService } from 'src/app/services/admin/department.service';
import { Department } from 'src/app/entites/department';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Permissions } from 'src/app/entites/permissions';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { PageEvent } from '@angular/material/paginator';
import { AppUtils } from 'src/app/materials/utils/app-utils';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnInit {
  sequence: any = 0;
  myForm: FormGroup;
  constructor(private designationService: DesignationService
    , private fb: FormBuilder,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private departmentService: DepartmentService, private employeeDesignation: EmployeeDesignationService
    , private authService: AuthService, private location: Location) {
    this.myForm = this.fb.group({
      title: ["", [Validators.required, AppUtils.isTitleValid(), AppUtils.min(),AppUtils.max()]],
      option: ["", [Validators.required]],
      // customField: ['', [customValidator]],
    });
    this.designation.department = new Department();
    // this.searching.department = new Department();

  }

  departments: Department[] = [];
  ngOnInit(): void {

    this.getAllDesignation();
    this.getAllDepartments();
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

  deleteId = 0;

  searching: Designation = new Designation();


  designations: Designation[] = [];
  designation: Designation = new Designation();

  confirmPassword = '';
  isListView = false;
  addDesignation() {
    AppUtils.formSubmittion(this.myForm);
    if (!this.myForm.valid) {
      //console.log("invalid");
      return;
    }
 

      this.designationService.addDesignation(this.designation).subscribe((data: any) => {
        this.sweetAlertMessages.alertMessage('success', 'Designation Added successfully.')

        this.designation = new Designation();
        this.designation.department = new Department();
        this.getAllDesignation();
        AppUtils.modelDismiss('edit');
 
        this.myForm.reset();

      }, err => {
        if (err.error.status > 0)
          this.sweetAlertMessages.alertMessage('error', err.error.message);

        else
          this.sweetAlertMessages.alertMessage('error', err.error.status);

      })
    
    
  }

  addForm() {
    this.myForm.reset();
  }



  getAllDesignation() {
    this.employeeDesignation.getAllDesignation(1000, this.pageSize).subscribe((data: any) => {
      this.designations = data;
      this.sequence = data.pageable.pageNumber * data.pageable.pageSize;

    })
  }
  getAllDepartments() {
    this.departmentService.getAllDepartment().subscribe((data: any) => {
      this.departments = data;
    })
  }

  setEditData(id: number) {
    this.designationService.getDesignationById(id).subscribe((data: any) => {
      this.designation = data;
    });

  }

  updateDesignation() {
    AppUtils.formSubmittion(this.myForm);
    if (!this.myForm.valid) {
      //console.log("invalid");
      return;
    }
 
    this.designationService.updateDesignation(this.designation).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Designation Updated successfully.')
this.designation=new Designation();
this.designation.department = new Department();

this.getAllDesignation()
AppUtils.modelDismiss('add');
 

    }, err => {
      if (err.error.status > 0)
        this.sweetAlertMessages.alertMessage('error', err.error.message);

      else
        this.sweetAlertMessages.alertMessage('error', err.error.status);
    });
  
  }

  changeView() {
    if (!this.isListView)
      this.isListView = true
    else
      this.isListView = false
  }


  filter() {

    if (this.searching.title.trim() == '' || this.searching.title == null) {
      return;
    }
    this.designationService.searchDesignation(this.length, this.pageSize, this.searching).subscribe((data: any) => {
      if (data.content.length === 0) {
        // Display a SweetAlert indicating no data was found
        Swal.fire({
          icon: 'info',
          title: 'No Designation Found',
          text: 'There are no results matching your search criteria.',
          confirmButtonText: 'OK'
        });
        return;
      }

      this.designations = data.content;
    })
  }
  setDeleteData(id: number) {
    this.deleteId = id;
  }

  deleteDesignation() {
    this.designationService.deleteDesignation(this.deleteId).subscribe((data: any) => {
      this.getAllDesignation()
    })
  }



  /// pagination 
  length = 500;
  pageSize = 100;
  pageIndex = 0;
  pageSizeOptions = [1, 2, 5];

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
    this.getAllDesignation();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }

  }



  setDesignation(event: any) {
    this.designation.department.id = event.target.value;
  }

  check() {
    alert("ad")
  }
}

