
import React from 'react';
import type { Assignment } from '../types';
import { PRIORITY_COLORS, SUBJECT_COLORS } from '../constants';
import { CalendarIcon, AlertTriangleIcon, ClockIcon } from './Icons';
import { format, differenceInDays, isToday, isTomorrow, isPast } from 'date-fns';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleSubtask: (assignmentId: string, subtaskId: string) => void;
  onToggleAssignment: (assignmentId: string) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onToggleSubtask, onToggleAssignment }) => {

  const { id, title, subject, dueDate, priority, subtasks, completed, notes } = assignment;
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : (completed ? 100 : 0);
  const dueDateObj = new Date(dueDate);
  const daysRemaining = differenceInDays(dueDateObj, new Date());

  // Subject-based soft tint backgrounds
  const SUBJECT_TINTS: Record<string, string> = {
    'History': 'bg-[#FFF8E6]',
    'English': 'bg-[#F5E9FF]',
    'Mathematics': 'bg-[#EAF3FF]',
    'Science': 'bg-[#E9FBF6]',
    'Computer Science': 'bg-[#E9FCE9]',
    'Default': 'bg-[#F9FAFB]'
  };
  const cardBg = SUBJECT_TINTS[subject] || SUBJECT_TINTS['Default'];

  // Days left badge color
  let daysBadgeColor = '';
  if (isPast(dueDateObj) && !completed) daysBadgeColor = 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900';
  else if (daysRemaining <= 2) daysBadgeColor = 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900';
  else daysBadgeColor = 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900';

  // Truncate checklist/description logic
  const MAX_SUBTASKS_DISPLAY = 3;
  const showViewMore = totalSubtasks > MAX_SUBTASKS_DISPLAY;

  const getDueDateText = () => {
    if (isToday(dueDateObj)) return "Today";
    if (isTomorrow(dueDateObj)) return "Tomorrow";
    if (isPast(dueDateObj)) return `${Math.abs(daysRemaining)} days overdue`;
    return `${daysRemaining} days left`;
  };

  const subjectColor = SUBJECT_COLORS[subject] || { base: 'text-gray-600', background: 'bg-gray-100' };
  const priorityColor = PRIORITY_COLORS[priority];

  const handleToggleAssignment = () => {
    onToggleAssignment(id);
  };

  return (
    <div
      className={`rounded-2xl shadow-soft-xl transition-all duration-200 ease-in-out ${cardBg} p-5 relative ${completed ? 'opacity-60' : 'hover-lift hover:shadow-soft-xl'} min-h-[220px]`}
      style={{ backgroundColor: cardBg.replace('bg-[', '').replace(']', '') }}
    >
      {/* Top Row: Subject Tag + Priority Badge */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-block px-3 py-1.5 text-xs font-semibold rounded-full shadow-soft ${subjectColor.background} ${subjectColor.base}`}>{subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-soft ${priorityColor.background} ${priorityColor.base}`}>
            <AlertTriangleIcon className="w-3 h-3 mr-1" />
            {priority}
          </span>
          <input
            type="checkbox"
            checked={completed}
            onChange={handleToggleAssignment}
            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer transition-all duration-200"
          />
        </div>
      </div>

      {/* Middle: Title + Due Date */}
      <div className="flex flex-col gap-1 mt-2">
        <h3 className={`text-xl font-bold text-soft-dark dark:text-slate-200 leading-tight ${completed ? 'line-through' : ''}`}>{title}</h3>
        <div className="flex items-center gap-2 text-sm text-soft-secondary dark:text-slate-400">
          <CalendarIcon className={`w-4 h-4 mr-1.5 ${isPast(dueDateObj) && !completed ? 'text-rose-500 dark:text-rose-400' : ''}`} />
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isPast(dueDateObj) && !completed ? 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>{format(dueDateObj, 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-soft-secondary dark:text-slate-400">Progress</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{completedSubtasks}/{totalSubtasks} ({Math.round(progress)}%)</span>
        </div>
        <div className="w-full bg-soft-gray dark:bg-slate-700 rounded-full h-1 shadow-inner">
          <div
            className={`h-1 rounded-full transition-all duration-500 ease-in-out`}
            style={{
              width: `${progress}%`,
              backgroundColor: priorityColor?.base?.includes('rose')
                ? '#f43f5e'
                : subject === 'Mathematics'
                ? '#3b82f6'
                : subject === 'Science'
                ? '#14b8a6'
                : subject === 'History'
                ? '#f59e0b'
                : subject === 'English'
                ? '#a78bfa'
                : subject === 'Computer Science'
                ? '#10b981'
                : '#6366f1',
            }}
          ></div>
        </div>
      </div>

      {/* Checklist / Description */}
      {totalSubtasks > 0 && (
        <div className="mt-4">
          <div className="space-y-2 max-h-20 overflow-y-auto pr-1">
            {subtasks.slice(0, MAX_SUBTASKS_DISPLAY).map(subtask => (
              <div key={subtask.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`subtask-${subtask.id}`}
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(id, subtask.id)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer disabled:opacity-50 transition-all duration-200"
                  disabled={completed}
                />
                <label htmlFor={`subtask-${subtask.id}`} className={`ml-3 text-sm ${subtask.completed ? 'line-through text-soft-muted dark:text-slate-500' : 'text-soft-secondary dark:text-slate-400'} ${completed ? 'text-soft-muted dark:text-slate-500' : ''}`}>
                  {subtask.text.length > 40 ? subtask.text.slice(0, 40) + '…' : subtask.text}
                </label>
              </div>
            ))}
            {showViewMore && (
              <div className="text-xs text-soft-muted dark:text-slate-500">View More…</div>
            )}
          </div>
        </div>
      )}
      {/* If no subtasks, show notes/description truncated */}
      {totalSubtasks === 0 && notes && (
        <div className="mt-4 text-sm text-soft-secondary dark:text-slate-400">
          {notes.length > 60 ? notes.slice(0, 60) + '…' : notes}
        </div>
      )}

      {/* Bottom: Days left badge */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className={`flex items-center text-xs font-semibold ${daysBadgeColor} px-3 py-1 rounded-full`}>
          <ClockIcon className="w-4 h-4 mr-1.5" />
          {getDueDateText()}
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
