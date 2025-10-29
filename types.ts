export enum TaskStatus {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Completed = 'Completed',
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    lastContacted: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    assigneeId: string;
    contactId?: string;
}

export interface Note {
    id: string;
    content: string;
    contactId: string;
    createdAt: string;
}

export interface CrmFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    contactId?: string;
    dataUrl: string;
}

export interface CrmData {
    users: User[];
    contacts: Contact[];
    tasks: Task[];
    notes: Note[];
    files: CrmFile[];
    getUserById: (id: string) => User | undefined;
    getContactById: (id: string) => Contact | undefined;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;
    addContact: (contact: Omit<Contact, 'id'>) => void;
    updateContact: (contact: Contact) => void;
    deleteContact: (id: string) => void;
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
    updateNote: (note: Note) => void;
    deleteNote: (id: string) => void;
    addFile: (file: Omit<CrmFile, 'id' | 'uploadDate'>) => void;
}
