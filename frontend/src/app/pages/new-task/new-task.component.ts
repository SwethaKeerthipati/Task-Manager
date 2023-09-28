import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  listId!: string;
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
      console.log(this.listId);
    });
  }

  // createTask(title: string) {
  //   this.taskService
  //     .createTask(title, this.listId)
  //     .subscribe((newTask: any) => {
  //       console.log(newTask, this.listId);
  //       this.router.navigate(['../'], { relativeTo: this.route });
  //     });
  createTask(title: string) {
    this.taskService.createList(title).subscribe((newTask: any) => {
      console.log(newTask);
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
