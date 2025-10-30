import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths to be relative.
// FIX: The CrmData type should be imported from types.ts.
import { CrmData, Task, TaskStatus, User, Contact } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from './icons';
import { generateTaskDescription } from '../services/geminiService';

interface TasksProps {
  data: CrmData;
}

export const TaskForm: React.FC<{
    onSave: (task: Omit<Task, 'id'> | Task) => void;
    onClose: () => void;
    onDelete?: (taskId: string) => void;
    initialData?: Task | null;
    users: User[];
    contacts: Contact[];
}> = ({ onSave, onClose, onDelete, initialData, users, contacts }) => {
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: TaskStatus.Pending,
        assigneeId: users[0]?.id || '',
        contactId: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                dueDate: initialData.dueDate.split('T')[0],
                status: initialData.status,
                assigneeId: initialData.assigneeId,
                contactId: initialData.contactId || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                dueDate: '',
                status: TaskStatus.Pending,
                assigneeId: users[0]?.id || '',
                contactId: '',
            });
        }
    }, [initialData, users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.title) {
            alert("Please enter a title first to generate a description.");
            return;
        }
        setIsGenerating(true);
        try {
            const description = await generateTaskDescription(formData.title);
            setFormData(prev => ({ ...prev, description }));
        } catch (error) {
            console.error("Failed to generate description:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString(),
            contactId: formData.contactId || undefined,
        };
        if (initialData) {
            onSave({ ...initialData, ...taskData });
        } else {
            onSave(taskData);
        }
    };

    const handleDeleteClick = () => {
      if (initialData && onDelete) {
        onDelete(initialData.id);
      }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label htmlFor="description" className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>Description</span>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50">
                        <SparklesIcon className="w-4 h-4 mr-1"/>
                        {isGenerating ? 'Generating...' : 'AI Generate'}
                    </button>
                </label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</label>
                    <select name="assigneeId" id="assigneeId" value={formData.assigneeId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Related Contact (Optional)</label>
                    <select name="contactId" id="contactId" value={formData.contactId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                        <option value="">None</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex justify-between items-center pt-2">
                 <div>
                    {initialData && onDelete && (
                        <button 
                            type="button" 
                            onClick={handleDeleteClick} 
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md font-semibold text-sm hover:bg-red-700 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete Task
                        </button>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{initialData ? 'Save Changes' : 'Add Task'}</button>
                </div>
            </div>
        </form>
    );
};


const Tasks: React.FC<TasksProps> = ({ data }) => {
  const { tasks, users, contacts, getUserById, getContactById, addTask, updateTask, deleteTask } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  const handleSave = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
        updateTask(taskData as Task);
    } else {
        addTask(taskData as Omit<Task, 'id'>);
    }
    handleCloseModal();
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
    }
  };

  const handleDeleteFromModal = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
        handleCloseModal();
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tasks</h1>
        <button onClick={handleOpenAddModal} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Task
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Task</th>
                <th scope="col" className="px-6 py-3">Assignee</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Due Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const assignee = getUserById(task.assigneeId);
                const contact = task.contactId ? getContactById(task.contactId) : null;
                return (
                  <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{task.title}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <img src={assignee?.avatarUrl} alt={assignee?.name} className="w-6 h-6 rounded-full mr-2" />
                            {assignee?.name || 'Unassigned'}
                        </div>
                    </td>
                    <td className="px-6 py-4">{contact?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            task.status === TaskStatus.Completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            task.status === TaskStatus.InProgress ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                            {task.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenEditModal(task)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" title="Edit">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                             <button onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" title="Delete">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <TaskForm 
              initialData={editingTask}
              users={users}
              contacts={contacts}
              onSave={handleSave}
              onClose={handleCloseModal}
              onDelete={handleDeleteFromModal}
          />
      </Modal>
      
    </div>
  );
};

export default Tasks;