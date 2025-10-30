import React, { useState, useEffect } from 'react';
import { CrmData, Contact } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons';

interface ContactsProps {
  data: CrmData;
}

const ContactForm: React.FC<{
    onSave: (contact: Omit<Contact, 'id'> | Contact) => void;
    onClose: () => void;
    initialData?: Contact | null;
}> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        lastContacted: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone,
                company: initialData.company,
                lastContacted: new Date(initialData.lastContacted).toISOString().split('T')[0],
            });
        } else {
             setFormData({ name: '', email: '', phone: '', company: '', lastContacted: new Date().toISOString().split('T')[0] });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contactData = {
            ...formData,
            lastContacted: new Date(formData.lastContacted).toISOString(),
        };
        if (initialData) {
            onSave({ ...initialData, ...contactData });
        } else {
            onSave(contactData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit Contact' : 'Add New Contact'}</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
             <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{initialData ? 'Save Changes' : 'Add Contact'}</button>
            </div>
        </form>
    );
};

const Contacts: React.FC<ContactsProps> = ({ data }) => {
  const { contacts, addContact, updateContact, deleteContact } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const handleOpenModalForAdd = () => {
    setContactToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (contact: Contact) => {
    setContactToEdit(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setContactToEdit(null);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id'> | Contact) => {
    if ('id' in contactData) {
        updateContact(contactData as Contact);
    } else {
        addContact(contactData as Omit<Contact, 'id'>);
    }
    handleCloseModal();
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact? This will also remove them from any associated tasks, notes, or files.')) {
        deleteContact(contactId);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Contacts</h1>
        <button onClick={handleOpenModalForAdd} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Contact
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Company</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Last Contacted</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                  <tr key={contact.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{contact.name}</td>
                    <td className="px-6 py-4">{contact.company}</td>
                    <td className="px-6 py-4">{contact.email}</td>
                    <td className="px-6 py-4">{contact.phone}</td>
                    <td className="px-6 py-4">{new Date(contact.lastContacted).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenModalForEdit(contact)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" title="Edit">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" title="Delete">
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
        <ContactForm 
            onSave={handleSaveContact}
            onClose={handleCloseModal}
            initialData={contactToEdit}
        />
      </Modal>
    </div>
  );
};

export default Contacts;
