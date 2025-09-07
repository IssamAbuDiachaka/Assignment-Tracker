
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
    <div className="bg-card dark:bg-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-soft hover-lift transition-all duration-200">
        <div>
            <h1 className="text-3xl font-bold text-soft-dark dark:text-slate-200">Hello there!</h1>
            <p className="mt-2 text-soft-secondary dark:text-slate-400">You have {activeAssignments.length} active assignments. Keep up the great work!</p>
        </div>
        <div className="mt-4 md:mt-0 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold px-6 py-3 rounded-xl text-sm shadow-soft">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
    </div>
  );

  const AssignmentSection: React.FC<{ title: string; assignments: Assignment[]; icon: React.ReactNode }> = ({ title, assignments: sectionAssignments, icon }) => {
    if (sectionAssignments.length === 0) return null;
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          {icon}
          <h2 className="text-xl md:text-2xl font-bold text-soft-dark dark:text-slate-200 ml-3 tracking-tight">{title}</h2>
          <span className="ml-3 bg-soft-gray dark:bg-slate-700 text-soft-secondary dark:text-slate-400 text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft">
            {sectionAssignments.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="p-6 md:p-8 lg:p-10 space-y-12">
      <WelcomeHeader />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-soft-dark dark:text-slate-200">Upcoming Assignments</h2>
        </div>

        <AssignmentSection 
          title="Overdue" 
          assignments={overdue} 
          icon={<AlertTriangleIcon className="w-6 h-6 text-rose-500 dark:text-rose-400" />}
        />

        <AssignmentSection 
          title="Due Today" 
          assignments={dueToday} 
          icon={<ClockIcon className="w-6 h-6 text-amber-500 dark:text-amber-400" />}
        />
        
        <AssignmentSection 
          title="Upcoming" 
          assignments={upcoming} 
          icon={<ClockIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />}
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-soft-dark dark:text-slate-200">Recently Completed</h2>
        <AssignmentSection 
          title="Recently Completed" 
          assignments={completed} 
          icon={<CheckCircleIcon className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
