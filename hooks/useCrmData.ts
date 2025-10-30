import { useState } from 'react';
import { CrmData, User, Contact, Task, Note, CrmFile, TaskStatus } from '../types';

// Mock Data
const initialUsers: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://picsum.photos/seed/alice/40/40' },
  { id: 'u2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
];

const initialContacts: Contact[] = [
  { id: 'c1', name: 'Charlie Brown', email: 'charlie@acme.com', phone: '123-456-7890', company: 'Acme Inc.', lastContacted: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'c2', name: 'Diana Prince', email: 'diana@stark.com', phone: '098-765-4321', company: 'Stark Industries', lastContacted: new Date(Date.now() - 86400000 * 10).toISOString() },
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Follow up with Charlie', description: 'Discuss the new proposal with Charlie Brown.', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: TaskStatus.Pending, assigneeId: 'u1', contactId: 'c1' },
  { id: 't2', title: 'Prepare presentation for Stark', description: 'Finalize the presentation for the meeting with Stark Industries.', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), status: TaskStatus.InProgress, assigneeId: 'u2', contactId: 'c2' },
  { id: 't3', title: 'Send invoice to Acme', description: 'Generate and send the quarterly invoice.', dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), status: TaskStatus.Completed, assigneeId: 'u1', contactId: 'c1' },
];

const initialNotes: Note[] = [
    { id: 'n1', content: 'Charlie is interested in our new product line. Mentioned budget concerns.', contactId: 'c1', createdAt: new Date().toISOString() }
]

const initialFiles: CrmFile[] = [
    { id: 'f1', name: 'Acme_Proposal_v2.pdf', type: 'PDF', size: '2.3 MB', uploadDate: new Date().toISOString(), contactId: 'c1', dataUrl: '#' }
]

const useCrmData = (): CrmData => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [files, setFiles] = useState<CrmFile[]>(initialFiles);

  const createId = () => new Date().getTime().toString();

  return {
    users,
    contacts,
    tasks,
    notes,
    files,

    getUserById: (id) => users.find(u => u.id === id),
    getContactById: (id) => contacts.find(c => c.id === id),
    
    addUser: (user) => setUsers(prev => [...prev, { ...user, id: createId() }]),
    updateUser: (updatedUser) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u)),
    deleteUser: (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        setTasks(prev => prev.map(t => t.assigneeId === id ? { ...t, assigneeId: '' } : t));
    },

    addContact: (contact) => setContacts(prev => [...prev, { ...contact, id: createId() }]),
    updateContact: (updatedContact) => setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c)),
    deleteContact: (id) => {
        setContacts(prev => prev.filter(c => c.id !== id));
        setTasks(prev => prev.map(t => t.contactId === id ? { ...t, contactId: undefined } : t));
        setNotes(prev => prev.filter(n => n.contactId !== id));
        setFiles(prev => prev.map(f => f.contactId === id ? { ...f, contactId: undefined } : f));
    },

    addTask: (task) => setTasks(prev => [...prev, { ...task, id: createId() }]),
    updateTask: (updatedTask) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t)),
    deleteTask: (id) => setTasks(prev => prev.filter(t => t.id !== id)),

    addNote: (note) => setNotes(prev => [...prev, { ...note, id: createId(), createdAt: new Date().toISOString() }]),
    updateNote: (updatedNote) => setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n)),
    deleteNote: (id) => setNotes(prev => prev.filter(n => n.id !== id)),
    
    addFile: (file) => setFiles(prev => [...prev, { ...file, id: createId(), uploadDate: new Date().toISOString() }]),
  };
};

export default useCrmData;
