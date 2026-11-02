import React from 'react';
import { Task } from '../types/task';

interface StatsOverviewProps {
  tasks: Task[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon total">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Tổng công việc</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon pending">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div>
          <div className="stat-value">{pending}</div>
          <div className="stat-label">Đang thực hiện</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon completed">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div>
          <div className="stat-value">{completed}</div>
          <div className="stat-label">Đã hoàn thành</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon rate">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <div>
          <div className="stat-value">{rate}%</div>
          <div className="stat-label">Tỷ lệ hoàn thành</div>
        </div>
      </div>
    </div>
  );
};
