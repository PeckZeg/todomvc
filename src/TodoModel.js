import { uuid, store } from './utils';

export class TodoModel {
  constructor(key) {
    this.key = key;
    this.todos = store(key);
    this.onChanges = [];
  }

  subscribe(onChange) {
    this.onChanges.push(onChange);
  }

  inform() {
    store(this.key, this.todos);
    this.onChanges.forEach(cb => cb());
  }

  addTodo(title) {
    this.todos = this.todos.concat({
      id: uuid(),
      title,
      completed: false
    });

    this.inform();
  }

  toggleAll(checked) {
    this.todos = this.todos.map(todo => Object.assign({}, todo, {
      completed: checked
    }));

    this.inform();
  }

  toggle(todoToToggle) {
    this.todos = this.todos.map(todo => (
      todo !== todoToToggle ? todo : Object.assign({}, todo, {
        completed: !todo.completed
      })
    ));

    this.inform();
  }

  destroy(todo) {
    this.todos = this.todos.filter(candidate => candidate !== todo);
    this.inform();
  }

  save(todoToSave, text) {
    this.todos = this.todos.map(todo => (
      todo !== todoToSave ? todo : Object.assign({}, todo, { title: text })
    ));

    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.inform();
  }
}
