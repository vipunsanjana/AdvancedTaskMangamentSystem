import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  
  signinForm! : FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService,private snackBar: MatSnackBar, private router: Router){
    this.signinForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    })
  }

  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    console.log(this.signinForm.value);
    this.authService.login(this.signinForm.value).subscribe((res) => {
      console.log(res);

      if(res.userId != null){


        const user = {
          id: res.userId,
          role: res.userRole
        }

        StorageService.saveUser(user);
        StorageService.saveToken(res.jwt);

        if(StorageService.isAdminLoggedIn()){
           this.router.navigateByUrl("/admin/dashboard");
        }

        else if(StorageService.isEmployeeLoggedIn()){
          this.router.navigateByUrl("/employee/dashboard");
        }
        this.snackBar.open("Login successfull", "Close", { duration: 5000 });
       
      }else{
        this.snackBar.open("Invalid credetials. Try again.", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    })
  }


}
