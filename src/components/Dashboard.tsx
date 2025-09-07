
import React from 'react';
import type { Assignment } from '../types';
import AssignmentCard from './AssignmentCard';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';
import { AlertTriangleIcon, ClockIcon, CheckCircleIcon } from './Icons';

interface DashboardProps {
  assignments: Assignment[];
  onToggleSubtask: (assignmentId: string, subtaskId: string) => void;
  onToggleAssignment: (assignmentId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assignments, onToggleSubtask, onToggleAssignment }) => {
  const activeAssignments = assignments.filter(a => !a.completed);

  const overdue = activeAssignments
    .filter(a => isPast(parseISO(a.dueDate)) && !isToday(parseISO(a.dueDate)))
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
    
  const dueToday = activeAssignments
    .filter(a => isToday(parseISO(a.dueDate)));

  const upcoming = activeAssignments
    .filter(a => isFuture(parseISO(a.dueDate)) && !isToday(parseISO(a.dueDate)))
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());

  const completed = assignments.filter(a => a.completed)
    .sort((a,b) => parseISO(b.completedAt!).getTime() - parseISO(a.completedAt!).getTime())
    .slice(0, 5); // show last 5 completed

  const WelcomeHeader = () => (
    <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-soft">
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">Hello there!</h1>
            <p className="mt-1 text-brand-text-secondary">You have {activeAssignments.length} active assignments. Keep up the great work!</p>
        </div>
        <div className="mt-4 md:mt-0 bg-brand-primary-light text-brand-primary font-semibold px-4 py-2 rounded-xl text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
    </div>
  );

  const AssignmentSection: React.FC<{ title: string; assignments: Assignment[]; icon: React.ReactNode }> = ({ title, assignments: sectionAssignments, icon }) => {
    if (sectionAssignments.length === 0) return null;
    return (
      <div>
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="text-xl font-bold text-brand-text-primary ml-2">{title}</h2>
          <span className="ml-2 bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{sectionAssignments.length}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onToggleSubtask={onToggleSubtask}
              onToggleAssignment={onToggleAssignment}
            />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <WelcomeHeader />

      <AssignmentSection 
        title="Overdue" 
        assignments={overdue} 
        icon={<AlertTriangleIcon className="w-6 h-6 text-brand-danger" />}
      />

      <AssignmentSection 
        title="Due Today" 
        assignments={dueToday} 
        icon={<ClockIcon className="w-6 h-6 text-brand-accent" />}
      />
      
      <AssignmentSection 
        title="Upcoming" 
        assignments={upcoming} 
        icon={<ClockIcon className="w-6 h-6 text-brand-primary" />}
      />

       <AssignmentSection 
        title="Recently Completed" 
        assignments={completed} 
        icon={<CheckCircleIcon className="w-6 h-6 text-brand-secondary" />}
      />
    </div>
  );
};

export default Dashboard;
