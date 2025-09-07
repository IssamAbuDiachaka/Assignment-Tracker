
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
  
  const [assignments, dispatch] = useReducer(assignmentsReducer, [], () => {
      const localData = localStorage.getItem('assignments');
      return localData ? JSON.parse(localData) : INITIAL_ASSIGNMENTS;
  });

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

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
    <div className="flex bg-brand-bg min-h-screen text-brand-text-primary">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onAddAssignmentClick={() => setIsModalOpen(true)}
      />
      <main className="flex-1 ml-64">
        {currentView === 'dashboard' && <Dashboard assignments={assignments} onToggleSubtask={handleToggleSubtask} onToggleAssignment={handleToggleAssignment} />}
        {currentView === 'analytics' && <Analytics assignments={assignments} />}
      </main>
      <AddAssignmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddAssignment={handleAddAssignment} 
      />
    </div>
  );
};

export default App;
