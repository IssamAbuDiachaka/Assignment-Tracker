
export const Priority = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO string format
  priority: Priority;
  notes: string;
  subtasks: Subtask[];
  completed: boolean;
  completedAt?: string; // ISO string format
}

export type View = 'dashboard' | 'analytics';
