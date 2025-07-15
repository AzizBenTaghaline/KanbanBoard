import React from "react";
import { MessageSquare, Paperclip, X } from 'lucide-react';
import AddTaskModal from "./addTaskButton";
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
                const { newTask, tasks, activeColumn } = this.state;
                if (newTask.title.trim()) {
                    const task = {
                        id: Date.now(),
                        ...newTask,
                        status: activeColumn,
                        comments: 0,
                        attachments: 0,
                    };
                    this.setState({
                        tasks: [...tasks, task],
                        newTask: {
                            title: '',
                            description: '',
                            assignee: '',
                            priority: 'medium',
                        },
                        showAddTask: false,
                        activeColumn: null
                    });
                }
            };

openAddTaskModal = (columnId) => {
                this.setState({
                    activeColumn: columnId,
                    showAddTask: true
                });
            };

            closeAddTaskModal = () => {
                this.setState({
                    showAddTask: false,
                    activeColumn: null
                });
            };

            handleInputChange = (field, value) => {
                this.setState({
                    newTask: {
                        ...this.state.newTask,
                        [field]: value
                    }
                });
            };

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
                  <button className="add-task-btn" onClick={() => this.openAddTaskModal(column.id)}>+ Add Task</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AddTaskModal/>
      </div>
    ); 
  }
}

export default KanbanTest;