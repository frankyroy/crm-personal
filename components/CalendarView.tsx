import React, { useState } from 'react';
// FIX: Corrected import paths to be relative.
// FIX: The CrmData type should be imported from types.ts.
import { CrmData, Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons';
import Modal from './Modal';
import { TaskForm } from './Tasks';


interface CalendarViewProps {
  data: CrmData;
}

const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
  const { tasks, users, contacts, addTask, updateTask, deleteTask } = data;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = endOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate.getFullYear() === date.getFullYear() &&
               taskDueDate.getMonth() === date.getMonth() &&
               taskDueDate.getDate() === date.getDate();
    });
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingTask(null);
      setSelectedDate(null);
  }

  const handleOpenAddModal = (day: number) => {
      setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      setEditingTask(null);
      setIsModalOpen(true);
  }

  const handleOpenEditModal = (task: Task) => {
      setSelectedDate(new Date(task.dueDate));
      setEditingTask(task);
      setIsModalOpen(true);
  }

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
      if ('id' in taskData) {
          updateTask(taskData as Task);
      } else {
          addTask(taskData as Omit<Task, 'id'>);
      }
      handleCloseModal();
  }
  
  const handleDeleteTask = (taskId: string) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
          deleteTask(taskId);
          handleCloseModal();
      }
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {weekdays.map(day => (
                <div key={day} className="text-center font-medium text-sm py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                    {day}
                </div>
            ))}
            
            {blanks.map(i => <div key={`blank-${i}`} className="bg-gray-50 dark:bg-gray-800/50"></div>)}

            {days.map(day => {
                const tasksForDay = getTasksForDay(day);
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                return (
                    <div key={day} className="relative min-h-[120px] bg-white dark:bg-gray-800 p-2 group">
                         <div className="flex justify-between items-center">
                            <div className={`text-sm font-semibold ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                                {day}
                            </div>
                             <button onClick={() => handleOpenAddModal(day)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-blue-800">
                                <PlusIcon className="w-4 h-4 text-gray-600 dark:text-gray-300"/>
                            </button>
                        </div>
                        <div className="mt-1 space-y-1">
                            {tasksForDay.map(task => (
                                <div 
                                    key={task.id} 
                                    onClick={() => handleOpenEditModal(task)}
                                    className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 p-1 rounded-md truncate cursor-pointer hover:ring-2 hover:ring-blue-400" 
                                    title={task.title}
                                >
                                    {task.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>

      </div>
      
       <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <TaskForm 
              initialData={editingTask ? editingTask : { dueDate: selectedDate?.toISOString() } as any}
              users={users}
              contacts={contacts}
              onSave={handleSaveTask}
              onClose={handleCloseModal}
              onDelete={handleDeleteTask}
          />
      </Modal>

    </div>
  );
};

export default CalendarView;