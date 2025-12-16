import React, { useState, useEffect } from 'react';
import { Folder, FileText, Clock, Plus, Loader2, Trash2, MoreVertical, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// --- TYPES ---
type FolderType = {
  id: string;
  name: string;
};

type NoteType = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  folderId: string;
};

export const MyNotes = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Track which folder menu is open
  const [openMenuFolderId, setOpenMenuFolderId] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  const API_BASE=import.meta.env.VITE_API_URL;

  // --- EFFECT HOOKS ---
  useEffect(() => {
    fetchFolders();
    
    // Close menu when clicking anywhere else
    const handleClickOutside = () => setOpenMenuFolderId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeFolderId) {
      fetchNotes(activeFolderId);
    } else {
      setNotes([]);
    }
  }, [activeFolderId]);

  // --- API FUNCTIONS ---
  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notes/folders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFolders(data);
        if (data.length > 0 && !activeFolderId) setActiveFolderId(data[0].id);
      }
    } catch (err) { console.error(err); }
  };

  const fetchNotes = async (folderId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes/folders/${folderId}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setNotes(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // --- ACTIONS ---
  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    try {
      const res = await fetch(`${API_BASE}/api/notes/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name })
      });
      if (res.ok) fetchFolders();
    } catch (err) { console.error(err); }
  };

  const handleCreateNote = async () => {
    if (!activeFolderId) {
      alert("Please select a folder first.");
      return;
    }
    const title = prompt("Enter note title:") || "Untitled Note";
    try {
      const res = await fetch(`${API_BASE}/api/notes/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content: "", folderId: activeFolderId })
      });
      if (res.ok) fetchNotes(activeFolderId); 
    } catch (err) { console.error(err); }
  };

  // [NEW] RENAME FOLDER ACTION
  const handleRenameFolder = async (folderId: string, currentName: string) => {
    const newName = prompt("Enter new folder name:", currentName);
    if (!newName || newName === currentName) return;

    try {
      const res = await fetch(`${API_BASE}/api/notes/folders/${folderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName })
      });

      if (res.ok) {
        // Update local state to reflect change immediately
        setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f));
      }
    } catch (err) { alert("Failed to rename folder"); }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!window.confirm("Are you sure? This will delete all notes inside this folder.")) return;
    try {
      const res = await fetch(`${API_BASE}/api/notes/folders/${folderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFolders(folders.filter(f => f.id !== folderId));
        if (activeFolderId === folderId) {
          setActiveFolderId(null);
          setNotes([]);
        }
      }
    } catch (err) { alert("Failed to delete folder"); }
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/notes/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setNotes(notes.filter(n => n.id !== noteId));
    } catch (err) { alert("Failed to delete note"); }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 pt-20 font-sans">
      <main className="w-full max-w-7xl h-[85vh] rounded-2xl shadow-2xl flex border border-slate-800 overflow-hidden">
        
        {/* --- LEFT SIDEBAR (FOLDERS) --- */}
        <aside className="w-72 bg-[#020617] bg-[radial-gradient(ellipse_at_top_left,_#2d0d4a,_transparent_70%)] p-4 flex flex-col border-r border-slate-800">
          
          <div className="flex flex-col space-y-3 mb-6">
            <button onClick={handleCreateNote} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-purple-900/40">
              <Plus size={18} /> New Note
            </button>
            <button onClick={handleCreateFolder} className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-semibold py-3 rounded-lg transition-all">
              <Plus size={18} /> New Folder
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Folders</h2>
            <div className="space-y-1 pb-10"> {/* Added padding bottom for dropdown space */}
              {folders.length === 0 ? (
                <p className="text-slate-600 text-sm text-center mt-4 italic">No folders created yet.</p>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${
                      activeFolderId === folder.id 
                        ? 'bg-purple-500/20 text-white border border-purple-500/30' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center truncate flex-1">
                      <Folder className={`w-4 h-4 mr-3 flex-shrink-0 ${activeFolderId === folder.id ? "text-purple-400 fill-purple-400/20" : "text-slate-500"}`} />
                      <span className="font-medium text-sm truncate">{folder.name}</span>
                    </div>

                    {/* --- THREE DOT MENU BUTTON --- */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Don't select folder
                                setOpenMenuFolderId(openMenuFolderId === folder.id ? null : folder.id);
                            }}
                            className={`p-1 rounded-md hover:bg-slate-700 transition-colors ${
                                activeFolderId === folder.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            } ${openMenuFolderId === folder.id ? 'opacity-100 bg-slate-700' : ''}`}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* --- DROPDOWN MENU --- */}
                        {openMenuFolderId === folder.id && (
                            <div className="absolute right-0 top-8 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRenameFolder(folder.id, folder.name);
                                        setOpenMenuFolderId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-purple-400 flex items-center gap-2"
                                >
                                    <Edit className="w-3 h-3" /> Rename
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFolder(folder.id);
                                        setOpenMenuFolderId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* --- RIGHT CONTENT (NOTES GRID) --- */}
        <div className="flex-1 p-8 bg-[#020617] bg-[radial-gradient(ellipse_at_top,_#2d0d4a,_transparent_70%)] relative overflow-y-auto">
           
           <div className="mb-8 flex items-end justify-between border-b border-slate-800/50 pb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {folders.find(f => f.id === activeFolderId)?.name || "Select a Folder"}
                </h1>
                <p className="text-slate-500 text-sm">{notes.length} Notes</p>
              </div>
           </div>

           {loading ? (
             <div className="flex items-center justify-center h-64 text-purple-400">
               <Loader2 className="w-10 h-10 animate-spin" />
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {notes.map(note => (
                 <div 
                   key={note.id} 
                   onClick={() => navigate(`/editor/${note.id}`)} 
                   className="group relative p-5 rounded-2xl flex flex-col h-56 bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-purple-500/50 shadow-xl hover:shadow-purple-900/20 transition-all cursor-pointer overflow-hidden"
                 >
                   <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                       <FileText className="w-5 h-5 " />
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-slate-500 flex items-center bg-black/20 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(note.updatedAt).toLocaleDateString()}
                        </div>
                        
                        <button 
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="p-1.5 rounded-full hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors z-10"
                            title="Delete Note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   </div>
                   
                   <h3 className="font-bold text-lg text-slate-200 mb-2 truncate group-hover:text-purple-200 transition-colors">
                     {note.title}
                   </h3>
                   <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {note.content ? note.content.replace(/<[^>]*>?/gm, '') : "No additional text..."}
                   </p>

                   <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                 </div>
               ))}
               
               {notes.length === 0 && !loading && (
                 <div className="col-span-full flex flex-col items-center justify-center text-slate-600 mt-20 opacity-50">
                   <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                     <Folder className="w-8 h-8" />
                   </div>
                   <p>This folder is empty.</p>
                   <button onClick={handleCreateNote} className="text-purple-400 hover:text-purple-300 text-sm mt-2 font-medium">
                     Create your first note &rarr;
                   </button>
                 </div>
               )}
             </div>
           )}
        </div>
      </main>
    </div>
  );
};