import React from "react";
import { MessageSquare, Paperclip, X } from 'lucide-react';
class KanbanTest extends React.Component{
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

      draggedTask: null,
      showAddTask: false,
      activeColumn: null,
      newTask: {
              title: '',
              description: '',
              assignee: '',
              priority: 'medium'
   }
    };
  }

  getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  }

  getPriorityClass(priority) {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  }

  getTasksForColumn(columnId) {
    return this.state.tasks.filter(task => task.status === columnId);
  }

//Drag and Drop 
 
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

// Add Task 
 handleAddTask = () => {
  const { tasks, newTask , activeColumn } = this.state;
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTaskWithDefaults = {
    ...newTask,
    id: newId,
    comments: 0,
    attachments: 0,
    status:  activeColumn || 'todo'
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
    }
  });
};

  handleInputChange = (field, value) => {
    this.setState({
        newTask: {
        ...this.state.newTask,
        [field]: value
      }
    });
  }

  openModal = (columnId) => {
    this.setState({ 
      showAddTask: true ,
      activeColumn: columnId
    });
  }

  closeModal = () => {
    this.setState({ 
      showAddTask: false,
      activeColumn: null
     });
  }
//BasicStracture

render(){
    const { tasks, showAddTask, newTask } = this.state;
    const columns = [
    {
      id: 'todo',
      title: 'To Do',
      className: 'border-blue'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      className: 'border-yellow'
    },
    {
      id: 'review',
      title: 'Review',
      className: 'border-purple'
    },
    {
      id: 'done',
      title: 'Done',
      className: 'border-green'
    }
  ];
    return( 
      <div> 
        <div className="kanban-wrapper">
          <div className="kanban-header">
            <div className="kanban-header-container">
              <h1 className="kanban-title">Project Kanban Board</h1>
              <div className="kanban-buttons"> 
                <button className="settings-btn">⚙️ Settings</button>
              </div>
            </div>
          </div>
          <div className="kanban-main">
            <div className="kanban-columns">
              {columns.map((column) => (
                <div key={column.id} onDragOver={this.handleDragOver} onDrop={(e) => this.handleDrop(e, column.id)} className={`kanban-column ${column.className}`}>
                  <div className="column-header">
                    <div className="column-header-content">
                      <div className="column-title">
                        <span>{column.title}</span>
                        <span className="task-count">{this.getTasksForColumn(column.id).length}</span>
                      </div>
                      <button className="column-menu">⋮</button>
                    </div>
                  </div>
                
                  <div className="column-content">
                    {this.getTasksForColumn(column.id).length === 0 ? (
                      <div className="no-tasks">No tasks yet</div>
                    ) : (
                      this.getTasksForColumn(column.id).map(task => (
                        <div key={task.id} draggable onDragStart={(e) => this.handleDragStart(e, task)} className="task-card">
                          <div className="task-title">{task.title}</div>
                          <div className="task-desc">{task.description}</div>
                          <div className="task-footer">
                            <div className="assignee">
                              <div className="avatar">{this.getInitials(task.assignee)}</div>
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
                            </div>                     
                            <span className={`priority-tag ${this.getPriorityClass(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                          <button 
                            onClick={()=>this.openModal(column.id)}
                            className="add-task-btn"
                          >
                            + Add Task
                          </button>
                        </div>
                </div>
              ))}
            </div>
            {showAddTask && (
                            <div style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 50
                            }}>
                              <div style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '24px',
                                width: '100%',
                                maxWidth: '28rem',
                                margin: '0 16px',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '16px'
                                }}>
                                  <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    margin: 0
                                  }}>Add New Task</h3>
                                  <button
                                    onClick={this.closeModal}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#9ca3af',
                                      cursor: 'pointer',
                                      padding: '4px'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#6b7280'}
                                    onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                  
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  <div>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#374151',
                                      marginBottom: '8px'
                                    }}>Title</label>
                                    <input
                                      type="text"
                                      value={newTask.title}
                                      onChange={(e) => this.handleInputChange('title', e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                      }}
                                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                      placeholder="Enter task title"
                                    />
                                  </div>
                  
                                  <div>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#374151',
                                      marginBottom: '8px'
                                    }}>Description</label>
                                    <textarea
                                      value={newTask.description}
                                      onChange={(e) => this.handleInputChange('description', e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        resize: 'vertical',
                                        minHeight: '80px',
                                        boxSizing: 'border-box'
                                      }}
                                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                      placeholder="Enter task description"
                                    />
                                  </div>
                  
                                  <div>
                                    <label style={{
                                      display: 'block',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#374151',
                                      marginBottom: '8px'
                                    }}>Assignee</label>
                                    <input
                                      type="text"
                                      value={newTask.assignee}
                                      onChange={(e) => this.handleInputChange('assignee', e.target.value)}
                                      style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                      }}
                                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                      placeholder="Enter assignee name"
                                    />
                                  </div>
                  
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '16px'
                                  }}>
                                    <div>
                                      <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '8px'
                                      }}>Priority</label>
                                      <select
                                        value={newTask.priority}
                                        onChange={(e) => this.handleInputChange('priority', e.target.value)}
                                        style={{
                                          width: '100%',
                                          padding: '8px 12px',
                                          border: '1px solid #d1d5db',
                                          borderRadius: '8px',
                                          fontSize: '14px',
                                          outline: 'none',
                                          backgroundColor: 'white',
                                          boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                      >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                  
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  gap: '12px',
                                  marginTop: '24px'
                                }}>
                                  <button
                                    onClick={this.closeModal}
                                    style={{
                                      padding: '8px 16px',
                                      color: '#6b7280',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      backgroundColor: 'white',
                                      cursor: 'pointer',
                                      fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={this.handleAddTask}
                                    style={{
                                      padding: '8px 16px',
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                  >
                                    Add Task
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
          </div>
        </div>
      </div>
    ); 
  }
}

export default KanbanTest;