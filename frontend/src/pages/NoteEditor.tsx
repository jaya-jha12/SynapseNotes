import { useState } from 'react';
import type { FC } from 'react';
import { 
    MessageCircle, 
    FolderPlus, 
    FileText,
    ArrowLeft 
} from 'lucide-react';
import { NoteEditor } from '../components/NoteEditor';
import { ChatbotSidebar } from '../components/ChatbotSidebar';


// --- Type Definitions ---
interface Note {
  id: string;
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Folder {
  id: string;
  name: string;
  notes: Note[];
}





const MyNotes: FC = () => {
    const [folders, setFolders] = useState<Folder[]>([
        { id: '1', name: 'Study Notes', notes: [] }
    ]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(folders[0]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    const createFolder = () => {
        if (newFolderName.trim()) {
            const newFolder: Folder = { id: Date.now().toString(), name: newFolderName.trim(), notes: [] };
            setFolders([...folders, newFolder]);
            setNewFolderName('');
            setIsCreateFolderOpen(false);
        }
    };

    const createNote = () => {
        if (selectedFolder) {
            const newNote: Note = { id: Date.now().toString(), title: 'Untitled Note', content: '', attachments: [], createdAt: new Date(), updatedAt: new Date() };
            const updatedFolder = { ...selectedFolder, notes: [...selectedFolder.notes, newNote] };
            const updatedFolders = folders.map(f => f.id === selectedFolder.id ? updatedFolder : f);
            setFolders(updatedFolders);
            setSelectedFolder(updatedFolder);
            setSelectedNote(newNote);
        }
    };

    const updateNote = (updatedNote: Note) => {
        if (selectedFolder) {
            const updatedNotes = selectedFolder.notes.map(n => n.id === updatedNote.id ? updatedNote : n);
            const updatedFolder = { ...selectedFolder, notes: updatedNotes };
            const updatedFolders = folders.map(f => f.id === selectedFolder.id ? updatedFolder : f);
            setFolders(updatedFolders);
            setSelectedFolder(updatedFolder);
            setSelectedNote(updatedNote);
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-[#0d0d1a] text-slate-300 font-sans relative">
            
            <a href="/" className="absolute top-6 left-6 flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors z-10">
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Back to Home</span>
            </a>

            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-80 border-r border-slate-800 bg-[#10101b] p-4 pt-20 space-y-6 overflow-y-auto">
                    <button onClick={() => setIsCreateFolderOpen(true)} className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md text-sm transition-colors">
                        <FolderPlus className="h-4 w-4 mr-2" /> Create Folder
                    </button>
                    
                    {/* Folders List */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-slate-400 px-2">Folders</h3>
                        {folders.map((folder) => (
                            <div key={folder.id} onClick={() => setSelectedFolder(folder)} className={`p-3 rounded-md cursor-pointer transition-all ${selectedFolder?.id === folder.id ? 'bg-purple-600/20 text-purple-300' : 'hover:bg-slate-800/50'}`}>
                                <h4 className="text-sm font-semibold">{folder.name}</h4>
                                <p className="text-xs text-slate-400">{folder.notes.length} notes</p>
                            </div>
                        ))}
                    </div>

                    {/* Notes in Selected Folder */}
                    {selectedFolder && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-medium text-slate-400">Notes</h3>
                                <button onClick={createNote} className="text-purple-400 hover:text-purple-300 text-sm font-semibold">New</button>
                            </div>
                            {selectedFolder.notes.map((note) => (
                                <div key={note.id} onClick={() => setSelectedNote(note)} className={`p-3 rounded-md cursor-pointer transition-all ${selectedNote?.id === note.id ? 'bg-slate-700' : 'hover:bg-slate-800/50'}`}>
                                    <h4 className="text-sm font-medium truncate text-slate-200">{note.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{note.updatedAt.toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <main className="flex-1">
                    {selectedNote ? (
                        <NoteEditor note={selectedNote} onUpdate={updateNote} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-slate-500">
                            <div>
                                <FileText className="h-16 w-16 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-400">No note selected</h3>
                                <p>Select a note or create a new one to get started.</p>
                            </div>
                        </div>
                    )}
                </main>

                <ChatbotSidebar isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
            </div>

            {/* Create Folder Dialog */}
            {isCreateFolderOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-[#1e1e3f] p-6 rounded-lg shadow-xl w-full max-w-sm border border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4">Create New Folder</h3>
                        <input placeholder="Folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && createFolder()} className="w-full bg-slate-800 border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-4" />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsCreateFolderOpen(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm">Cancel</button>
                            <button onClick={createFolder} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm">Create</button>
                        </div>
                    </div>
                </div>
            )}

             <button 
                onClick={() => setIsChatbotOpen(!isChatbotOpen)} 
                title="Chat with Synapse AI" 
                className="fixed bottom-6 right-6 h-14 w-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-30"
                aria-label="Open AI Assistant"
            >
                <MessageCircle className="h-7 w-7" />
            </button>
        </div>
    );
};

export default MyNotes;