import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { ESCAPE_KEY, ENTER_KEY } from './config';

export class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = { editText: this.props.todo.title };
  }

  handleSubmit = event => {
    let val = this.state.editText.trim();

    if (val) {
      this.props.onSave(val);
      this.setState({ editText: val });
    }

    else {
      this.props.onDestroy();
    }
  }

  handleEdit = () => {
    this.props.onEdit();
    this.setState({ editText: this.props.todo.title });
  }

  handleKeyDown = event => {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title });
      this.props.onCancel(event);
    }

    else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  }

  handleChange = event => {
    if (this.props.editing) {
      this.setState({ editText: event.target.value });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.props.editText
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      let node = ReactDOM.findDOMNode(this.refs.editField);

      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}
