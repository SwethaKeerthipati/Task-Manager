export class Task {
  title: string;
  _id: string;
  _listId: String;
  completed: Boolean;

  constructor() {
    this.title = '';
    this._id = '';
    this._listId = '';
    this.completed = false;
  }
}
