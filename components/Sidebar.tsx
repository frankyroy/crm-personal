import React from 'react';
import {
  CrmLogoIcon,
  DashboardIcon,
  ContactsIcon,
  TasksIcon,
  CalendarIcon,
  FilesIcon,
  NotesIcon,
  UsersIcon,
  LogoutIcon,
} from './icons';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isSidebarOpen: boolean;
}

const NavItem: React.FC<{
  view: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  currentView: string;
  onNavigate: (view: string) => void;
}> = ({ view, label, icon: Icon, currentView, onNavigate }) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => onNavigate(view)}
      className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isSidebarOpen }) => {
  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { view: 'contacts', label: 'Contacts', icon: ContactsIcon },
    { view: 'tasks', label: 'Tasks', icon: TasksIcon },
    { view: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { view: 'files', label: 'Files', icon: FilesIcon },
    { view: 'notes', label: 'Notes', icon: NotesIcon },
    { view: 'users', label: 'Users', icon: UsersIcon },
  ];

  return (
    <aside
      className={`fixed md:relative z-30 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <CrmLogoIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white ml-2">Gemini CRM</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.view} {...item} currentView={currentView} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
         <button
            className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
