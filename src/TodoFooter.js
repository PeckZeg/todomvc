import classNames from 'classnames';
import React, { Component } from 'react';

import { pluralize } from './utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './config';

export class TodoFooter extends Component {
  render() {
    let activeTodoWord = pluralize(this.props.count, 'item');
    let clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.onClearCompleted}
        >
          Clear completed
        </button>
      );
    }

    let nowShowing = this.props.nowShowing;

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href="#/"
              className={classNames({ selected: nowShowing === ALL_TODOS })}
            >
              All
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/active"
              className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            >
              Active
            </a>
          </li>
          {' '}
          <li>
            <a
              href="#/completed"
              className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            >
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}
