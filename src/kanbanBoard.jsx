import React from "react";
import { MessageSquare, Paperclip, X } from 'lucide-react';
import './App.css';

const borderColorClasses = {
  'border-blue-500': 'border-blue',
  'border-yellow-500': 'border-yellow',
  'border-purple-500': 'border-purple',
  'border-green-500': 'border-green',
  'border-red-500': 'border-red',
  'border-orange-500': 'border-orange',
  'border-indigo-500': 'border-indigo',
  'border-pink-500': 'border-pink'
};

class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
        {
          id: 1,
          title: "Design new landing page",
          description: "Create wireframes and mockups for the new company landing page",
          assignee: "John Doe",
          comments: 3,
          attachments: 2,
          priority: "high",
          status: "todo"
        },
        {
          id: 2,
          title: "User research interviews",
          description: "Conduct 5 user interviews to understand customer needs",
          assignee: "Sarah Miller",
          comments: 4,
          attachments: 1,
          priority: "medium",
          status: "todo"
        },
        {
          id: 3,
          title: "Implement authentication",
          description: "Add OAuth2 authentication system",
          assignee: "Mike Johnson",
          priority: "high",
          comments: 1,
          attachments: 2,
          status: "in-progress"
        },
        {
          id: 4,
          title: "Code review - Payment system",
          description: "Review payment integration code before deployment",
          assignee: "Robert Smith",
          comments: 0,
          attachments: 2,
          priority: "high",
          status: "review"
        },
        {
          id: 5,
          title: "Setup CI/CD pipeline",
          description: "Configure automated testing and deployment",
          assignee: "Tom Green",
          priority: "medium",
          comments: 1,
          attachments: 1,
          status: "done"
        }
      ],
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          className: 'border-blue-500'
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          className: 'border-yellow-500'
        },
        {
          id: 'review',
          title: 'Review',
          className: 'border-purple-500'
        },
        {
          id: 'done',
          title: 'Done',
          className: 'border-green-500'
        }
      ],
      showAddColumnModal: false,
      showDeleteModal: false,
      draggedTask: null,
      newColumnName: '',
      showAddTask: false,
      activeColumn: null,
      columnToDelete: null,
      openDropdown: null,
      newTask: {
        title: '',
        description: '',
        assignee: '',
        priority: 'medium'
      },
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (!event.target.closest('.column-dropdown') && this.state.openDropdown) {
      this.setState({ openDropdown: null });
    }
  };

  getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  }

  getPriorityClass(priority) {
    return `priority-badge priority-${priority}`;
  }

  getTasksForColumn(columnId) {
    return this.state.tasks.filter(task => task.status === columnId);
  }

  getAvailableColors() {
    const usedColors = this.state.columns.map(col => col.className);
    const allColors = ['border-blue-500', 'border-yellow-500', 'border-purple-500', 'border-green-500', 'border-red-500', 'border-orange-500', 'border-indigo-500', 'border-pink-500'];
    return allColors.find(color => !usedColors.includes(color)) || 'border-blue-500';
  }

  validateTask = () => {
    const { newTask } = this.state;
    const errors = {};

    if (!newTask.title.trim()) {
      errors.title = 'Task title is required';
    }

    if (!newTask.assignee.trim()) {
      errors.assignee = 'Assignee is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  validateColumn = () => {
    const { newColumnName, columns } = this.state;
    const errors = {};

    if (!newColumnName.trim()) {
      errors.columnName = 'Column name is required';
    } else if (columns.some(col => col.title.toLowerCase() === newColumnName.toLowerCase())) {
      errors.columnName = 'Column name already exists';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleDragStart = (e, task) => {
    this.setState({ draggedTask: task });
    e.dataTransfer.effectAllowed = 'move';
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  handleDrop = (e, columnId) => {
    e.preventDefault();
    const { draggedTask, tasks } = this.state;
    if (draggedTask && draggedTask.status !== columnId) {
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id
          ? { ...task, status: columnId }
          : task
      );
      this.setState({ tasks: updatedTasks, draggedTask: null });
    }
  };

  handleAddTask = () => {
    if (!this.validateTask()) {
      return;
    }

    const { tasks, newTask, activeColumn } = this.state;
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTaskWithDefaults = {
      ...newTask,
      id: newId,
      comments: 0,
      attachments: 0,
      status: activeColumn || 'todo'
    };

    this.setState({
      tasks: [...tasks, newTaskWithDefaults],
      showAddTask: false,
      activeColumn: null,
      newTask: {
        title: '',
        description: '',
        assignee: '',
        priority: 'medium'
      },
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  };

  handleInputChange = (field, value) => {
    this.setState({
      newTask: {
        ...this.state.newTask,
        [field]: value
      },
      errors: {
        ...this.state.errors,
        [field]: ''
      }
    });
  }

  handleAddColumn = () => {
    if (!this.validateColumn()) {
      return;
    }

    const { columns, newColumnName } = this.state;
    const newColumnId = newColumnName.toLowerCase().replace(/\s+/g, '-');
    const newColumn = {
      id: newColumnId,
      title: newColumnName,
      className: this.getAvailableColors()
    };
    
    this.setState({
      columns: [...columns, newColumn],
      showAddColumnModal: false,
      newColumnName: '',
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  };

  handleDeleteColumn = () => {
    const { columns, tasks, columnToDelete } = this.state;
    if (columnToDelete) {
      const updatedColumns = columns.filter(col => col.id !== columnToDelete);
      const updatedTasks = tasks.filter(task => task.status !== columnToDelete);
      
      this.setState({
        columns: updatedColumns,
        tasks: updatedTasks,
        showDeleteModal: false,
        columnToDelete: null,
        openDropdown: null
      });
    }
  };

  openAddTaskModal = (columnId) => {
    this.setState({ 
      showAddTask: true,
      activeColumn: columnId,
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  }

  closeAddTaskModal = () => {
    this.setState({ 
      showAddTask: false,
      activeColumn: null,
      newTask: {
        title: '',
        description: '',
        assignee: '',
        priority: 'medium'
      },
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  }

  openAddColumnModal = () => {
    this.setState({ 
      showAddColumnModal: true,
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  }

  closeAddColumnModal = () => {
    this.setState({ 
      showAddColumnModal: false,
      newColumnName: '',
      errors: {
        title: '',
        assignee: '',
        columnName: ''
      }
    });
  }

  openDeleteModal = (columnId) => {
    this.setState({ 
      showDeleteModal: true,
      columnToDelete: columnId,
      openDropdown: null
    });
  }

  closeDeleteModal = () => {
    this.setState({ 
      showDeleteModal: false,
      columnToDelete: null
    });
  }

  toggleDropdown = (columnId) => {
    this.setState({
      openDropdown: this.state.openDropdown === columnId ? null : columnId
    });
  }

  handleColumnNameChange = (value) => {
    this.setState({ 
      newColumnName: value,
      errors: {
        ...this.state.errors,
        columnName: ''
      }
    });
  }

  render() {
    const { 
      tasks, 
      columns,
      showAddTask, 
      showAddColumnModal,
      showDeleteModal,
      newTask, 
      newColumnName,
      columnToDelete,
      openDropdown,
      errors
    } = this.state;

    return (
      <div className="container">
        <div className="header">
          <div className="header-content">
            <h1 className="title">Project Kanban Board</h1>
            <div className="header-buttons">
              <button className="btn-primary" onClick={this.openAddColumnModal}>
                + Add Column
              </button>
              <button className="btn-secondary">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>

        <div className="board-container">
          <div className="columns-container">
            {columns.map((column) => (
              <div 
                key={column.id} 
                onDragOver={this.handleDragOver} 
                onDrop={(e) => this.handleDrop(e, column.id)} 
                className={`column ${borderColorClasses[column.className]}`}
              >
                <div className="column-header">
                  <div className="column-header-content">
                    <div className="column-title">
                      <span className="column-title-text">{column.title}</span>
                      <span className="task-count">
                        {this.getTasksForColumn(column.id).length}
                      </span>
                    </div>
                    <div className="column-dropdown dropdown">
                      <button 
                        className="dropdown-button"
                        onClick={() => this.toggleDropdown(column.id)}
                      >
                        ⋮
                      </button>
                      {openDropdown === column.id && (
                        <div className="dropdown-menu">
                          <button 
                            onClick={() => this.openDeleteModal(column.id)} 
                            className="dropdown-item"
                          >
                            Delete Column
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              
                <div className="tasks-container">
                  {this.getTasksForColumn(column.id).length === 0 ? (
                    <div className="empty-state">No tasks yet</div>
                  ) : (
                    this.getTasksForColumn(column.id).map(task => (
                      <div 
                        key={task.id} 
                        draggable 
                        onDragStart={(e) => this.handleDragStart(e, task)} 
                        className="task"
                      >
                        <div className="task-title">{task.title}</div>
                        <div className="task-description">{task.description}</div>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <div className="avatar">
                              {this.getInitials(task.assignee)}
                            </div>
                            <span className="assignee-name">{task.assignee}</span>
                          </div>
                          <div className="task-meta">
                            {task.comments > 0 && (
                              <div className="meta-item">
                                <MessageSquare size={14} />
                                <span className="meta-text">{task.comments}</span>
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="meta-item">
                                <Paperclip size={14} />
                                <span className="meta-text">{task.attachments}</span>
                              </div>
                            )}
                            <span className={this.getPriorityClass(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <button 
                  onClick={() => this.openAddTaskModal(column.id)}
                  className="add-task-button"
                >
                  + Add Task
                </button>
              </div>
            ))}
          </div>

          {showAddTask && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Add New Task</h3>
                  <button onClick={this.closeAddTaskModal} className="close-button">
                    <X size={20} />
                  </button>
                </div>

                <div>
                  <div className="form-group">
                    <label className="label">Title *</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => this.handleInputChange('title', e.target.value)}
                      className={`input ${errors.title ? 'input-error' : ''}`}
                      placeholder="Enter task title"
                    />
                    {errors.title && <p className="error-text">{errors.title}</p>}
                  </div>

                  <div className="form-group">
                    <label className="label">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => this.handleInputChange('description', e.target.value)}
                      className="textarea"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Assignee *</label>
                    <input
                      type="text"
                      value={newTask.assignee}
                      onChange={(e) => this.handleInputChange('assignee', e.target.value)}
                      className={`input ${errors.assignee ? 'input-error' : ''}`}
                      placeholder="Enter assignee name"
                    />
                    {errors.assignee && <p className="error-text">{errors.assignee}</p>}
                  </div>

                  <div className="form-group">
                    <label className="label">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => this.handleInputChange('priority', e.target.value)}
                      className="select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="modal-buttons">
                  <button onClick={this.closeAddTaskModal} className="btn-cancel">
                    Cancel
                  </button>
                  <button onClick={this.handleAddTask} className="btn-primary">
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddColumnModal && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Add New Column</h3>
                  <button onClick={this.closeAddColumnModal} className="close-button">
                    <X size={20} />
                  </button>
                </div>

                <div>
                  <div className="form-group">
                    <label className="label">Column Name *</label>
                    <input
                      type="text"
                      value={newColumnName}
                      onChange={(e) => this.handleColumnNameChange(e.target.value)}
                      className={`input ${errors.columnName ? 'input-error' : ''}`}
                      placeholder="Enter column name"
                    />
                    {errors.columnName && <p className="error-text">{errors.columnName}</p>}
                  </div>
                </div>

                <div className="modal-buttons">
                  <button onClick={this.closeAddColumnModal} className="btn-cancel">
                    Cancel
                  </button>
                  <button onClick={this.handleAddColumn} className="btn-primary">
                    Add Column
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Delete Column</h3>
                  <button onClick={this.closeDeleteModal} className="close-button">
                    <X size={20} />
                  </button>
                </div>

                <div className="delete-text">
                  <p>Are you sure you want to delete this column? All tasks in this column will also be deleted.</p>
                </div>

                <div className="modal-buttons">
                  <button onClick={this.closeDeleteModal} className="btn-cancel">
                    Cancel
                  </button>
                  <button onClick={this.handleDeleteColumn} className="btn-danger">
                    Delete Column
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default KanbanBoard;