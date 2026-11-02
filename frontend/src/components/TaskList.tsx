import React from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onNewTaskClick: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onToggleComplete,
  onEdit,
  onDelete,
  onNewTaskClick,
}) => {
  if (loading) {
    return (
      <div className="task-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="task-card" style={{ opacity: 0.6 }}>
            <div style={{ width: 24, height: 24, background: '#e2e8f0', borderRadius: 6 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '40%', height: 16, background: '#e2e8f0', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: '70%', height: 12, background: '#f1f5f9', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3 className="empty-title">Chưa có công việc nào</h3>
        <p className="empty-desc">
          Hãy tạo công việc mới để bắt đầu theo dõi tiến độ học tập và dự án của bạn!
        </p>
        <button className="btn-primary" onClick={onNewTaskClick}>
          + Thêm công việc đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
