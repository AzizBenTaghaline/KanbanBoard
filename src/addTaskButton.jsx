import React, { Component } from 'react';
import { X, Plus, Edit2, Trash2, MoreHorizontal, Settings } from 'lucide-react';

class KanbanBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { id: 1, name: 'To Do', color: 'blue', tasks: [] },
        { id: 2, name: 'In Progress', color: 'yellow', tasks: [] },
        { id: 3, name: 'Review', color: 'purple', tasks: [] },
        { id: 4, name: 'Done', color: 'green', tasks: [] }
      ],
      showAddColumnModal: false,
      showEditColumnModal: false,
      showDeleteModal: false,
      activeColumn: null,
      newColumnName: '',
      newColumnColor: 'blue',
      activeDropdown: null
    };

    this.colorOptions = [
      { value: 'blue', label: 'Blue', color: '#3b82f6' },
      { value: 'yellow', label: 'Yellow', color: '#facc15' },
      { value: 'purple', label: 'Purple', color: '#8b5cf6' },
      { value: 'green', label: 'Green', color: '#10b981' },
      { value: 'red', label: 'Red', color: '#ef4444' },
      { value: 'indigo', label: 'Indigo', color: '#6366f1' },
      { value: 'pink', label: 'Pink', color: '#ec4899' },
      { value: 'orange', label: 'Orange', color: '#f97316' }
    ];

    // Bind event handlers
    this.handleAddColumn = this.handleAddColumn.bind(this);
    this.handleEditColumn = this.handleEditColumn.bind(this);
    this.handleDeleteColumn = this.handleDeleteColumn.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  getColorClass(color) {
    const colorMap = {
      blue: '#3b82f6',
      yellow: '#facc15',
      purple: '#8b5cf6',
      green: '#10b981',
      red: '#ef4444',
      indigo: '#6366f1',
      pink: '#ec4899',
      orange: '#f97316'
    };
    return colorMap[color] || '#3b82f6';
  }

  handleAddColumn() {
    if (this.state.newColumnName.trim()) {
      const newColumn = {
        id: Date.now(),
        name: this.state.newColumnName.trim(),
        color: this.state.newColumnColor,
        tasks: []
      };
      this.setState({
        columns: [...this.state.columns, newColumn],
        newColumnName: '',
        newColumnColor: 'blue',
        showAddColumnModal: false
      });
    }
  }

  handleEditColumn() {
    if (this.state.newColumnName.trim() && this.state.activeColumn) {
      const updatedColumns = this.state.columns.map(col => 
        col.id === this.state.activeColumn.id 
          ? { ...col, name: this.state.newColumnName.trim(), color: this.state.newColumnColor }
          : col
      );
      this.setState({
        columns: updatedColumns,
        showEditColumnModal: false,
        activeColumn: null,
        newColumnName: '',
        newColumnColor: 'blue'
      });
    }
  }

  handleDeleteColumn() {
    if (this.state.activeColumn) {
      const updatedColumns = this.state.columns.filter(col => col.id !== this.state.activeColumn.id);
      this.setState({
        columns: updatedColumns,
        showDeleteModal: false,
        activeColumn: null
      });
    }
  }

  openEditModal(column) {
    this.setState({
      activeColumn: column,
      newColumnName: column.name,
      newColumnColor: column.color,
      showEditColumnModal: true,
      activeDropdown: null
    });
  }

  openDeleteModal(column) {
    this.setState({
      activeColumn: column,
      showDeleteModal: true,
      activeDropdown: null
    });
  }

  toggleDropdown(columnId) {
    this.setState({
      activeDropdown: this.state.activeDropdown === columnId ? null : columnId
    });
  }

  handleInputChange(e) {
    this.setState({
      newColumnName: e.target.value
    });
  }

  handleColorChange(e) {
    this.setState({
      newColumnColor: e.target.value
    });
  }

  render() {
    const { 
      columns, 
      showAddColumnModal, 
      showEditColumnModal, 
      showDeleteModal, 
      activeColumn, 
      newColumnName, 
      newColumnColor, 
      activeDropdown 
    } = this.state;

    const styles = {
      container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      },
      header: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
      },
      headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      title: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0
      },
      headerButtons: {
        display: 'flex',
        gap: '1rem'
      },
      addColumnBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s'
      },
      settingsBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e5e7eb',
        color: '#374151',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
      },
      main: {
        padding: '2rem'
      },
      columnsContainer: {
        display: 'flex',
        gap: '1.5rem',
        overflowX: 'auto'
      },
      column: {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        minWidth: '20rem',
        maxWidth: '20rem',
        display: 'flex',
        flexDirection: 'column'
      },
      columnHeader: {
        padding: '1.25rem',
        borderBottom: '1px solid #e5e7eb'
      },
      columnHeaderContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      columnTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      },
      colorIndicator: {
        width: '12px',
        height: '12px',
        borderRadius: '50%'
      },
      columnName: {
        fontWeight: '600',
        color: '#1f2937',
        margin: 0
      },
      taskCount: {
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.875rem'
      },
      dropdownButton: {
        color: '#9ca3af',
        padding: '0.25rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '0.25rem',
        transition: 'color 0.3s'
      },
      dropdown: {
        position: 'absolute',
        right: 0,
        marginTop: '0.5rem',
        width: '12rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        zIndex: 10
      },
      dropdownItem: {
        width: '100%',
        padding: '0.5rem 1rem',
        textAlign: 'left',
        fontSize: '0.875rem',
        color: '#374151',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background-color 0.3s'
      },
      dropdownItemDelete: {
        color: '#dc2626'
      },
      columnContent: {
        flexGrow: 1,
        padding: '1rem',
        minHeight: '12rem',
        borderLeft: '4px solid'
      },
      noTasks: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '2rem 0'
      },
      addTaskBtn: {
        margin: '1rem',
        padding: '0.75rem',
        border: '2px dashed #d1d5db',
        borderRadius: '0.5rem',
        color: '#6b7280',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.3s',
        width: 'calc(100% - 2rem)'
      },
      modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      },
      modal: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '28rem',
        margin: '1rem'
      },
      modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      },
      modalTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        margin: 0
      },
      modalClose: {
        background: 'none',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        padding: '0.25rem',
        borderRadius: '0.25rem',
        transition: 'color 0.3s'
      },
      formGroup: {
        marginBottom: '1rem'
      },
      label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
      },
      input: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box'
      },
      select: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        outline: 'none',
        backgroundColor: 'white',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box'
      },
      modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        marginTop: '1.5rem'
      },
      cancelBtn: {
        padding: '0.5rem 1rem',
        color: '#4b5563',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.3s'
      },
      primaryBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.3s'
      },
      deleteBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.3s'
      },
      clickOutside: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5
      }
    };

    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContainer}>
            <h1 style={styles.title}>Kanban Board</h1>
            <div style={styles.headerButtons}>
              <button
                style={styles.addColumnBtn}
                onClick={() => this.setState({ showAddColumnModal: true })}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <Plus size={16} />
                Add Column
              </button>
              <button 
                style={styles.settingsBtn}
                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.main}>
          <div style={styles.columnsContainer}>
            {columns.map((column) => (
              <div key={column.id} style={styles.column}>
                {/* Column Header */}
                <div style={styles.columnHeader}>
                  <div style={styles.columnHeaderContent}>
                    <div style={styles.columnTitle}>
                      <div 
                        style={{
                          ...styles.colorIndicator,
                          backgroundColor: this.getColorClass(column.color)
                        }}
                      />
                      <h3 style={styles.columnName}>{column.name}</h3>
                      <span style={styles.taskCount}>
                        {column.tasks.length}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button
                        style={styles.dropdownButton}
                        onClick={() => this.toggleDropdown(column.id)}
                        onMouseOver={(e) => e.target.style.color = '#4b5563'}
                        onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {activeDropdown === column.id && (
                        <div style={styles.dropdown}>
                          <button
                            style={styles.dropdownItem}
                            onClick={() => this.openEditModal(column)}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={14} />
                            Edit Column
                          </button>
                          <button
                            style={{...styles.dropdownItem, ...styles.dropdownItemDelete}}
                            onClick={() => this.openDeleteModal(column)}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={14} />
                            Delete Column
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column Content */}
                <div 
                  style={{
                    ...styles.columnContent,
                    borderLeftColor: this.getColorClass(column.color)
                  }}
                >
                  {column.tasks.length === 0 ? (
                    <div style={styles.noTasks}>
                      No tasks yet
                    </div>
                  ) : (
                    column.tasks.map((task, index) => (
                      <div key={index} style={{
                        marginBottom: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem'
                      }}>
                        {/* Task content would go here */}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Task Button */}
                <button 
                  style={styles.addTaskBtn}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.color = '#3b82f6';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  + Add a task
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Column Modal */}
        {showAddColumnModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Add New Column</h3>
                <button
                  style={styles.modalClose}
                  onClick={() => this.setState({ showAddColumnModal: false })}
                  onMouseOver={(e) => e.target.style.color = '#4b5563'}
                  onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Column Name</label>
                <input
                  type="text"
                  style={styles.input}
                  value={newColumnName}
                  onChange={this.handleInputChange}
                  placeholder="Enter column name"
                  autoFocus
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Color</label>
                <select
                  style={styles.select}
                  value={newColumnColor}
                  onChange={this.handleColorChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {this.colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => this.setState({ showAddColumnModal: false })}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  style={styles.primaryBtn}
                  onClick={this.handleAddColumn}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Add Column
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Column Modal */}
        {showEditColumnModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Edit Column</h3>
                <button
                  style={styles.modalClose}
                  onClick={() => this.setState({ showEditColumnModal: false })}
                  onMouseOver={(e) => e.target.style.color = '#4b5563'}
                  onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Column Name</label>
                <input
                  type="text"
                  style={styles.input}
                  value={newColumnName}
                  onChange={this.handleInputChange}
                  placeholder="Enter column name"
                  autoFocus
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Color</label>
                <select
                  style={styles.select}
                  value={newColumnColor}
                  onChange={this.handleColorChange}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {this.colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => this.setState({ showEditColumnModal: false })}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  style={styles.primaryBtn}
                  onClick={this.handleEditColumn}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Column Modal */}
        {showDeleteModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Delete Column</h3>
                <button
                  style={styles.modalClose}
                  onClick={() => this.setState({ showDeleteModal: false })}
                  onMouseOver={(e) => e.target.style.color = '#4b5563'}
                  onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Are you sure you want to delete the "{activeColumn?.name}" column? 
                {activeColumn?.tasks.length > 0 && (
                  <span style={{ color: '#dc2626', fontWeight: '500' }}>
                    {" "}This will also delete {activeColumn.tasks.length} task(s).
                  </span>
                )}
              </p>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => this.setState({ showDeleteModal: false })}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={this.handleDeleteColumn}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Delete Column
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside handler for dropdowns */}
        {activeDropdown && (
          <div 
            style={styles.clickOutside}
            onClick={() => this.setState({ activeDropdown: null })}
          />
        )}
      </div>
    );
  }
}

export default KanbanBoard;