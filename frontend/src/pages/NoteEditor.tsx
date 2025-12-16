import React, { useState, forwardRef, createContext, useContext, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Heading1, Heading2, Heading3, MessageCircle } from "lucide-react";
import { ChatbotSidebar } from "../components/ChatbotSidebar";
import toast from "react-hot-toast";

// --- TYPE DEFINITIONS ---
type FCC<P = {}> = React.FC<React.PropsWithChildren<P>>;
type IconProps = React.SVGProps<SVGSVGElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// --- HELPER FUNCTIONS ---
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// --- ICON COMPONENTS (Custom definitions) ---
const Icon: FCC<IconProps> = ({ children, className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)} {...props}>{children}</svg>
);

const FileText: FCC<IconProps> = (props) => <Icon {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></Icon>;
const Mic: FCC<IconProps> = (props) => <Icon {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Icon>;
const Upload: FCC<IconProps> = (props) => <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>;
const Bold: FCC<IconProps> = (props) => <Icon {...props}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></Icon>;
const Italic: FCC<IconProps> = (props) => <Icon {...props}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></Icon>;
const Underline: FCC<IconProps> = (props) => <Icon {...props}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></Icon>;
const Code: FCC<IconProps> = (props) => <Icon {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>;
const List: FCC<IconProps> = (props) => <Icon {...props}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></Icon>;
const ListOrdered: FCC<IconProps> = (props) => <Icon {...props}><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="m2 12 3-3 3 3"/><path d="M5 18H3l2-2 2 2Z"/></Icon>;

// --- UI COMPONENTS ---
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/90',
    ghost: 'hover:bg-slate-100/10 hover:text-slate-50',
    destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90',
    outline: 'border border-slate-200 hover:bg-slate-100/10 hover:text-slate-50',
  };
  const sizes = { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3', lg: 'h-11 rounded-md px-8', icon: 'h-10 w-10' };
  return <button className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)} ref={ref} {...props} />;
});

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input className={cn('flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50', className)} ref={ref} {...props} />;
});

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea className={cn('flex min-h-[80px] w-full rounded-md border border-slate-800 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50', className)} ref={ref} {...props} />;
});

const Card: FCC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn('rounded-lg border border-slate-800 bg-slate-950 text-slate-50 shadow-sm', className)} {...props} />;
const CardHeader: FCC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
const CardTitle: FCC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />;
const CardContent: FCC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn('p-6 pt-0', className)} {...props} />;

const TabsContext = createContext<{ activeTab: string; setActiveTab: (value: string) => void; }>({ activeTab: '', setActiveTab: () => {} });
const Tabs: FCC<{ value: string; onValueChange: (value: string) => void; className?: string; }> = ({ value, onValueChange, className, children }) => (
  <TabsContext.Provider value={{ activeTab: value, setActiveTab: onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>
);
const TabsList: FCC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400', className)} {...props} />;
const TabsTrigger: FCC<React.ButtonHTMLAttributes<HTMLButtonElement> & {value: string}> = ({ className, value, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return <button className={cn('inline-flex items-center w-full justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50', activeTab === value ? 'bg-slate-950 text-slate-50 shadow-sm' : '', className)} onClick={() => setActiveTab(value)} {...props} />;
};
const TabsContent: FCC<React.HTMLAttributes<HTMLDivElement> & {value: string}> = ({ value, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div {...props} /> : null;
};

// --- NOTE EDITOR COMPONENT ---
export const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. FETCH NOTE ---
    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return;
            try {
                const token = localStorage.getItem('token');
                // URL: /api/notes/notes/:id
                const res = await fetch(`http://localhost:5000/api/notes/notes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setTitle(data.title);
                    setContent(data.content || ''); 
                } else {
                    toast.error("Note not found");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load note");
            }
        };
        fetchNote();
    }, [id]);

    // --- 2. SAVE NOTE ---
    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');

        try {
            // URL: /api/notes/notes/:id
            const res = await fetch(`http://localhost:5000/api/notes/notes/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Note saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save note.");
        } finally {
            setIsSaving(false);
        }
    };

    // Sidebar & Toolbar Data
    const sidebarItems = [
        { icon: FileText, label: 'Summarize', action: () => navigate('/summarise') },
        { icon: Mic, label: 'Transcribe', action: () => navigate('/transcribe') },
        { icon: Upload, label: 'Upload Image', action: () => navigate('/image') },
    ];

    const formatButtons = [
        { icon: Heading1, label: 'Heading 1', format: '# ' },
        { icon: Heading2, label: 'Heading 2', format: '## ' },
        { icon: Heading3, label: 'Heading 3', format: '### ' },
        { icon: Bold, label: 'Bold', format: '**' },
        { icon: Italic, label: 'Italic', format: '*' },
        { icon: Underline, label: 'Underline', format: '_' },
        { icon: Code, label: 'Code Block', format: '```' },
        { icon: List, label: 'Bullet List', format: '• ' },
        { icon: ListOrdered, label: 'Numbered List', format: '1. ' },
    ];
    
    // Formatting Logic
    const handleFormat = (format: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        if (format.startsWith('#')) {
            const lineStart = content.lastIndexOf('\n', start - 1) + 1;
            const lineEnd = content.indexOf('\n', end) === -1 ? content.length : content.indexOf('\n', end);
            const currentLine = content.substring(lineStart, lineEnd);
            const trimmedLine = currentLine.trimStart();
            
            let newLine;
            if (trimmedLine.startsWith(format)) {
                newLine = trimmedLine.substring(format.length);
            } else if (trimmedLine.match(/^#+ /)) {
                newLine = trimmedLine.replace(/^#+ /, format);
            } else {
                newLine = format + currentLine;
            }
            const newContent = content.substring(0, lineStart) + newLine + content.substring(lineEnd);
            setContent(newContent);
            setTimeout(() => textarea.focus(), 0);
            return;
        }
        
        let newText = '';
        if (format === '```') {
            newText = `\n${format}\n${selectedText}\n${format}\n`;
        } else if (format === '• ' || format === '1. ') {
            const lines = selectedText.split('\n').map(line => line.trim() ? `${format}${line}`: line);
            newText = lines.join('\n');
            if (start === end) newText = format;
        } else {
            newText = `${format}${selectedText}${format}`;
        }
        
        const newContent = content.substring(0, start) + newText + content.substring(end);
        setContent(newContent);

        textarea.focus();
        setTimeout(() => {
            if (format.length === 2 && selectedText) {
                textarea.setSelectionRange(start + 1, end + 1);
            } else {
                textarea.setSelectionRange(start + newText.length, start + newText.length);
            }
        }, 0);
    };
    
    // Preview Logic
    const renderPreview = () => {
        let previewContent = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        previewContent = previewContent
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b border-slate-700 pb-2">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 border-b-2 border-slate-600 pb-3">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<u>$1</u>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-white">$1</code></pre>')
            .replace(/^• (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^1\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
            .replace(/\n/g, '<br />');

        return { __html: previewContent };
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-50 pt-15">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-400 hover:text-purple-400 transition-colors group">
                            <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">Back</span>
                        </button>
                        <div className="h-4 w-px bg-slate-800" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">✨ Note Editor</h1>
                        <div className="ml-auto flex">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow transition disabled:opacity-50"
                            >
                                <Save className="text-white w-4 h-4" />
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-69px)]">
                {/* Left Sidebar */}
                <div className="w-64 border-r border-slate-800 bg-slate-950/50 min-h-full ">
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">AI Tools</h2>
                        {sidebarItems.map((item, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start h-12 text-slate-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                                onClick={item.action}
                            >
                                <item.icon className="h-5 w-5 mr-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                                <span className="group-hover:text-purple-400 transition-colors">{item.label}</span>
                            </Button>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button
                          onClick={() => setOpen(true)}
                          className="fixed bottom-6 right-6 p-4 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition"
                        >
                          <MessageCircle className="h-6 w-6" />
                        </button>
                        <ChatbotSidebar isOpen={open} onClose={() => setOpen(false)} />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#020617] bg-[radial-gradient(ellipse_at_top,_#2d0d4a,_transparent_70%),radial-gradient(ellipse_at_bottom,_#1a0b2e,_transparent_80%)]">
                    <div className="space-y-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your note title..."
                                className="text-3xl font-bold border-none bg-transparent px-0 focus-visible:ring-0 text-purple-500 placeholder:text-slate-600 h-auto py-2 focus:placeholder:text-slate-700"
                            />
                            <div className="h-px bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                            <div className="flex justify-center items-center w-full">
                                <TabsList className="grid justify-center w-50 items-center grid-cols-2 bg-slate-900/80 border border-slate-800">
                                    <TabsTrigger value="write">Write</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <TabsContent value="write" className="space-y-4 mt-6">
                                {/* Formatting Toolbar */}
                                  <div className="flex justify-center">
                                    <div className="flex items-center justify-center space-x-1 p-2 bg-slate-900/80 rounded-lg border border-slate-800 w-fit">
                                        {formatButtons.map((button) => (
                                            <Button
                                                key={button.label}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleFormat(button.format)}
                                                className="h-10 w-10 p-0 hover:bg-purple-500/20 hover:text-purple-400 hover:shadow-lg transition-all duration-300"
                                                title={button.label}
                                            >
                                                <button.icon className="h-4 w-4" />
                                            </Button>
                                        ))}
                                    </div>
                                  </div>
                                
                                {/* Content Editor */}
                                <Card className="bg-slate-950/50 border-slate-800 hover:border-purple-500/50 transition-colors">
                                    <Textarea
                                        ref={textareaRef}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Start writing your note..."
                                        className="min-h-[500px] resize-none text-base leading-relaxed bg-transparent border-none focus-visible:ring-0 placeholder:text-slate-600 focus:placeholder:text-slate-700"
                                        style={{ caretColor: '#c084fc' }}
                                    />
                                </Card>
                            </TabsContent>

                            <TabsContent value="preview" className="mt-6">
                                <Card className="bg-slate-950/50 border-slate-800 min-h-[500px]">
                                    <CardHeader>
                                        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            {title || 'Untitled Note'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
                                            dangerouslySetInnerHTML={renderPreview()}
                                        />
                                        {!content && (
                                            <p className="text-slate-500 italic mt-4">
                                                Write something in the editor to see the preview here.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
};