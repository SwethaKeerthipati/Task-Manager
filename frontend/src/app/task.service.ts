import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { List } from './models/list.model';
import { Task } from './models/task.model';
import { compileClassMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  getLists(): Observable<List[]> {
    return this.webReqService.get('lists') as Observable<List[]>;
  }

  createList(title: string): Observable<List> {
    return this.webReqService.post('lists', { title }) as Observable<List>;
  }

  getTasks(listId: string): Observable<Task[]> {
    return this.webReqService.get(`lists/${listId}/tasks`) as Observable<
      Task[]
    >;
  }

  createTask(title: string, listId: string): Observable<Task> {
    return this.webReqService.post(`lists/${listId}/tasks`, {
      title,
    }) as Observable<Task>;
  }
  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed,
    });
  }
}
