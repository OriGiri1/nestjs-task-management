import React from 'react';

export type StatusFilter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <div className="filter-card">
      <div className="filter-row">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('all')}
            >
              Tất cả
            </button>
            <button
              className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('active')}
            >
              Đang làm
            </button>
            <button
              className={`status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => onStatusFilterChange('completed')}
            >
              Đã xong
            </button>
          </div>

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Tất cả chủ đề (Category)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
