import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/entites/auth';
import { SweetAlertMessagesProvidersService } from 'src/app/materials/utils/sweet-alert-messages-providers.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

enum SelectForm {
  EMAIL_PAGE = "EMAIL_PAGE",
  OTPPAGE = 'OTPPAGE',
  ChangePasswordPage = 'ChangePasswordPage'
}

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  process = false;

  myPage: any = ''; // Define a property to hold the enum
  mySelectedForm = SelectForm;

  ngOnInit(): void {
    this.myPage = SelectForm.EMAIL_PAGE; // Set the enum value

  }

  myForm: FormGroup;
  myForm2: FormGroup;

  constructor(private authService: AuthService, private router: Router,
    private sweetAlertMessages: SweetAlertMessagesProvidersService,
    private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.myForm2 = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)]],
      confirmPassword: ['', [Validators.required]],
    });

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

  email: string = '';
  sendEmailForForgetPassword() {

    this.firstTaskFormControl();
    if (this.myForm.valid) {
      if (this.process == false) {
        this.process = true;
        this.authService.resendOptForEmailVerification(this.email, 'forget').subscribe(
          (data: any) => {
            this.sweetAlertMessages.swalAlertMessage("Otp Send !!", "success", "Check Your Mail Box!!").then((result) => {
              this.authService.email.next(this.email);
              this.myForm.reset();
              this.myPage = this.mySelectedForm.OTPPAGE;``
              this.process = false;
            });
          },
          (err: any) => {
            if (err.error.status == 400 || err.error.status == 404||err.error.status > 0){
              this.sweetAlertMessages.swalAlertMessage("Error", "error", err.error.message);
              this.process=false;
            }
          }
        )

      }
    }
  }


  // -------------------------***********OTP RELEATED DATA*************----------------------------------------------
  // email: any = "";
  otp: any = '';

  auth: Auth = new Auth();

  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  // verify user by email and otp
  verifyUser() {
    this.authService.changeEmail.subscribe({
      next: (data: any) => {
        this.email = data;

      }
    })
    if (this.email != undefined || this.email != null)
      this.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
    this.authService.verifyUser(this.email, this.otp).subscribe((data: any) => {
      this.sweetAlertMessages.alertMessage('success', 'Your Otp Is Verified successfully.')

      this.otp1 = '';
      this.otp2 = '';
      this.otp3 = '';
      this.otp4 = '';
      this.authService.myOtp.next(this.otp);
      this.otp = '';
      this.authService.email.next(this.email);
      this.myPage = this.mySelectedForm.ChangePasswordPage;

      // this.router.navigate(['forget']);
    }, (err) => {
      if (err.error.status === 404)
        this.sweetAlertMessages.alertMessage('error', "Your Otp Is Already Used");

      if (err.error.status > 0)
        this.sweetAlertMessages.alertMessage('error', err.error.message)
      this.otp1 = '';
      this.otp2 = '';
      this.otp3 = '';
      this.otp4 = '';

    })
  }
  resendOpt() {
    this.authService.changeEmail.subscribe({
      next: (data: any) => {
        this.email = data;
      }
    })
    if (this.email != undefined || this.email != null)
      this.authService.resendOptForEmailVerification(this.email, "resend").subscribe((data: any) => {
        this.otp1 = '';
        this.otp2 = '';
        this.otp3 = '';
        this.otp4 = '';
        this.authService.email.next(this.email);
        this.sweetAlertMessages.swalAlertMessage("Resend Otp SuccessFully!!", "success", "Check Your  Mail Inbox");

      }, (err) => {
        if (err.status === 401)
          this.sweetAlertMessages.swalAlertMessage("TimeOut?", "error", err.error.message);

        if (err.status === 404)
          this.sweetAlertMessages.swalAlertMessage("Email Not Found !!", "error", err.error.message);

        else
          this.sweetAlertMessages.swalAlertMessage("Error", "error", err.error.message);
        this.otp1 = '';
        this.otp2 = '';
        this.otp3 = '';
        this.otp4 = '';

      })
  }

  // -------------------------***********Forgant Pass RELEATED DATA*************----------------------------------------------


  confirmPassword: string = '';

  changeForgetPassword() {
    this.firstTaskFormControl2();
    if (this.auth.password != this.confirmPassword)
      this.sweetAlertMessages.alertMessage('error', 'Password And Confirm Password Must Be Same.')

    else if (this.myForm2.valid && this.passwordMatchValidator() && this.auth.password == this.confirmPassword) {

      this.authService.changeEmail.subscribe({
        next: (data: any) => {
          this.auth.email = data;
        }
      })
      this.authService.usedOtp.subscribe({
        next: (data: any) => {
          this.otp = data;
        }
      })
      this.authService.changeForgetPassword(this.auth, this.otp).subscribe(
        (data: any) => {
          this.sweetAlertMessages.swalAlertMessage("Password Changed", "success", "Login With New Password!!");

          this.confirmPassword = '';
          this.myForm2.reset();
          this.router.navigate(['login'])
        },
        (err) => {
          if (err.error.status == 401)
            this.sweetAlertMessages.swalAlertMessage("Error", "error", "Invalid Otp!!");

          if (err.error.status == 404)
            this.sweetAlertMessages.swalAlertMessage("Error", "error", "User Not Found!!");

          else if (err.error.status > 0)
            this.sweetAlertMessages.swalAlertMessage("Error", "error", err.error.message);
        })
    }
    else {
      return;
    }


  }
  public firstTaskFormControl2() {
    Object.keys(this.myForm2.controls).forEach(key => {
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


  //for Otp Move bar From One to Another Input Box 
  moveToNext(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const inputLength = input.value.length;

    if (inputLength === 1) {
      if (index < 4) {
        const nextInput = input.nextElementSibling as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (inputLength === 0) {
      if (index > 1) {
        const prevInput = input.previousElementSibling as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  }


}

