import {  Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Permissions } from 'src/app/entites/permissions';
import { Resignation } from 'src/app/entites/resignation';
import { Users } from 'src/app/entites/users';
import { AppUtils } from 'src/app/materials/utils/app-utils';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResignationService } from 'src/app/services/resignation.service';

@Component({
  selector: 'app-apply-resignation',
  templateUrl: './apply-resignation.component.html',
  styleUrls: ['./apply-resignation.component.scss']
})
export class ApplyResignationComponent implements OnInit {

  E: FormGroup;
  resignation: Resignation = new Resignation();

  ngOnInit(): void {
    this.setPermissions();
    this.setBaseUrl();
    this.getYourResignationData();
  }
reason=''

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

  constructor(private resignationService: ResignationService,
    private authService: AuthService,
    private location: Location,
    private sweetAlertMessages: SweetAlertMessagesProvidersService) {
    this.E = new FormGroup({
      reason: new FormControl('', [Validators.required]),

    }),

      this.resignation.employee = new Users();
  }



 // add assets
 getYourResignationData() {
  

  this.resignationService.getResignationOfCurrent().subscribe((data: any) => {
    if(data!=null)
    this.resignation=data;
    
  });

}





  // add assets
  addResignation() {
    AppUtils.formSubmittion(this.E);
    if (!this.E.valid) {
      //console.log("invalid");
      return;
    }

    this.resignationService.addResignation(this.reason).subscribe((data: any) => {

      this.resignation = new Resignation();
      this.resignation.employee = new Users();
      this.sweetAlertMessages.alertMessage('success', 'Resignation Applied successfully.')
      AppUtils.modelDismiss('add');
    }, (err: any) => {
      console.log(err);
      if (err.error.status > 0)
        this.sweetAlertMessages.alertMessage('error', err.error.message);
      else {
        this.sweetAlertMessages.alertMessage('error', err.error.status);

      }

    });

  }

}
