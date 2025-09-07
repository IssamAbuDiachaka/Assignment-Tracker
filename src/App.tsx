
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AddAssignmentModal from './components/AddAssignmentModal';
import type { View, Assignment } from './types';
import { INITIAL_ASSIGNMENTS } from './constants';

type Action =
  | { type: 'ADD_ASSIGNMENT'; payload: Omit<Assignment, 'id' | 'completed' | 'completedAt'> }
  | { type: 'TOGGLE_SUBTASK'; payload: { assignmentId: string; subtaskId: string } }
  | { type: 'TOGGLE_ASSIGNMENT'; payload: { assignmentId: string } }
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] };

const assignmentsReducer = (state: Assignment[], action: Action): Assignment[] => {
  switch (action.type) {
    case 'ADD_ASSIGNMENT':
      { const newAssignment: Assignment = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      };
      return [...state, newAssignment]; }
    case 'TOGGLE_SUBTASK':
      return state.map(assignment => {
        if (assignment.id === action.payload.assignmentId) {
          const updatedSubtasks = assignment.subtasks.map(subtask => 
            subtask.id === action.payload.subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          );
          return { ...assignment, subtasks: updatedSubtasks };
        }
        return assignment;
      });
    case 'TOGGLE_ASSIGNMENT':
      return state.map(assignment => {
          if (assignment.id === action.payload.assignmentId) {
              const isNowCompleted = !assignment.completed;
              return {
                  ...assignment,
                  completed: isNowCompleted,
                  completedAt: isNowCompleted ? new Date().toISOString() : undefined,
                  // Also mark all subtasks as completed if assignment is completed
                  subtasks: assignment.subtasks.map(st => ({...st, completed: isNowCompleted}))
              };
          }
          return assignment;
      });
    case 'SET_ASSIGNMENTS':
      return action.payload;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [assignments, dispatch] = useReducer(assignmentsReducer, [], () => {
      const localData = localStorage.getItem('assignments');
      return localData ? JSON.parse(localData) : INITIAL_ASSIGNMENTS;
  });

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddAssignment = useCallback((assignment: Omit<Assignment, 'id' | 'completed' | 'completedAt'>) => {
    dispatch({ type: 'ADD_ASSIGNMENT', payload: assignment });
  }, []);

  const handleToggleSubtask = useCallback((assignmentId: string, subtaskId: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { assignmentId, subtaskId } });
  }, []);

  const handleToggleAssignment = useCallback((assignmentId: string) => {
      dispatch({ type: 'TOGGLE_ASSIGNMENT', payload: { assignmentId } });
  }, []);

  return (
    <div className="flex bg-academic dark:bg-slate-900 min-h-screen text-soft-dark dark:text-slate-200 transition-all duration-200">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <button aria-label="Open menu" onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="block w-5 h-0.5 bg-slate-700 dark:bg-slate-300 mb-1"></span>
          <span className="block w-5 h-0.5 bg-slate-700 dark:bg-slate-300 mb-1"></span>
          <span className="block w-5 h-0.5 bg-slate-700 dark:bg-slate-300"></span>
        </button>
        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Academa</div>
        <div className="w-8" />
      </div>

      <Sidebar 
        currentView={currentView} 
        onViewChange={(v) => { setCurrentView(v); setIsSidebarOpen(false); }}
        onAddAssignmentClick={() => setIsModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-60 w-full pt-16 lg:pt-6 px-4 sm:px-6 md:px-8">
        {currentView === 'dashboard' && <Dashboard assignments={assignments} onToggleSubtask={handleToggleSubtask} onToggleAssignment={handleToggleAssignment} />}
        {currentView === 'analytics' && <Analytics assignments={assignments} />}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-soft-lg text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
        aria-label="New Assignment"
      >
        + New
      </button>

      <AddAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddAssignment={handleAddAssignment} 
      />
    </div>
  );
};

export default App;
