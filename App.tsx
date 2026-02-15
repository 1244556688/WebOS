import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Lock, ArrowRight, Cpu, Code2, FolderOpen, LogOut, 
  Wifi, Battery, X, Minus, Square, Play, Save, Plus, Trash2, 
  Maximize2, Minimize2, Search, FileCode, Layers, Sparkles 
} from 'lucide-react';

// --- TYPES ---
type FileType = 'html' | 'css' | 'js';
interface FileItem { id: string; name: string; type: FileType; content: string; }
interface UserAccount { username: string; password?: string; files: FileItem[]; }
enum WinType { IDE = 'IDE', EXPLORER = 'EXPLORER' }
interface WinState { id: WinType; isOpen: boolean; isMaximized: boolean; zIndex: number; }

// --- CONSTANTS ---
const STORAGE_KEY = 'nova_os_v1';
const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'index.html', type: 'html', content: '<div class="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-10">\n  <h1 class="text-6xl font-black mb-4 animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Nova OS</h1>\n  <p class="text-white/60 text-xl font-medium">Tablet-First Cloud IDE</p>\n  <div class="mt-8 p-4 glass-bright rounded-2xl border border-white/10 text-sm text-blue-300">Ready for development.</div>\n</div>' },
  { id: '2', name: 'style.css', type: 'css', content: 'body { background: #020617; }\n.glass-bright { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); }' },
  { id: '3', name: 'main.js', type: 'js', content: 'console.log("Welcome to the grid.");' }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [authData, setAuthData] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [windows, setWindows] = useState<Record<WinType, WinState>>({
    [WinType.IDE]: { id: WinType.IDE, isOpen: false, isMaximized: false, zIndex: 10 },
    [WinType.EXPLORER]: { id: WinType.EXPLORER, isOpen: false, isMaximized: false, zIndex: 10 },
  });
  const [maxZ, setMaxZ] = useState(10);
  const [activeWin, setActiveWin] = useState<WinType | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStore = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const saveStore = (data: any) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const store = getStore();
    if (isRegister) {
      if (store[authData.user]) return setError('該用戶名已被佔用');
      store[authData.user] = { username: authData.user, password: authData.pass, files: INITIAL_FILES };
      saveStore(store);
      alert('註冊成功！');
      setIsRegister(false);
    } else {
      const u = store[authData.user];
      if (u && u.password === authData.pass) {
        setCurrentUser(u);
        setTimeout(() => toggleWin(WinType.IDE), 500);
      } else setError('用戶名或密碼錯誤');
    }
  };

  const toggleWin = (type: WinType) => {
    const isOpening = !windows[type].isOpen;
    const newZ = isOpening ? maxZ + 1 : windows[type].zIndex;
    if (isOpening) setMaxZ(newZ);
    setWindows(prev => ({ ...prev, [type]: { ...prev[type], isOpen: isOpening, zIndex: newZ } }));
    setActiveWin(isOpening ? type : null);
  };

  const focusWin = (type: WinType) => {
    const newZ = maxZ + 1;
    setMaxZ(newZ);
    setWindows(prev => ({ ...prev, [type]: { ...prev[type], zIndex: newZ } }));
    setActiveWin(type);
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-6 bg-[#020617]">
        <div className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl border border-white/20 relative group overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full"></div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl glow-blue animate-pulse">
              <Cpu className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">NOVA OS</h1>
            <p className="text-white/40 text-[10px] mt-2 font-bold tracking-[0.3em] uppercase">The Grid Terminal</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="text" placeholder="Username" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50" value={authData.user} onChange={e => setAuthData({...authData, user: e.target.value})} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="password" placeholder="Password" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50" value={authData.pass} onChange={e => setAuthData({...authData, pass: e.target.value})} />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              {isRegister ? 'CREATE ACCOUNT' : 'LOGIN GRID'} <ArrowRight size={20} />
            </button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-8 text-white/40 text-sm hover:text-blue-400 transition-colors">
            {isRegister ? 'Already registered? Sign In' : 'New Developer? Claim Identity'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-[#020617]">
      <div className="p-8 grid grid-cols-1 gap-10 w-fit select-none">
        <DesktopIcon icon={<Code2 size={32}/>} label="Nova IDE" color="blue" onClick={() => toggleWin(WinType.IDE)} />
        <DesktopIcon icon={<FolderOpen size={32}/>} label="Explorer" color="indigo" onClick={() => toggleWin(WinType.EXPLORER)} />
      </div>

      <Window title="Nova Terminal IDE" state={windows[WinType.IDE]} onFocus={() => focusWin(WinType.IDE)} onClose={() => toggleWin(WinType.IDE)}>
        <IDEPane files={currentUser.files} onSave={files => {
          const store = getStore();
          store[currentUser.username].files = files;
          saveStore(store);
          setCurrentUser({ ...currentUser, files });
        }} />
      </Window>

      <Window title="File Explorer" state={windows[WinType.EXPLORER]} onFocus={() => focusWin(WinType.EXPLORER)} onClose={() => toggleWin(WinType.EXPLORER)}>
        <div className="p-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {currentUser.files.map(f => (
            <div key={f.id} className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col items-center">
              <FileCode className="text-blue-400 mb-3" size={40} />
              <span className="text-xs font-medium text-white/80">{f.name}</span>
            </div>
          ))}
          <div className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer text-white/20 hover:text-blue-400 transition-all">
            <Plus size={32} />
          </div>
        </div>
      </Window>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 w-[95%] max-w-4xl glass rounded-2xl px-6 flex items-center justify-between shadow-2xl z-[9999] border border-white/10">
        <div className="flex items-center gap-6 text-white/40"><Wifi size={18}/> <Battery size={18}/></div>
        <div className="flex gap-4">
          <TaskIcon active={activeWin === WinType.IDE} icon={<Code2 size={24}/>} onClick={() => toggleWin(WinType.IDE)} />
          <TaskIcon active={activeWin === WinType.EXPLORER} icon={<FolderOpen size={24}/>} onClick={() => toggleWin(WinType.EXPLORER)} />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right leading-none hidden sm:block">
            <div className="text-sm font-bold text-white">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-[9px] text-white/30 uppercase tracking-tighter">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
          </div>
          <button onClick={() => setCurrentUser(null)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><LogOut size={20}/></button>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const DesktopIcon = ({ icon, label, color, onClick }: any) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition-all">
    <div className={`w-16 h-16 rounded-2xl glass flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 text-blue-400 transition-all`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded-full">{label}</span>
  </div>
);

const TaskIcon = ({ active, icon, onClick }: any) => (
  <button onClick={onClick} className={`p-3 rounded-xl transition-all relative ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
    {icon}
    {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>}
  </button>
);

const Window = ({ title, state, onClose, onFocus, children }: any) => {
  if (!state.isOpen) return null;
  return (
    <div onClick={onFocus} style={{ zIndex: state.zIndex }} className={`fixed glass shadow-2xl overflow-hidden transition-all duration-300 ${state.isMaximized ? 'inset-0 m-0 rounded-none' : 'inset-6 sm:inset-10 lg:inset-20 rounded-2xl'} flex flex-col border border-white/20`}>
      <div className="h-12 border-b border-white/10 bg-white/5 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-bold text-white/60 tracking-wider uppercase">{title}</span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 transition-colors"><Minus size={14}/></button>
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 transition-colors"><Square size={14}/></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 hover:bg-red-500/50 rounded-lg text-white/40 hover:text-white transition-colors"><X size={14}/></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#0d1117] relative">{children}</div>
    </div>
  );
};

const IDEPane = ({ files, onSave }: { files: FileItem[], onSave: (f: FileItem[]) => void }) => {
  const [localFiles, setLocalFiles] = useState(files);
  const [activeId, setActiveId] = useState(files[0]?.id || '');
  const [split, setSplit] = useState(50);
  const active = localFiles.find(f => f.id === activeId);

  const srcDoc = useMemo(() => {
    const html = localFiles.find(f => f.type === 'html')?.content || '';
    const css = localFiles.filter(f => f.type === 'css').map(f => f.content).join('\n');
    const js = localFiles.filter(f => f.type === 'js').map(f => f.content).join('\n');
    return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`;
  }, [localFiles]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-12 border-b border-white/5 bg-slate-900/80 flex items-center justify-between px-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar flex-1">
          {localFiles.map(f => (
            <button key={f.id} onClick={() => setActiveId(f.id)} className={`px-4 h-9 text-[11px] font-bold rounded-t-lg transition-all border-x border-t ${activeId === f.id ? 'bg-[#0d1117] border-white/10 text-blue-400' : 'text-white/30 border-transparent hover:text-white hover:bg-white/5'}`}>
              {f.name}
            </button>
          ))}
          <button className="p-2 text-white/20 hover:text-white ml-2 transition-colors"><Plus size={14}/></button>
        </div>
        <div className="flex gap-2 px-2 shrink-0">
          <button onClick={() => onSave(localFiles)} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold hover:bg-white/10 active:scale-95 transition-all"><Save size={12}/> SAVE</button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-lg text-[10px] font-bold glow-blue hover:bg-blue-500 active:scale-95 transition-all"><Play size={12}/> RUN</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <textarea 
          value={active?.content || ''} 
          onChange={e => setLocalFiles(prev => prev.map(f => f.id === activeId ? { ...f, content: e.target.value } : f))}
          className="h-full bg-transparent p-6 text-gray-300 focus:outline-none code-font text-base leading-relaxed resize-none selection:bg-blue-500/30"
          style={{ width: `${split}%` }}
          spellCheck={false}
          autoFocus
        />
        <div className="w-2 cursor-col-resize bg-white/5 hover:bg-blue-500/50 transition-colors flex items-center justify-center group" 
             onTouchMove={e => setSplit((e.touches[0].clientX / window.innerWidth) * 100)}
             onMouseDown={e => {
                const move = (em: MouseEvent) => setSplit((em.clientX / window.innerWidth) * 100);
                const up = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
             }}
        >
          <div className="w-0.5 h-10 bg-white/10 rounded-full group-hover:bg-white/40"></div>
        </div>
        <div className="flex-1 bg-white relative">
          <iframe srcDoc={srcDoc} className="w-full h-full border-none" title="preview" sandbox="allow-scripts allow-modals" />
        </div>
      </div>
    </div>
  );
};

export default App;
