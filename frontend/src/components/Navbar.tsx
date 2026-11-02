import React from 'react';

interface NavbarProps {
  onNewTaskClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewTaskClick }) => {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div>
            <span>TaskFlow</span>
            <span className="brand-subtitle">NestJS + React + Docker</span>
          </div>
        </div>

        <div className="nav-badges">
          <span className="tech-tag nestjs">NestJS v9</span>
          <span className="tech-tag docker">Docker</span>
          <span className="tech-tag react">React 18</span>
          <button className="btn-primary" onClick={onNewTaskClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tạo công việc
          </button>
        </div>
      </div>
    </header>
  );
};
