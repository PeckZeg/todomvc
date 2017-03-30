import React, { Component } from 'react';
import { Router } from 'director';

import { partial } from 'lodash';

import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';

import {
  ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS,
  ENTER_KEY
} from './config';

export class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: ''
    };
  }

  componentDidMount() {
    let { setState } = this;
    let router = Router({
      '/': setState.bind(this, { nowShowing: ALL_TODOS }),
      '/active': setState.bind(this, { nowShowing: ACTIVE_TODOS }),
      '/completed': setState.bind(this, { nowShowing: COMPLETED_TODOS })
    });
    router.init('/');
  }

  handleChange = (event) => {
    this.setState({ newTodo: event.target.value });
  }

  handleNewTodoKeyDown = (event) => {
    if (event.keyCode !== ENTER_KEY) {
      return ;
    }

    event.preventDefault();

    let val = this.state.newTodo.trim();

    if (val) {
      this.props.model.addTodo(val);
      this.setState({ newTodo: '' });
    }
  }

  toggleAll = (event) => {
    this.props.model.toggleAll(event.target.checked);
  }

  toggle = todoToToggle => {
    this.props.model.toggle(todoToToggle);
  }

  destroy = todo => {
    this.props.model.destroy(todo);
  }

  edit = todo => {
    this.setState({ editing: todo.id });
  }

  save = (todoToSave, text) => {
    this.props.model.save(todoToSave, text);
    this.setState({ editing: null });
  }

  cancel = () => {
    this.setState({ editing: null });
  }

  clearCompleted = () => {
    this.props.model.clearCompleted();
  }

  render() {
    let main, footer;
    let { todos } = this.props.model;

    let shownTodos = todos.filter(todo => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;

        case COMPLETED_TODOS:
          return todo.completed;

        default:
          return true;
      }
    });

    let todoItems = shownTodos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={partial(this.toggle, todo)}
        onDestroy={partial(this.destroy, todo)}
        onEdit={partial(this.edit, todo)}
        editing={this.state.editing === todo.id}
        onSave={partial(this.save, todo)}
        onCancel={this.cancel}
      />
    ));

    let activeTodoCount = todos.reduce((accum, todo) => (
      todo.completed ? accum : accum + 1
    ), 0);

    let completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = <TodoFooter
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={this.state.nowShowing}
        onClearCompleted={this.clearCompleted}
      />;
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
        <ul className="todo-list">
          {todoItems}
        </ul>
        </section>
      );
    }

    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={this.state.newTodo}
            onKeyDown={this.handleNewTodoKeyDown}
            onChange={this.handleChange}
            autoFocus={true} />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}
