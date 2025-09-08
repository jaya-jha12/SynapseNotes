import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, Eye, Clock, Tag } from 'lucide-react';

// --- MOCK DATA ---
// Data to populate the UI, mimicking the structure in the image.

type FolderType = {
  name: string;
  subfolders?: FolderType[];
};

const folders: FolderType[] = [
  { name: 'Notes', subfolders: [{ name: 'Sub Note 1' }, { name: 'Sub Note 2' }] },
  { name: 'Moves' },
  { name: 'Concar' },
  { name: 'Foldcar' },
  { name: 'Notes', subfolders: [{ name: 'Another Sub Note' }] },
  { name: 'Idviduar' },
  { name: 'Boips' },
  { name: 'Commary' },
];

type ItemType = {
    id: number;
    type: 'note' | 'folder';
    title: string;
    content?: string;
    color: 'dark-purple' | 'dark-blue';
    views?: string;
    time?: string;
    tagCount?: number;
};

const items: ItemType[] = [
    { id: 1, type: 'note', title: 'Note', content: 'Your your notes elit eexod allplain odi tosiet...', color: 'dark-blue', views: '5k' },
    { id: 2, type: 'note', title: 'Tinteite', content: 'Anell note sintes alialisum uitem', color: 'dark-blue', views: '4k' },
    { id: 3, type: 'folder', title: 'Note', content: 'Loen nour vintes sit yard alplonenes.', color: 'dark-purple', views: '31k' },
    { id: 4, type: 'note', title: 'Tolledies', content: 'Theaiakmyourions estent mrditom...', color: 'dark-blue', views: '5k', tagCount: 3 },
    { id: 5, type: 'note', title: 'Sily Nise', content: 'Your your note alipictet. eolideuryoe tionot rosiet...', color: 'dark-blue', views: '71k', time: '20m' },
    { id: 6, type: 'note', title: 'Follets', content: 'Lastl note of your greerend mnameri orit...', color: 'dark-blue', views: '5k', tagCount: 6 },
];

const colorClasses = {
    'dark-purple': {
        bg: 'bg-purple-500/50',
        text: 'text-white',
        iconBg: 'bg-purple-950',
        iconText: 'text-white'
    },
    'dark-blue': {
        bg: 'bg-blue-500/50',
        text: 'text-white',
        iconBg: 'bg-blue-900',
        iconText: 'text-white'
    }
};

// --- COMPONENTS ---

// Folder Tree Item Component (Recursive)
const FolderTreeItem = ({ folder, level = 0 }: { folder: FolderType; level?: number }) => {
  const [isOpen, setIsOpen] = useState(level === 0); // Open top-level folders by default
  const hasSubfolders = folder.subfolders && folder.subfolders.length > 0;

  return (
    <div>
      <div
        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
          level === 0 && isOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'
        }`}
        style={{ paddingLeft: `${0.5 + level * 1}rem` }}
        onClick={() => hasSubfolders && setIsOpen(!isOpen)}
      >
        {hasSubfolders && (
          <ChevronRight className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        )}
        <Folder className={`w-5 h-5 mr-3 ${hasSubfolders ? '' : 'ml-6'}`} />
        <span className="font-medium">{folder.name}</span>
      </div>
      {isOpen && hasSubfolders && (
        <div className="mt-1">
          {folder.subfolders?.map((subfolder, index) => (
            <FolderTreeItem key={index} folder={subfolder} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-800 p-4 flex flex-col rounded-l-2xl border-r border-slate-700">
            <div className="flex flex-col space-y-2 mb-6">
                <button className="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors shadow-sm">
                    + New Note
                </button>
                <button className="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors shadow-sm">
                    + New Folder
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Notes</h2>
                 <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" style={{top: '8px', bottom: 'calc(100% - 32px)'}}></div>
                    {folders.map((folder, index) => (
                        <FolderTreeItem key={index} folder={folder} />
                    ))}
                 </div>
            </div>
        </aside>
    );
};

// Note/Folder Card Component
const ItemCard = ({ item }: { item: ItemType }) => {
    const colors = colorClasses[item.color];

    return (
        <div className={`p-4 rounded-xl flex flex-col h-full shadow-2xl transition-transform hover:-translate-y-1 border border-white/10 ${colors.bg}`}>
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
                        {item.type === 'note' ? <FileText className={`w-6 h-6 ${colors.iconText}`} /> : <Folder className={`w-6 h-6 ${colors.iconText}`} />}
                    </div>
                    {item.time && (
                        <div className="flex items-center text-xs bg-black/20 text-white font-semibold px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{item.time}</span>
                        </div>
                    )}
                     {item.tagCount && (
                        <div className="flex items-center text-xs bg-black/20 text-white font-semibold px-2 py-1 rounded-full">
                            <Tag className="w-3 h-3 mr-1" />
                            <span>{item.tagCount}</span>
                        </div>
                    )}
                </div>
                <h3 className={`font-bold text-lg mb-1 ${colors.text}`}>{item.title}</h3>
                <p className={`text-sm opacity-80 ${colors.text}`}>{item.content}</p>
            </div>
            <div className={`flex items-center text-xs mt-4 font-medium ${colors.text} opacity-70`}>
                <Eye className="w-4 h-4 mr-1.5" />
                <span>{item.views}</span>
            </div>
        </div>
    );
};


// Main App Component
export const MyNotes = () => {
    return (
        <div className="bg-black min-h-screen flex items-center justify-center p-4 pt-20 font-sans">
            <main className="w-full max-w-6xl h-[800px] rounded-2xl shadow-2xl flex">
                <Sidebar />
                <div className="flex-1 p-8 bg-slate-900 rounded-r-2xl overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

