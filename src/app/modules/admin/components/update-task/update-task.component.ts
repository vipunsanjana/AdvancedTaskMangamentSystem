import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.scss'
})
export class UpdateTaskComponent {

  updateTaskForm!: FormGroup;
  listOfEmployee: any = [];
  listOfPriorites: any = [ "LOW", "MEDIUM", "HIGH" ];
  listOfTaskStatus: any = [ "PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELED" ];



  id: number = this.route.snapshot.params['id'];

  constructor(private service: AdminService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute){
    this.getTaskById();
    this.getUsers();
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]],
    })
  }

  getTaskById(){
    this.service.getTaskById(this.id).subscribe((res) => {
      this.updateTaskForm.patchValue(res);
      console.log(res);
    })
  }

  getUsers(){
    this.service.getUsers().subscribe((res) => {
      this.listOfEmployee = res;
      console.log(res);
    })
  }

  updateTask(){
    console.log(this.updateTaskForm.value);
    this.service.updateTask(this.id, this.updateTaskForm.value).subscribe((res) => {
      console.log(res);

      if(res.id != null){
        this.snackBar.open("Task updated successfully", "Close", { duration: 5000 });    
        this.router.navigateByUrl("/admin/dashboard");
      }else{
        this.snackBar.open("Task update  failed. Try again.", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    })  
  }

}
