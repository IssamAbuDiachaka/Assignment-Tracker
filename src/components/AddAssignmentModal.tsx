
import React, { useState } from 'react';
import type { Assignment, Subtask } from '../types';
import { Priority } from '../types';
import { AVAILABLE_SUBJECTS } from '../constants';
import { PlusIcon } from './Icons';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'completed' | 'completedAt'>) => void;
}

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, onAddAssignment }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(AVAILABLE_SUBJECTS[0]);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<Omit<Subtask, 'id' | 'completed'>[]>([]);
  const [currentSubtask, setCurrentSubtask] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please fill in at least the title and due date.');
      return;
    }
    const newAssignment: Omit<Assignment, 'id' | 'completed' | 'completedAt'> = {
      title,
      subject,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      notes,
      subtasks: subtasks.map((st, index) => ({ ...st, id: `${Date.now()}-${index}`, completed: false })),
    };
    onAddAssignment(newAssignment);
    // Reset form
    setTitle('');
    setSubject(AVAILABLE_SUBJECTS[0]);
    setDueDate('');
    setPriority(Priority.Medium);
    setNotes('');
    setSubtasks([]);
    onClose();
  };

  const handleAddSubtask = () => {
    if (currentSubtask.trim()) {
      setSubtasks([...subtasks, { text: currentSubtask.trim() }]);
      setCurrentSubtask('');
    }
  };
  
  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-card dark:bg-slate-800 rounded-2xl shadow-soft-xl w-full max-w-2xl p-8 transform transition-all duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-soft-dark dark:text-slate-200 mb-6">New Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-2">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full px-4 py-3 bg-soft-gray dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all duration-200 text-soft-dark dark:text-slate-200" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-2">Subject</label>
              <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="block w-full px-4 py-3 bg-soft-gray dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all duration-200 text-soft-dark dark:text-slate-200">
                {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-2">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="block w-full px-4 py-3 bg-soft-gray dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all duration-200 text-soft-dark dark:text-slate-200" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-3">Priority</label>
            <div className="flex space-x-3">
              {(Object.values(Priority)).map(p => (
                <button type="button" key={p} onClick={() => setPriority(p)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${priority === p ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-soft' : 'bg-soft-gray dark:bg-slate-700 text-soft-secondary dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-2">Notes (optional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="block w-full px-4 py-3 bg-soft-gray dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all duration-200 text-soft-dark dark:text-slate-200" />
          </div>

          <div>
            <label htmlFor="subtask" className="block text-sm font-medium text-soft-secondary dark:text-slate-400 mb-2">Subtasks</label>
            <div className="flex items-center">
              <input type="text" id="subtask" value={currentSubtask} onChange={e => setCurrentSubtask(e.target.value)} placeholder="Add a subtask..." className="block w-full px-4 py-3 bg-soft-gray dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all duration-200 text-soft-dark dark:text-slate-200" />
              <button type="button" onClick={handleAddSubtask} className="ml-3 p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 shadow-soft">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <ul className="mt-3 space-y-2">
                {subtasks.map((st, index) => (
                    <li key={index} className="flex items-center justify-between bg-soft-gray dark:bg-slate-700 p-3 rounded-xl shadow-soft">
                        <span className="text-sm text-soft-secondary dark:text-slate-400">{st.text}</span>
                        <button type="button" onClick={() => handleRemoveSubtask(index)} className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-medium transition-colors duration-200">Remove</button>
                    </li>
                ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-soft-gray dark:bg-slate-700 text-soft-secondary dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 font-medium">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 font-medium shadow-soft">Add Assignment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
