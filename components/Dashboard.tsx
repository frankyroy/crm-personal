
import React from 'react';
// FIX: CrmData type is defined in types.ts.
import { CrmData, TaskStatus } from '../types';
import { ContactsIcon, TasksIcon, CheckCircleIcon, ClockIcon } from './icons';

interface DashboardProps {
  data: CrmData;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { contacts, tasks, getUserById } = data;
  const recentTasks = tasks.slice(0, 5).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Contacts" value={contacts.length} icon={ContactsIcon} />
        <StatCard title="Total Tasks" value={tasks.length} icon={TasksIcon} />
        <StatCard title="Pending Tasks" value={tasks.filter(t => t.status === TaskStatus.Pending).length} icon={ClockIcon} />
        <StatCard title="Completed Tasks" value={tasks.filter(t => t.status === TaskStatus.Completed).length} icon={CheckCircleIcon} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Task</th>
                <th scope="col" className="px-6 py-3">Due Date</th>
                <th scope="col" className="px-6 py-3">Assignee</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => {
                const assignee = getUserById(task.assigneeId);
                return (
                  <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{task.title}</td>
                    <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <img src={assignee?.avatarUrl} alt={assignee?.name} className="w-6 h-6 rounded-full mr-2" />
                            {assignee?.name || 'Unassigned'}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === TaskStatus.Completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            task.status === TaskStatus.InProgress ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                            {task.status}
                        </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;