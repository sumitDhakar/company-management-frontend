import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class AppUtils {

  public static modelDismiss(id: any) {
    let element = document.getElementById(id);
    element?.click();
  }

  public static formSubmittion(addForm: any) {
    Object.keys(addForm.controls).forEach((key) => {
      const control = addForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    document.querySelector('input.ng-invalid');
  }

  public static isEmail(control: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(control.value)) {

      return null;
    }

    return { 'invalidEmail': true };

  }

  public static notSundayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value as Date);
      console.log('date', selectedDate);

      if (!selectedDate || selectedDate.getDay() !== 0) {
        return null; // Valid date or no date selected
      }

      return { notSunday: true }; // Sunday is not allowed
    };
  }

  public static isTitleValid() {
    // const title = /^[A-Z]{1}([a-z]*\s*)+$/;
    // if (title.test(control.value)) {
    //   return null;
    // }
    // return { 'title': true };

    return (control: AbstractControl): ValidationErrors | null => {
      const title = /^[A-Z]{1}([A-za-z]*\s*)+$/;
      if (title.test(control.value)) {
        return null; // Valid date or no date selected
      }

      return { 'title': true };
    };
  }

  public static isPhoneValid() {
    // const title = /^[A-Z]{1}([a-z]*\s*)+$/;
    // if (title.test(control.value)) {
    //   return null;
    // }
    // return { 'title': true };

    return (control: AbstractControl): ValidationErrors | null => {
      const title = /^[6-9]{1}[0-9]{9}$/;
      if (title.test(control.value)) {
        return null; // Valid date or no date selected
      }

      return { 'phone': true };
    };
  }



  static min() {



    return (control: AbstractControl): ValidationErrors | null => {
      let title = control.value as string
      if (title == null) {
        return { min: false };
      }
      if (title.length >= 3) {
        return null; // Valid date or no date selected
      }



      return { min: true }; // Sunday is not allowed
    };
  }
  static max() {
    return (control: AbstractControl): ValidationErrors | null => {
      let title = control.value as string
      if (title == null) {
        return { max: false };
      } if (title.length <= 50) {
        return null; // Valid date or no date selected
      }
      return { max: true }; // Sunday is not allowed
    };
  }



}







