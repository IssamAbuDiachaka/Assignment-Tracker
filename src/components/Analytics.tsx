import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import type { Assignment } from '../types';
import { isAfter, startOfWeek, format } from 'date-fns';
import { SUBJECT_COLORS } from '../constants';

interface AnalyticsProps {
  assignments: Assignment[];
}

const Analytics: React.FC<AnalyticsProps> = ({ assignments }) => {
  const completedAssignments = assignments.filter(a => a.completed && a.completedAt);

  // Data for completion trend
  const weeklyCompletions = completedAssignments.reduce((acc, assignment) => {
    const completedDate = new Date(assignment.completedAt!); // ✅ fixed
    if (isNaN(completedDate.getTime())) {
      console.warn("Invalid completedAt date:", assignment.completedAt);
      return acc; // skip invalid
    }
    const weekStart = format(
      startOfWeek(completedDate, { weekStartsOn: 1 }),
      'MMM d'
    );
    acc[weekStart] = (acc[weekStart] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completionTrendData = Object.keys(weeklyCompletions).map(week => ({
    week,
    completed: weeklyCompletions[week],
  })).slice(-6); // Last 6 weeks

  // Data for subject distribution
  const subjectDistribution = assignments.reduce((acc, assignment) => {
    acc[assignment.subject] = (acc[assignment.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const subjectDistributionData = Object.keys(subjectDistribution).map(subject => ({
    name: subject,
    value: subjectDistribution[subject],
  }));

  const COLORS = subjectDistributionData.map(
    entry => SUBJECT_COLORS[entry.name]?.base.replace('text-', 'fill-') || 'fill-gray-500'
  );

  const totalAssignments = assignments.length;
  const totalCompleted = completedAssignments.length;
  const overdueAssignments = assignments.filter(
    a => !a.completed && isAfter(new Date(), new Date(a.dueDate))
  ).length;

  const kpiData = [
    { title: 'Total Assignments', value: totalAssignments, color: 'text-indigo-600 dark:text-indigo-400' },
    { title: 'Completed Tasks', value: totalCompleted, color: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Overdue Items', value: overdueAssignments, color: 'text-rose-600 dark:text-rose-400' },
    {
      title: 'Completion Rate',
      value: `${totalAssignments > 0 ? ((totalCompleted / totalAssignments) * 100).toFixed(0) : 0}%`,
      color: 'text-amber-600 dark:text-amber-400'
    },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-10">
      <h1 className="text-3xl font-bold text-soft-dark dark:text-slate-200">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map(kpi => (
          <div key={kpi.title} className="bg-card dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover-lift transition-all duration-200">
            <p className="text-sm font-medium text-soft-secondary dark:text-slate-400">{kpi.title}</p>
            <p className={`text-4xl font-bold mt-2 ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover-lift transition-all duration-200">
          <h2 className="text-xl font-bold text-soft-dark dark:text-slate-200 mb-6">Weekly Completion Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  color: 'var(--text-primary)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px', color: 'var(--text-primary)' }} />
              <Bar
                dataKey="completed"
                fill="#6366f1"
                name="Assignments Completed"
                barSize={30}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover-lift transition-all duration-200">
          <h2 className="text-xl font-bold text-soft-dark dark:text-slate-200 mb-6">Subject Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subjectDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {subjectDistributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    className={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  color: 'var(--text-primary)',
                }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '14px', color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
