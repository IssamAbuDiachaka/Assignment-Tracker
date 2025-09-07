
import React from 'react';
import type { View } from '../types';
import { HomeIcon, ChartIcon, PlusIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddAssignmentClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onAddAssignmentClick, isDarkMode, onToggleDarkMode, isOpen = false, onClose }) => {
  const navItems = [
    { view: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { view: 'analytics', icon: ChartIcon, label: 'Analytics' },
  ];

  return (
    <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div onClick={onClose} className="lg:hidden fixed inset-0 bg-black/40 z-40" />
    )}
    <aside className={`w-60 bg-soft-white dark:bg-slate-900 h-screen flex flex-col p-6 fixed top-0 left-0 border-r border-slate-200 dark:border-slate-700 shadow-soft-lg transition-all duration-200 z-50
      translate-x-0 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 p-4 mb-8">
        Academa
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.view}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onViewChange(item.view as View); }}
                className={`flex items-center p-4 rounded-xl transition-all duration-200 ease-in-out ${
                  currentView === item.view 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-soft' 
                    : 'text-soft-secondary dark:text-slate-400 hover:bg-soft-gray dark:hover:bg-slate-800 hover-tint'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-soft-secondary dark:text-slate-400">Dark Mode</span>
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className={`switch-track ${isDarkMode ? 'switch-on' : ''}`}
          >
            <span className="switch-thumb"></span>
          </button>
        </div>
        <button
          onClick={onAddAssignmentClick}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white flex items-center justify-center p-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 dark:hover:from-indigo-600 dark:hover:to-blue-600 transition-all duration-200 ease-in-out hover-lift shadow-soft"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Assignment
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
