
import type { Assignment } from './types';
import { Priority } from './types';

export const PRIORITY_COLORS: Record<Priority, { base: string; background: string }> = {
  [Priority.High]: { base: 'text-rose-600 dark:text-rose-400', background: 'bg-rose-100 dark:bg-rose-900' },
  [Priority.Medium]: { base: 'text-amber-600 dark:text-amber-400', background: 'bg-amber-100 dark:bg-amber-900' },
  [Priority.Low]: { base: 'text-emerald-600 dark:text-emerald-400', background: 'bg-emerald-100 dark:bg-emerald-900' },
};

export const SUBJECT_COLORS: Record<string, { base: string; background: string }> = {
  'Mathematics': { base: 'text-blue-600 dark:text-blue-400', background: 'bg-blue-100 dark:bg-blue-900' },
  'Science': { base: 'text-teal-600 dark:text-teal-400', background: 'bg-teal-100 dark:bg-teal-900' },
  'History': { base: 'text-amber-600 dark:text-amber-400', background: 'bg-amber-100 dark:bg-amber-900' },
  'English': { base: 'text-purple-600 dark:text-purple-400', background: 'bg-purple-100 dark:bg-purple-900' },
  'Art': { base: 'text-rose-600 dark:text-rose-400', background: 'bg-rose-100 dark:bg-rose-900' },
  'Computer Science': { base: 'text-emerald-600 dark:text-emerald-400', background: 'bg-emerald-100 dark:bg-emerald-900' },
};

export const AVAILABLE_SUBJECTS = Object.keys(SUBJECT_COLORS);

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'Complete Calculus Homework Chapter 5',
    subject: 'Mathematics',
    dueDate: tomorrow.toISOString(),
    priority: Priority.High,
    notes: 'Focus on differentiation problems.',
    subtasks: [
      { id: '1-1', text: 'Problems 1-5', completed: true },
      { id: '1-2', text: 'Problems 6-10', completed: false },
      { id: '1-3', text: 'Review notes', completed: false },
    ],
    completed: false,
  },
  {
    id: '2',
    title: 'Write Essay on the Renaissance',
    subject: 'History',
    dueDate: nextWeek.toISOString(),
    priority: Priority.Medium,
    notes: 'Minimum 5 pages, double-spaced.',
    subtasks: [
      { id: '2-1', text: 'Research topic', completed: true },
      { id: '2-2', text: 'Create outline', completed: true },
      { id: '2-3', text: 'Write first draft', completed: false },
      { id: '2-4', text: 'Proofread', completed: false },
    ],
    completed: false,
  },
  {
    id: '3',
    title: 'Biology Lab Report',
    subject: 'Science',
    dueDate: yesterday.toISOString(),
    priority: Priority.High,
    notes: 'Include all data tables and graphs.',
    subtasks: [
      { id: '3-1', text: 'Analyze data', completed: true },
      { id: '3-2', text: 'Write report body', completed: true },
      { id: '3-3', text: 'Create graphs', completed: true },
    ],
    completed: false,
  },
  {
    id: '4',
    title: 'Read "To Kill a Mockingbird"',
    subject: 'English',
    dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    priority: Priority.Low,
    notes: '',
    subtasks: [],
    completed: false,
  },
  {
    id: '5',
    title: 'Final Project for CS',
    subject: 'Computer Science',
    dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    priority: Priority.High,
    notes: 'Build a full-stack web application.',
    subtasks: [
        { id: '5-1', text: 'Design database schema', completed: true},
        { id: '5-2', text: 'Setup backend API', completed: false},
        { id: '5-3', text: 'Develop frontend UI', completed: false},
    ],
    completed: false,
  },
   {
    id: '6',
    title: 'Prepare for Oral Presentation',
    subject: 'English',
    dueDate: today.toISOString(),
    priority: Priority.Medium,
    notes: '5-minute presentation on Shakespeare.',
    subtasks: [],
    completed: true,
    completedAt: twoDaysAgo.toISOString()
  },
];
