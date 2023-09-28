import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists: any;
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const listId = params['listId'];
      console.log(params);
      console.log('listId:', listId);
      this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
        console.log('Tasks:', tasks);
        this.tasks = tasks;
      });
    });
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }
}
