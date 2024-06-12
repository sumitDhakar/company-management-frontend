import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { Department } from 'src/app/entites/department';
import { Designation } from 'src/app/entites/designation';
import { Permissions } from 'src/app/entites/permissions';
import { Users } from 'src/app/entites/users';
import { AppUtils } from 'src/app/materials/utils/app-utils';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { ImageUtil } from 'src/app/payload/image-util';
import { PageRequest } from 'src/app/payload/page-request';
import { PaginationManager } from 'src/app/payload/pagination-manager';
import { UserListResponse } from 'src/app/payload/user-list-response';
import { AdminUsersService } from 'src/app/services/admin/adminUsers.service';
import { DepartmentService } from 'src/app/services/admin/department.service';
import { DesignationService } from 'src/app/services/admin/designation.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeDesignationService } from 'src/app/services/employee/employee-designation.service';
import { EmployeeUsersService } from 'src/app/services/employee/employeeUsers.service';
// import { DynamicPaginationComponent } from 'src/app/shared/dynamic-pagination/dynamic-pagination.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss'],
  providers: [DatePipe]
})
export class AllEmployeesComponent implements OnInit {
  // @ViewChild(DynamicPaginationComponent) childComponentRef!: DynamicPaginationComponent;

  process = false;

  todayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  eventManager: PaginationManager = new PaginationManager();
  pageRequestManager: PageRequest = new PageRequest();

  myForm!: FormGroup;
  eadit!: FormGroup;
  imageUtils: ImageUtil = new ImageUtil();
  imageUrl = this.imageUtils.getImageUrl();
  history: AllEmployeesComponent[] = [];
  searching: Users = new Users();
  user: Users = new Users();
  // user: Users = new Users();
  constructor(private usersService: AdminUsersService, private employeeUserService: EmployeeUsersService,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private departmentService: DepartmentService, private designationService: DesignationService, private employeeDesignation: EmployeeDesignationService,
    private fb: FormBuilder, private authService: AuthService, private location: Location, private datePipe: DatePipe) {



    this.eadit = new FormGroup({
      firstName: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      lastName: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      // email: new FormControl('', [Validators.required ,AppUtils.isEmail]),
      address: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      alternativeAddress: new FormControl('', [Validators.required, AppUtils.isTitleValid()]),
      dob: new FormControl('', [Validators.required, this.validateDate]),
      phone: new FormControl('', [Validators.required, AppUtils.isPhoneValid()]),
      alternativePhone: new FormControl('', [Validators.required, AppUtils.isPhoneValid()]),
      ssn: new FormControl('', [Validators.required, Validators.pattern("^[A-Z]{2}[A-Z0-9]{4}$"), Validators.minLength(6), Validators.maxLength(6)]),
      gender: new FormControl('', [Validators.required]),

    })

    this.initializeForm()
    this.searching.designation = new Designation();
    this.user.designation = new Designation();

  }


  initializeForm() {

    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      lastName: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      email: new FormControl('', [Validators.required, AppUtils.isEmail]),
      address: new FormControl('', [Validators.required, AppUtils.isTitleValid(), AppUtils.min(), AppUtils.max()]),
      alternativeAddress: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required, this.validateDate]),
      phone: new FormControl('', [Validators.required, AppUtils.isPhoneValid()]),
      alternativePhone: new FormControl('', [Validators.required, AppUtils.isPhoneValid()]),
      ssn: new FormControl('', [Validators.required, Validators.pattern("^[A-Z]{2}[A-Z0-9]{4}$"), Validators.minLength(6), Validators.maxLength(6)]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)]),
      confirmPassword: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),

      // fb : new FormControl('', [Validators.required])
    }, {
      validators: this.passwordMatchValidator(),
    });
  }


  ngOnInit(): void {
    this.getAllEmployees();
    this.getAllDesignations();
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

  users: UserListResponse[] = [];
  department: Department = new Department();
  designation: Designation = new Designation();
  confirmPassword = '';
  isListView = false;
  departments: Department[] = [];
  designations: Designation[] = [];

  addForm() {

    this.user = new Users();
    this.initializeForm()
    console.log(this.user);

    this.departments.length == 0 ? this.getAllDepartments() : '';
    this.myForm.reset();
    this.eadit.reset();

  }

  getAllDepartments() {
    this.departmentService.getAllDepartment().subscribe((data: any) => {
      this.departments = data;
    })
  }

  getAllDesignations() {
    this.employeeDesignation.getAllDesignation(this.pageRequestManager.pageNumber, 10000).subscribe((data: any) => {
      this.designations = data;
    })
  }

  getAllDesignationsByDepartment(id: number) {

    this.designationService.getAllDesignationByDepartmentId(id).subscribe((data: any) => {
      this.designations = data;

    })
  }


  optionSelected(tag: any) {
    this.getAllDesignationsByDepartment(tag.value);
  }



  public firstTaskFormControl() {
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key)
        ;
      if (control) {
        control.markAsTouched();
      }
    });
    const firstInvalidControl = document.querySelector('input.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }



  selectFile(event: any) {
    this.user.userImage = event.target.files[0];
  }


  onEdit(employeeId: any) {
    this.setEditData(employeeId);
  }

  onDelete(employeeId: any) {
    this.confirm(employeeId);
  }


  addEmployee() {
    if (this.user.designation.id == 0) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Select Designation First',
        timer: 5000
      })
    }

    if (this.user.designation.id > 0)
      this.firstTaskFormControl();
    if (this.myForm.valid) {
      // this.user.email="bjbjbn";

      if (this.process == false) {
        this.process = true;
        this.usersService.addEmployee(this.user).subscribe((data: any) => {

          this.sweetAlertMessages.alertMessage('success', 'Employee Added successfully.')
          this.process = false;

          this.user = new Users();
          this.user.designation = new Designation();
          this.confirmPassword = ''

          AppUtils.modelDismiss("add");

          this.getAllEmployees();

        },
          (err) => {
            this.process = false;

            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            })
            if (err.status == 302)
              Toast.fire({
                title: 'User add failed !!',
                icon: 'error',
                text: err.error.message,
                timer: 5000 // 5 seconds,
              })
            else
              Toast.fire({
                title: 'Create User failed !!',
                icon: 'error',
                text: "Something Went Wrong",
                timer: 5000 // 5 seconds,
              })
          }
        )

      }
    }
  }

  designationSelected(inp: any) {
    this.user.designation.id = inp.value;
  }

  // getting all Employees
  getAllEmployees() {
    this.usersService.getAllEmployeesForAdmin(this.pageRequestManager.pageNumber, this.pageRequestManager.pageSize).subscribe((data: any) => {
      this.users = data.content;

      this.eventManager.setPageData(data)
      this.pageRequestManager.pageNumber = data.pageable.pageNumber
    })
  }

  // setting data in edit form
  setEditData(id: number) {

    this.employeeUserService.getEmployeeById(id).subscribe((data: any) => {
      this.user = { ...data };

      // if (this.user.designation == null || this.user.designation == undefined) {
      //   this.user.designation = new Designation();
      // }
      //jjhfjnvkkowkfmk
    });
  }

  // updating data
  updateEmployee() {
    AppUtils.formSubmittion(this.eadit);
    if (!this.eadit.valid) {
      return;
    }
    if (this.eadit.valid) {
      // this.user.email="bjbjbn";

      if (this.process == false) {
        this.process = true;

        this.usersService.updateEmployee(this.user).subscribe((data: any) => {

          this.sweetAlertMessages.alertMessage('success', 'Employee Details Update successfully.')
          AppUtils.modelDismiss('Eadit');
          this.process = false;
          this.user = new Users();
          this.confirmPassword = ''
          this.getAllEmployees();

        },
          (err) => {
            this.process = false;

            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            })
            if (err.status == 302)
              Toast.fire({
                title: 'User add failed !!',
                icon: 'error',
                text: err.error.message,
                timer: 5000 // 5 seconds,
              })
            else
              Toast.fire({
                title: 'Create User failed !!',
                icon: 'error',
                text: "Something Went Wrong",
                timer: 5000 // 5 seconds,
              })
          }
        )
      }
    }
  }

  // changing view of employee
  changeView(put: boolean) {
    this.isListView = put;
  }


  // searching the user
  filter() {


    if ((!this.searching || !this.searching.firstName || this.searching.firstName.trim() === '') &&
      (!this.searching || !this.searching.designation.id || this.searching.designation.id === 0)) {
      return;
    }
    
    this.usersService.searchEmployee(this.pageRequestManager.pageNumber, this.pageRequestManager.pageSize, this.searching).subscribe((data: any) => {
      if(data.content.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Employee found',
          text: 'There are no results matching your search criteria.',
          confirmButtonText: 'OK'
        });
        return; 
      }
  
 this.users = data.content;
      this.history = data.content;

      this.searching = new Users();
      this.searching.designation = new Designation();
      this.eventManager.setPageData(data)
      this.pageRequestManager.pageNumber = data.pageable.pageNumber

    })
  }

  // setting id for delete
  confirm(id: number) {
    this.user.id = id;
  }

  // delete employee
  deleteEmployee() {
    this.usersService.deleteEmployee(this.user.id).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Employee Deleted successfully.')

      this.users = this.users.filter(a => {
        return a.id != this.user.id;
      })
    })
  }

  // pagination start


  getAllData(event: any) {

    // Perform actions such as fetching data based on the pagination event
    this.getAllEmployees();
  }
  // pagination end



  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const password: any = control.get('password');
      const confirmPassword: any = control.get('confirmPassword');

      if (password.value !== confirmPassword.value) {
        return { passwordMatch: true };
      } else {
        return null;
      }
    };
  }



  // checking age of employee
  validateDate(control: any): { [key: string]: boolean } | null {

    if (control.value) {
      let present = new Date();
      let dob = new Date(control.value);


      if (present.getFullYear() - dob.getFullYear() < 18) {
        return { 'invalidDate': true };
      }
    }
    return null;
  }


}

