import React, { useState } from 'react';
import { User } from '../types/chat';
import { 
  MessageSquare, 
  ShieldCheck, 
  Table, 
  BookOpen, 
  UserCheck, 
  LogOut, 
  Volume2, 
  VolumeX, 
  ChevronDown,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentUser: User | null;
  activeTab: 'chat' | 'teacher_panel' | 'database' | 'guide';
  setActiveTab: (tab: 'chat' | 'teacher_panel' | 'database' | 'guide') => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onSwitchUser: (username: string) => void;
  groupName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  onSwitchUser,
  groupName
}) => {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  const toggleSound = () => {
    const next = sounds.toggleSound();
    setSoundActive(next);
  };

  const isGuru = currentUser?.role === 'guru';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-emerald-100 flex items-center justify-center bg-emerald-700 text-white font-bold">
            <img 
              src="/src/assets/images/imbs_school_logo_1793339497732.jpg" 
              alt="Logo SMP IT Insan Mulia Maos" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image path fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-black tracking-tight uppercase">IMBS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Chat Kelas IMBS
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                SMP IT Insan Mulia Maos
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
              {groupName}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, 4 Clean Links) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat Kelas</span>
          </button>

          {isGuru && (
            <>
              <button
                onClick={() => setActiveTab('teacher_panel')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'teacher_panel'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Panel Guru</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'database'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Table className="w-4 h-4 text-emerald-600" />
                <span>Database Sheets</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Panduan & Kode</span>
          </button>
        </nav>

        {/* Zone 3: Actions & User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Demo Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSwitchMenu(!showSwitchMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Ganti akun untuk mencoba peran Guru atau Siswa"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Peran:</span>
              <span className="font-semibold text-slate-900">
                {currentUser ? (isGuru ? 'Guru' : currentUser.displayName || 'Siswa') : 'Tamu'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showSwitchMenu && (
              <>
                <div 
                  className="fixed inset-0 z-50" 
                  onClick={() => setShowSwitchMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Beralih Akun Uji Coba
                  </div>
                  <button
                    onClick={() => {
                      onSwitchUser('guru');
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser?.username === 'guru' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👨‍🏫</span>
                      <div>
                        <div className="font-semibold">Ustadz Ahmad (Guru)</div>
                        <div className="text-[10px] text-slate-400">username: guru · Akses Penuh</div>
                      </div>
                    </div>
                    {currentUser?.username === 'guru' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser('siswa01');
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser?.username === 'siswa01' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👦</span>
                      <div>
                        <div className="font-semibold">Ahmad Zaki (Siswa 01)</div>
                        <div className="text-[10px] text-slate-400">username: siswa01 · Siswa Aktif</div>
                      </div>
                    </div>
                    {currentUser?.username === 'siswa01' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUser('siswa02');
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      currentUser?.username === 'siswa02' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧕</span>
                      <div>
                        <div className="font-semibold">Fatimah Azzahra (Siswa 02)</div>
                        <div className="text-[10px] text-slate-400">username: siswa02 · Santriwati</div>
                      </div>
                    </div>
                    {currentUser?.username === 'siswa02' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <div className="my-1 border-t border-slate-100"></div>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowSwitchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      !currentUser ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👀</span>
                      <div>
                        <div className="font-semibold">Mode Tamu (Read-Only)</div>
                        <div className="text-[10px] text-slate-400">Hanya membaca pesan</div>
                      </div>
                    </div>
                    {!currentUser && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title={soundActive ? 'Matikan nada pesan' : 'Nyalakan nada pesan'}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* User Status / Login Action */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                title="Buka Profil & Ganti Password"
              >
                <span className="text-xl leading-none">{currentUser.avatarEmoji}</span>
                <span className="hidden sm:inline-block font-semibold text-xs text-slate-800">
                  {currentUser.displayName}
                </span>
                {isGuru && (
                  <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    Guru
                  </span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              Masuk
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Tabs (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50/80 px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'chat' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chat</span>
        </button>

        {isGuru && (
          <>
            <button
              onClick={() => setActiveTab('teacher_panel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${
                activeTab === 'teacher_panel' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Panel Guru</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${
                activeTab === 'database' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sheets</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium ${
            activeTab === 'guide' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Panduan</span>
        </button>
      </div>
    </header>
  );
};
