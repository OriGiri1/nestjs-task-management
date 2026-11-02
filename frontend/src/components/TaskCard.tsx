import React from 'react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
      <button
        className={`task-checkbox-btn ${task.isCompleted ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task)}
        title={task.isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>

      <div className="task-content">
        <div className="task-header">
          <span className={`task-title ${task.isCompleted ? 'completed' : ''}`}>
            {task.title}
          </span>
          {task.category && (
            <span className="category-badge">{task.category}</span>
          )}
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta">
          <span>Tạo lúc: {formatDate(task.createdAt)}</span>
          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <span>• Cập nhật: {formatDate(task.updatedAt)}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="action-btn"
          onClick={() => onEdit(task)}
          title="Chỉnh sửa công việc"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button
          className="action-btn delete"
          onClick={() => onDelete(task)}
          title="Xóa công việc"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
