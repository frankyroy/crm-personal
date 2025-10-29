import React, { useState } from 'react';
import useCrmData from './hooks/useCrmData';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Tasks from './components/Tasks';
import CalendarView from './components/CalendarView';
import Files from './components/Files';
import Notes from './components/Notes';
import Users from './components/Users';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const crmData = useCrmData();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={crmData} />;
      case 'contacts':
        return <Contacts data={crmData} />;
      case 'tasks':
        return <Tasks data={crmData} />;
      case 'calendar':
        return <CalendarView data={crmData} />;
      case 'files':
        return <Files data={crmData} />;
      case 'notes':
        return <Notes data={crmData} />;
      case 'users':
        return <Users data={crmData} />;
      default:
        return <Dashboard data={crmData} />;
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on navigation in mobile
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-col flex-1 w-full">
        <MobileHeader onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="h-full overflow-y-auto p-4 md:p-6">
          {renderView()}
        </main>
      </div>
      {isSidebarOpen && (
          <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
          ></div>
      )}
    </div>
  );
};

export default App;
