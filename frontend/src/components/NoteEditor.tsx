import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { 
    FileText, 
    X,  
    Save, 
    Upload, 
    Image as ImageIconLucide 
} from 'lucide-react';

// --- Type Definitions ---
interface Note {
  id: string;
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}


export const NoteEditor: FC<NoteEditorProps> = ({ note, onUpdate }) => {
    const [title, setTitle] = useState<string>(note.title);
    const [content, setContent] = useState<string>(note.content);
    const [attachments, setAttachments] = useState<string[]>(note.attachments);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setAttachments(note.attachments);
    }, [note]);

    const handleSave = () => {
        onUpdate({ ...note, title: title.trim() || 'Untitled Note', content, attachments, updatedAt: new Date() });
        const saveButton = document.getElementById('save-btn');
        if(saveButton) {
            saveButton.innerText = "Saved!";
            saveButton.classList.add('bg-green-600');
            setTimeout(() => {
                const saveButtonSpan = saveButton.querySelector('span');
                if (saveButtonSpan) saveButtonSpan.innerText = "Save";
                saveButton.classList.remove('bg-green-600');
            }, 1500);
        }
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newAttachments = files.map(file => file.name);
        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <div className="h-full flex flex-col bg-[#10101b] text-slate-200">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full text-slate-100 placeholder-slate-500" placeholder="Note title..." />
                    <button id="save-btn" onClick={handleSave} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                    </button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>Created: {note.createdAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated: {note.updatedAt.toLocaleDateString()}</span>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing your note..." className="w-full min-h-[300px] resize-none bg-transparent text-slate-300 p-0 text-base border-none focus:ring-0" />
                
                <hr className="border-slate-800" />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-300">Attachments</label>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-sm">
                            <Upload className="h-4 w-4" />
                            <span>Upload</span>
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />

                    {attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {attachments.map((attachment, index) => (
                                <div key={index} className="bg-slate-800/50 p-3 rounded-md flex items-center justify-between">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        {attachment.toLowerCase().includes('.pdf') ? <FileText className="h-4 w-4 text-purple-400 flex-shrink-0" /> : <ImageIconLucide className="h-4 w-4" />}
                                        <span className="text-sm truncate">{attachment}</span>
                                    </div>
                                    <button onClick={() => removeAttachment(index)} className="h-6 w-6 p-0 rounded-full hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No attachments yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};