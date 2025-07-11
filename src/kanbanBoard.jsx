import React from 'react';
import './App.css'; 

const KanbanBoard = () => {
  const columns = [
    {
      id: 'todo',
      title: '📋 To Do',
      className: 'border-blue'
    },
    {
      id: 'in-progress',
      title: '🚀 In Progress',
      className: 'border-yellow'
    },
    {
      id: 'review',
      title: '👀 Review',
      className: 'border-purple'
    },
    {
      id: 'done',
      title: '✅ Done',
      className: 'border-green'
    }
  ];

  return (
    <div className="kanban-wrapper">
      <div className="kanban-header">
        <div className="kanban-header-container">
          <h1 className="kanban-title">Project Kanban Board</h1>
          <div className="kanban-buttons">
            <button className="settings-btn">⚙️ Settings</button>
            <button className="add-btn">+ Add Task</button>
          </div>
        </div>
      </div>

      <div className="kanban-main">
        <div className="kanban-columns">
          {columns.map((column) => (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <div className="column-header-content">
                  <div className="column-title">
                    <span>{column.title}</span>
                    <span className="task-count">0</span>
                  </div>
                  <button className="column-menu">⋮</button>
                </div>
              </div>

              <div className={`column-body ${column.className}`}>
                <div className="empty-text">No tasks yet</div>
              </div>

              <button className="add-task-btn">+ Add Task</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
