import React, { useState } from 'react';
// FIX: Corrected import paths to be relative.
// FIX: The CrmData type should be imported from types.ts.
import { CrmData, Contact, CrmFile } from '../types';
import { PlusIcon, FileIcon, UploadIcon, DownloadIcon, ExternalLinkIcon } from './icons';
import Modal from './Modal';

interface FilesProps {
  data: CrmData;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploadForm: React.FC<{
    onSave: (fileData: Omit<CrmFile, 'id' | 'uploadDate'>) => void;
    onClose: () => void;
    contacts: Contact[];
}> = ({ onSave, onClose, contacts }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contactId, setContactId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        setIsProcessing(true);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            const fileData: Omit<CrmFile, 'id' | 'uploadDate'> = {
                name: selectedFile.name,
                type: selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown',
                size: formatFileSize(selectedFile.size),
                contactId: contactId || undefined,
                dataUrl: reader.result as string,
            };
    
            onSave(fileData);
            setIsProcessing(false);
        };
        reader.onerror = () => {
            alert('Error reading file.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upload New File</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        {selectedFile ? (
                            <p className="text-sm text-gray-500 dark:text-gray-300 pt-2">{selectedFile.name} ({formatFileSize(selectedFile.size)})</p>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF, etc.</p>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Related Contact (Optional)</label>
                <select id="contactId" value={contactId} onChange={e => setContactId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="">None</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md font-semibold text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold text-sm" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Upload'}
                </button>
            </div>
        </form>
    );
};


const Files: React.FC<FilesProps> = ({ data }) => {
  const { files, getContactById, contacts, addFile } = data;
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const handleSaveFile = (fileData: Omit<CrmFile, 'id' | 'uploadDate'>) => {
    addFile(fileData);
    setUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Files</h1>
        <button onClick={() => setUploadModalOpen(true)} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Upload File
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Size</th>
                <th scope="col" className="px-6 py-3">Upload Date</th>
                <th scope="col" className="px-6 py-3">Related Contact</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => {
                const contact = file.contactId ? getContactById(file.contactId) : null;
                return (
                  <tr key={file.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                        <FileIcon className="w-5 h-5 mr-2 text-gray-400"/>
                        {file.name}
                    </td>
                    <td className="px-6 py-4">{file.type}</td>
                    <td className="px-6 py-4">{file.size}</td>
                    <td className="px-6 py-4">{new Date(file.uploadDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{contact?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <a href={file.dataUrl} download={file.name} title="Download" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                <DownloadIcon className="w-5 h-5" />
                            </a>
                            <a href={file.dataUrl} target="_blank" rel="noopener noreferrer" title="Open in new tab" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                                <ExternalLinkIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <FileUploadForm 
            contacts={contacts}
            onSave={handleSaveFile}
            onClose={() => setUploadModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Files;