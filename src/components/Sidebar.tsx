
import React from 'react';
import type { View } from '../types';
import { HomeIcon, ChartIcon, PlusIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddAssignmentClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onAddAssignmentClick }) => {
  const navItems = [
    { view: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { view: 'analytics', icon: ChartIcon, label: 'Analytics' },
  ];

  return (
    <aside className="w-64 bg-brand-sidebar h-screen flex flex-col p-4 fixed top-0 left-0 border-r border-slate-200 shadow-soft-lg">
      <div className="text-2xl font-bold text-brand-primary p-4 mb-8">
        Academa
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.view} className="mb-2">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onViewChange(item.view as View); }}
                className={`flex items-center p-3 rounded-xl transition-colors ${currentView === item.view ? 'bg-brand-primary-light text-brand-primary font-bold' : 'text-brand-text-secondary hover:bg-slate-100'}`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <button
          onClick={onAddAssignmentClick}
          className="w-full bg-brand-primary text-white flex items-center justify-center p-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Assignment
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
