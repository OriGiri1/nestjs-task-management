import React from 'react';
import { Task } from '../types/task';

interface DeleteModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#dc2626' }}>Xác nhận xóa công việc</h3>
          <button className="action-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Bạn có chắc chắn muốn xóa công việc này không?
          </p>
          <div style={{
            marginTop: 8,
            padding: 12,
            background: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontWeight: 600,
          }}>
            {task.title}
          </div>
          <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 4 }}>
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
          </button>
        </div>
      </div>
    </div>
  );
};
