import React from 'react';
// FIX: Corrected import paths to be relative.
import { CrmLogoIcon, MenuIcon } from './icons';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        <CrmLogoIcon />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white ml-2">Gemini CRM</h1>
      </div>
      <button 
        onClick={onMenuClick} 
        className="p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default MobileHeader;