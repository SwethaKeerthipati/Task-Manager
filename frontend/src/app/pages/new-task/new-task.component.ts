// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Params } from '@angular/router';
// import { Task } from 'src/app/models/task.model';
// import { TaskService } from 'src/app/task.service';

// @Component({
//   selector: 'app-new-task',
//   templateUrl: './new-task.component.html',
//   styleUrls: ['./new-task.component.scss'],
// })
// export class NewTaskComponent implements OnInit {
//   constructor(
//     private taskService: TaskService,
//     private route: ActivatedRoute
//   ) {}

//   listId: string = '';

//   ngOnInit() {
//     this.route.params.subscribe((params: Params) => {
//       this.listId = params['listId'];
//     });
//   }

//   createTask(title: string, listId: string) {
//     this.taskService.createTask(title, this.listId).subscribe({
//       next: (newTask: Task) => {
//         console.log(newTask);
//       },
//       error: (error: any) => {
//         console.error('An error occurred:', error);
//         console.error('Error Message:', error.message);
//       },
//       complete: () => {
//         console.log('Task creation complete.');
//       },
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  listId: string = '';

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
    });
  }

  createTask(title: string) {
    this.taskService
      .createTask(title, this.listId)
      .subscribe((newTask: Task) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
