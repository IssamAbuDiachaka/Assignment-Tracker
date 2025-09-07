
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
  const { id, title, subject, dueDate, priority, subtasks, completed } = assignment;

  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : (completed ? 100 : 0);

  const dueDateObj = new Date(dueDate);
  const daysRemaining = differenceInDays(dueDateObj, new Date());

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
  }

  return (
    <div className={`bg-white rounded-2xl shadow-soft p-6 transition-all duration-300 ${completed ? 'opacity-50' : 'hover:shadow-soft-lg hover:-translate-y-1'}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${subjectColor.background} ${subjectColor.base}`}>{subject}</span>
        </div>
        <div className="flex items-center">
            <input 
                type="checkbox" 
                checked={completed} 
                onChange={handleToggleAssignment} 
                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
        </div>
      </div>
      
      <h3 className={`mt-3 text-lg font-bold text-brand-text-primary ${completed ? 'line-through' : ''}`}>{title}</h3>
      
      <div className="flex items-center text-sm text-brand-text-secondary mt-2 space-x-4">
        <div className="flex items-center">
          <CalendarIcon className={`w-4 h-4 mr-1.5 ${isPast(dueDateObj) && !completed ? 'text-brand-danger' : ''}`} />
          <span className={isPast(dueDateObj) && !completed ? 'font-bold text-brand-danger' : ''}>{format(dueDateObj, 'MMM d, yyyy')}</span>
        </div>
        <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor.background} ${priorityColor.base}`}>
          <AlertTriangleIcon className="w-3 h-3 mr-1" />
          {priority}
        </div>
      </div>

      {totalSubtasks > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-brand-text-secondary">Progress</span>
            <span className="text-xs font-bold text-brand-primary">{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-brand-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-3 space-y-2 max-h-24 overflow-y-auto pr-2">
            {subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`subtask-${subtask.id}`}
                  checked={subtask.completed}
                  onChange={() => onToggleSubtask(id, subtask.id)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer disabled:opacity-50"
                  disabled={completed}
                />
                <label htmlFor={`subtask-${subtask.id}`} className={`ml-2 text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-brand-text-secondary'} ${completed ? 'text-gray-400' : ''}`}>
                  {subtask.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-brand-danger font-medium">
            {isPast(dueDateObj) && !completed && <><ClockIcon className="w-4 h-4 mr-1.5" /><span>{getDueDateText()}</span></>}
          </div>
           <div className="flex items-center text-sm text-brand-secondary font-medium">
            {!isPast(dueDateObj) && !completed && <><ClockIcon className="w-4 h-4 mr-1.5" /><span>{getDueDateText()}</span></>}
          </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
