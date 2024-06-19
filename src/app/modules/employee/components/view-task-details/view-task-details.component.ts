import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-task-details',
  templateUrl: './view-task-details.component.html',
  styleUrl: './view-task-details.component.scss'
})
export class ViewTaskDetailsComponent {

  taskId: number;
  taskData: any;
  commentForm!: FormGroup;
  comments: any;

  constructor(
    private service: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.taskId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getTaskById();
    this.getComments();
    this.commentForm = this.fb.group({
      content: [null, Validators.required]
    });
  }

  getTaskById() {
    this.service.getTaskById(this.taskId).subscribe(res => {
      this.taskData = res;
    });
  }


  getComments(){
    this.service.getCommentByTask(this.taskId).subscribe((res) => {
      this.comments = res;
      //console.log(res)
    })
  }

  publishComment() {
    const content = this.commentForm.get('content')?.value;
    this.service.createComment(this.taskId, content).subscribe(
      res => {
        this.snackBar.open('Comment posted successfully', 'Close', { duration: 5000 });
        this.getComments();
      },
      err => {
        console.error(err);
        this.snackBar.open('Something went wrong', 'Close', { duration: 5000 });
      }
    );
  }



}
