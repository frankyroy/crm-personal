import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths to be relative.
// FIX: The CrmData type should be imported from types.ts.
import { CrmData, Note, Contact } from '../types';
import Modal from './Modal';
import { PlusIcon, PencilIcon, TrashIcon } from './icons';

interface NotesProps {
  data: CrmData;
}

const NoteForm: React.FC<{
    onSave: (note: Omit<Note, 'id' | 'createdAt'> | Note) => void;
    onClose: () => void;
    initialData?: Note | null;
    contacts: Contact[];
}> = ({ onSave, onClose, initialData, contacts }) => {
    const [content, setContent] = useState('');
    const [contactId, setContactId] = useState('');

    useEffect(() => {
        if (initialData) {
            setContent(initialData.content);
            setContactId(initialData.contactId);
        } else {
            setContent('');
            setContactId(contacts[0]?.id || '');
        }
    }, [initialData, contacts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !contactId) return;

        const noteData = { content, contactId };
        if (initialData) {
            onSave({ ...initialData, ...noteData });
        } else {
            onSave(noteData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit Note' : 'Add New Note'}</h2>
            <div>
                <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact</label>
                <select id="contactId" value={contactId} onChange={e => setContactId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required>
                    {contacts.length === 0 ? (
                        <option value="">No contacts available</option>
                    ) : (
                        contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    )}
                </select>
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" required></textarea>
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{initialData ? 'Save Changes' : 'Add Note'}</button>
            </div>
        </form>
    )
};

const Notes: React.FC<NotesProps> = ({ data }) => {
  const { notes, contacts, addNote, updateNote, deleteNote, getContactById } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt'> | Note) => {
    if ('id' in noteData) {
        updateNote(noteData as Note);
    } else {
        addNote(noteData as Omit<Note, 'id' | 'createdAt'>);
    }
    handleCloseModal();
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
        deleteNote(noteId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notes</h1>
        <button onClick={handleOpenAddModal} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.map(note => {
            const contact = getContactById(note.contactId);
            return (
                <div key={note.id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 flex-1 mb-4">{note.content}</p>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{contact?.name || 'No Contact'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleOpenEditModal(note)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1">
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteNote(note.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
        {notes.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No notes yet. Click "Add Note" to create one.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NoteForm 
            onSave={handleSaveNote}
            onClose={handleCloseModal}
            initialData={editingNote}
            contacts={contacts}
        />
      </Modal>

    </div>
  );
};

export default Notes;