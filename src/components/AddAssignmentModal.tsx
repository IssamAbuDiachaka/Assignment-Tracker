
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
      <div className="bg-white rounded-3xl shadow-soft-lg w-full max-w-2xl p-8 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-brand-text-primary mb-6">New Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-brand-text-secondary">Subject</label>
              <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none">
                {AVAILABLE_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-brand-text-secondary">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Priority</label>
            <div className="mt-2 flex space-x-2">
              {(Object.values(Priority)).map(p => (
                <button type="button" key={p} onClick={() => setPriority(p)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${priority === p ? 'bg-brand-primary text-white scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-brand-text-secondary">Notes (optional)</label>
            <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none" />
          </div>

          <div>
            <label htmlFor="subtask" className="block text-sm font-medium text-brand-text-secondary">Subtasks</label>
            <div className="flex items-center mt-1">
              <input type="text" id="subtask" value={currentSubtask} onChange={e => setCurrentSubtask(e.target.value)} placeholder="Add a subtask..." className="block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none" />
              <button type="button" onClick={handleAddSubtask} className="ml-2 p-2 bg-brand-primary text-white rounded-full hover:bg-indigo-700 transition">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <ul className="mt-2 space-y-1">
                {subtasks.map((st, index) => (
                    <li key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                        <span className="text-sm text-brand-text-secondary">{st.text}</span>
                        <button type="button" onClick={() => handleRemoveSubtask(index)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                    </li>
                ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-100 text-brand-text-secondary rounded-xl hover:bg-slate-200 transition font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand-primary text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-sm">Add Assignment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
