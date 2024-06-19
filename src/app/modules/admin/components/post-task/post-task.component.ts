import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrl: './post-task.component.scss'
})
export class PostTaskComponent {

  taskForm!: FormGroup;
  listOfEmployee: any = [];
  listOfPriorites: any = [ "LOW", "MEDIUM", "HIGH" ];


  constructor(private adminService: AdminService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.getUsers();
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
    })
  }

  getUsers(){
    this.adminService.getUsers().subscribe((res) => {
      this.listOfEmployee = res;
      console.log(res);
    })
  }

  postTask(){
    console.log(this.taskForm.value);
    this.adminService.postTask(this.taskForm.value).subscribe((res) => {
      console.log(res);

      if(res.id != null){
        this.snackBar.open("Task posted successfully", "Close", { duration: 5000 });    
        this.router.navigateByUrl("/admin/dashboard");
      }else{
        this.snackBar.open("Task post failed. Try again.", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    })  
  }

}
