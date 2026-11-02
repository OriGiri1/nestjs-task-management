import React, { useEffect, useState } from 'react';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
  initialTask?: Task | null;
}

const CATEGORY_SUGGESTIONS = [
  'Backend',
  'Frontend',
  'Database',
  'DevOps',
  'Testing',
  'UI/UX',
  'Personal',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setCategory(initialTask.category || '');
      setDescription(initialTask.description || '');
      setIsCompleted(initialTask.isCompleted || false);
    } else {
      setTitle('');
      setCategory('Backend');
      setDescription('');
      setIsCompleted(false);
    }
    setError(null);
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Tiêu đề công việc là bắt buộc.');
      return;
    }
    if (title.length > 255) {
      setError('Tiêu đề không được vượt quá 255 ký tự.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        category: category.trim() ? category.trim() : undefined,
        description: description.trim() ? description.trim() : undefined,
        isCompleted,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialTask ? 'Chỉnh sửa công việc' : 'Tạo mới công việc'}
          </h2>
          <button className="action-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Tiêu đề công việc <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: Học NestJS cơ bản, Tạo API Tasks..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                required
                autoFocus
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'flex-end' }}>
                {title.length}/255
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Chủ đề (Category)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ví dụ: Backend, Frontend, DevOps..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={255}
              />
              <div className="category-tags">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className="tag-btn"
                    onClick={() => setCategory(cat)}
                  >
                    + {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea
                className="form-textarea"
                placeholder="Chi tiết công việc cần làm, ghi chú bổ sung..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
                />
                <span>Đánh dấu là đã hoàn thành</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : initialTask ? 'Cập nhật' : 'Tạo công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
