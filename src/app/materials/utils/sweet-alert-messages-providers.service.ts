import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertMessagesProvidersService {

  alertMessage(icon: SweetAlertIcon = 'error', message: string = 'Something went wrong !!!') {

    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })
    Toast.fire({
      icon: icon,
      title: message
    })
  }


  showSwalAlertWithDenyButtonMessage(title: string = 'error', message: string) {

   return  Swal.fire({
      title: title,
      text: message,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: '#ff9b44',
      // denyButtonColor:'',/
    });
  }




  swalAlertMessage(title: string = 'success',icon: SweetAlertIcon = 'error', message: string = 'Something went wrong !!!') {

  return   Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }

}
