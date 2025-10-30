import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths to be relative.
// FIX: The CrmData type should be imported from types.ts.
import { CrmData, User } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons';

interface UsersProps {
  data: CrmData;
}

const UserForm: React.FC<{
    onSave: (user: Omit<User, 'id'> | User) => void;
    onClose: () => void;
    initialData?: User | null;
}> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatarUrl: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                avatarUrl: initialData.avatarUrl
            });
        } else {
             setFormData({ name: '', email: '', avatarUrl: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSave({ ...initialData, ...formData });
        } else {
            onSave({ ...formData, avatarUrl: formData.avatarUrl || `https://picsum.photos/seed/${Date.now()}/40/40` });
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit User' : 'Add New User'}</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL</label>
                <input type="text" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="Leave blank for random avatar"/>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{initialData ? 'Save Changes' : 'Add User'}</button>
            </div>
        </form>
    );
};

const Users: React.FC<UsersProps> = ({ data }) => {
  const { users, addUser, updateUser, deleteUser } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const handleOpenModalForAdd = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id'> | User) => {
    if ('id' in userData) {
        updateUser(userData as User);
    } else {
        addUser(userData as Omit<User, 'id'>);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        deleteUser(userId);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Users</h1>
        <button onClick={handleOpenModalForAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center">
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                            {user.name}
                        </div>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenModalForEdit(user)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" title="Edit">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" title="Delete">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <UserForm 
            onSave={handleSaveUser}
            onClose={handleCloseModal}
            initialData={userToEdit}
        />
      </Modal>
    </div>
  );
};

export default Users;