import React, { useState } from "react";
import { FaPlus, FaFolder } from "react-icons/fa";
import { BsFileEarmarkTextFill, BsChatDotsFill } from "react-icons/bs";
import { ChatbotSidebar } from "../components/ChatbotSidebar";

// --- Types ---
interface Folder {
  name: string;
  noteCount: number;
}

const initialFolders: Folder[] = [
  { name: "Study Notes", noteCount: 5 },
  { name: "Meeting Minutes", noteCount: 3 },
  { name: "Project Alpha", noteCount: 12 },
];

// --- Sidebar Button Helper ---
const SidebarButton: React.FC<{ icon: React.ReactNode; label: string; className?: string }> = ({
  icon,
  label,
  className,
}) => (
  <button
    className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-white rounded-lg bg-[#a66ac6] hover:bg-[#8b31bc] transition-colors duration-200 ${className}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// --- Sidebar Component ---
const Sidebar: React.FC<{
  folders: Folder[];
  selectedFolder: string;
  onSelectFolder: (name: string) => void;
}> = ({ folders, selectedFolder, onSelectFolder }) => (
  <aside className="w-[280px] min-w-[280px] bg-[#63178b] p-6 flex flex-col border-r border-gray-700/50">
    <div className="mt-auto">
      <SidebarButton icon={<FaPlus />} label="New Folder" className="mb-3" />
      <SidebarButton icon={<FaPlus />} label="New Note" />
    </div>

    {/* Folders List */}
    <div className="flex-grow overflow-y-auto">
      <h2 className="px-2 mb-2 mt-3 text-lg font-semibold tracking-widest text-gray-300 uppercase">
        Folders
      </h2>
      <ul className="space-y-1">
        {folders.map((folder) => (
          <li key={folder.name}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectFolder(folder.name);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                selectedFolder === folder.name
                  ? "bg-[#AD49E1] text-white"
                  : "text-gray-300 hover:bg-[#AD49E1]"
              }`}
            >
              <FaFolder />
              <span className="flex-grow text-sm font-medium">{folder.name}</span>
              <span
                className={`font-normal ${
                  selectedFolder === folder.name ? "text-gray-200" : "text-gray-400"
                }`}
              >
                {folder.noteCount}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

// --- Main View Component ---
const MainView: React.FC<{ isChatbotOpen: boolean; setIsChatbotOpen: (val: boolean) => void }> = ({
  isChatbotOpen,
  setIsChatbotOpen,
}) => (
  <main className="flex-1 flex flex-col items-center justify-center text-center">
    <div className="flex flex-col items-center gap-4 text-gray-400">
      <BsFileEarmarkTextFill className="w-20 h-20 text-[#4a4562]" />
      <h1 className="text-2xl font-bold text-white">No note selected</h1>
      <p className="max-w-xs">
        Select a note from the sidebar or create a new one to get started.
      </p>
    </div>
    <ChatbotSidebar isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
  </main>
);

// --- MyNotes Main Component ---
export const MyNotes = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [folders] = useState<Folder[]>(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState<string>("Study Notes");

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black font-sans pt-10">
      <div className="w-full max-w-7xl h-[85vh] flex rounded-2xl border border-gray-700/50 overflow-hidden relative bg-[#1e0329]">
        
        {/* Sidebar */}
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />

        {/* Main View */}
        <MainView isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen} />

        {/* Floating Chat Button */}
        <button
          className="absolute flex items-center gap-2.5 px-5 py-3 font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bottom-6 right-6 bg-gradient-to-r from-purple-500 to-violet-600 hover:scale-105 shadow-violet-600/30"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          title="Chat with Synapse AI"
        >
          <BsChatDotsFill className="w-5 h-5" />
          <span>Chat with Synapse AI</span>
        </button>
      </div>
    </div>
  );
};
