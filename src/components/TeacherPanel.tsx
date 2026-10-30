import React, { useState } from 'react';
import { User, ModerationLog, ClassSettings } from '../types/chat';
import { db } from '../data/mockDatabase';
import { sounds } from '../utils/audio';
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  Settings, 
  Copy, 
  Printer, 
  Key, 
  VolumeX, 
  Volume2, 
  Search, 
  Check, 
  Sparkles, 
  Clock, 
  Trash2, 
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';

interface TeacherPanelProps {
  currentUser: User | null;
  onRefreshData: () => void;
  onOpenPrintCards: (students: User[]) => void;
  settings: ClassSettings;
  onUpdateSettings: (settings: ClassSettings) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  currentUser,
  onRefreshData,
  onOpenPrintCards,
  settings,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'students' | 'logs' | 'settings'>('generate');

  // Bulk Generator Form
  const [prefix, setPrefix] = useState('siswa');
  const [count, setCount] = useState(30);
  const [startNum, setStartNum] = useState(1);
  const [generatedList, setGeneratedList] = useState<User[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // Single Account Form
  const [singleUsername, setSingleUsername] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singlePassword, setSinglePassword] = useState('');
  const [singleSuccess, setSingleSuccess] = useState(false);

  // Student List Filter
  const [studentSearch, setStudentSearch] = useState('');

  // Moderation Action State
  const [muteTargetUser, setMuteTargetUser] = useState<User | null>(null);
  const [muteDuration, setMuteDuration] = useState<number>(10);
  const [muteReason, setMuteReason] = useState('Membatasi obrolan saat jam pelajaran');

  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Settings State
  const [groupNameInput, setGroupNameInput] = useState(settings.groupName);
  const [pinnedNoticeInput, setPinnedNoticeInput] = useState(settings.pinnedNotice);
  const [profanityFilter, setProfanityFilter] = useState(settings.profanityFilterEnabled);
  const [chatLocked, setChatLocked] = useState(settings.isChatLocked);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const users = db.getUsers();
  const students = users.filter(u => u.role === 'siswa');
  const logs = db.getLogs();

  const handleBulkGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const actor = currentUser?.username || 'guru';
    const res = db.bulkGenerateStudents(actor, prefix.trim().toLowerCase(), count, startNum);
    if (res.success) {
      setGeneratedList(res.students);
      sounds.playSend();
      onRefreshData();
    }
  };

  const handleCreateSingleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUsername || !singlePassword) return;

    const actor = currentUser?.username || 'guru';
    const newStudent: User = {
      id: `usr_${singleUsername}_${Date.now()}`,
      username: singleUsername.trim().toLowerCase(),
      passwordHash: singlePassword.trim(),
      plainPassword: singlePassword.trim(),
      fullName: singleName.trim() || `Siswa ${singleUsername}`,
      displayName: singleName.trim() || singleUsername,
      role: 'siswa',
      avatarEmoji: '🧑‍🎓',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    db.saveUsers([...users, newStudent]);
    sounds.playSend();
    setSingleSuccess(true);
    setTimeout(() => setSingleSuccess(false), 2500);
    setSingleUsername('');
    setSingleName('');
    setSinglePassword('');
    onRefreshData();
  };

  const handleCopyAllGenerated = () => {
    if (generatedList.length === 0) return;
    const header = `Daftar Akun Siswa Chat Kelas IMBS (SMP IT Insan Mulia Maos)\nTotal: ${generatedList.length} Akun\n=========================================\n`;
    const body = generatedList.map((s, idx) => 
      `${idx + 1}. Username: ${s.username} | Password: ${s.plainPassword || s.passwordHash} | Nama: ${s.displayName}`
    ).join('\n');
    const footer = `\n=========================================\nCatatan: Harap segera login dan ubah password di menu Profil.`;

    navigator.clipboard.writeText(header + body + footer);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleConfirmMute = () => {
    if (!muteTargetUser) return;
    const actor = currentUser?.username || 'guru';
    db.muteStudent(actor, muteTargetUser.username, muteDuration, muteReason);
    sounds.playModerationNotice();
    setMuteTargetUser(null);
    onRefreshData();
  };

  const handleUnmute = (targetUsername: string) => {
    const actor = currentUser?.username || 'guru';
    db.unmuteStudent(actor, targetUsername);
    sounds.playSend();
    onRefreshData();
  };

  const handleConfirmResetPassword = () => {
    if (!resetTargetUser || !newPasswordInput.trim()) return;
    const actor = currentUser?.username || 'guru';
    db.resetStudentPassword(actor, resetTargetUser.username, newPasswordInput.trim());
    sounds.playSend();
    setResetSuccessMsg(`Password @${resetTargetUser.username} berhasil di-reset menjadi "${newPasswordInput.trim()}"`);
    setNewPasswordInput('');
    setTimeout(() => {
      setResetSuccessMsg('');
      setResetTargetUser(null);
    }, 2000);
    onRefreshData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClassSettings = {
      ...settings,
      groupName: groupNameInput.trim(),
      pinnedNotice: pinnedNoticeInput.trim(),
      pinnedNoticeAuthor: currentUser?.displayName || 'Guru Pembina',
      pinnedNoticeDate: new Date().toISOString(),
      profanityFilterEnabled: profanityFilter,
      isChatLocked: chatLocked
    };
    db.saveSettings(updated);
    onUpdateSettings(updated);
    setSettingsSaved(true);
    sounds.playSend();
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const filteredStudents = students.filter(s => 
    s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.displayName.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Panel Guru Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 border border-emerald-200 shadow-2xs">
              <ShieldAlert className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Panel Guru & Moderasi</h1>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                  Akses Pembina
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                SMP IT Insan Mulia Maos · Manajemen akun santri massal, moderasi ketertiban chat, dan audit log
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Total Santri</div>
              <div className="text-base font-bold text-slate-900 tabular-nums">{students.length}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Santri Di-Mute</div>
              <div className="text-base font-bold text-amber-600 tabular-nums">
                {students.filter(s => s.status === 'muted').length}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center">
              <div className="text-[10px] text-slate-500 font-medium">Aksi Moderasi</div>
              <div className="text-base font-bold text-slate-900 tabular-nums">{logs.length}</div>
            </div>
          </div>
        </div>

        {/* Panel Tabs (Single-line, clear active states) */}
        <div className="flex items-center gap-1 border-t border-slate-100 mt-6 pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'generate'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Generate Massal Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'students'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Siswa & Moderasi ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'logs'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Log Moderasi ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Kelas & Adab</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GENERATE MASSAL SISWA (LANGKAH 5) */}
      {activeTab === 'generate' && (
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Form Generator Massal */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Langkah 5 Panduan Guru
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Generate Massal Akun Siswa
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Paling cepat untuk satu kelas. Membuat username berurutan dengan password acak yang mudah diucapkan santri.
              </p>
            </div>

            <form onSubmit={handleBulkGenerate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Prefix Username:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    required
                    placeholder="siswa"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <span className="text-slate-400 font-mono text-[11px]">→ contoh: {prefix}01</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jumlah Akun:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mulai dari No:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={startNum}
                    onChange={(e) => setStartNum(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-[11px] leading-relaxed">
                💡 <strong>Hasil perkiraan:</strong> Akun <code>{prefix}{startNum < 10 ? '0' + startNum : startNum}</code> s/d <code>{prefix}{startNum + count - 1 < 10 ? '0' + (startNum + count - 1) : startNum + count - 1}</code> akan dibuat dan langsung tersimpan di sheet <strong>Users</strong>.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate {count} Akun Sekarang</span>
              </button>
            </form>

            {/* Alternatif Buat Satu Per Satu */}
            <div className="border-t border-slate-200 pt-5 mt-5">
              <h3 className="font-bold text-slate-800 text-xs mb-2">
                Atau Tambah Satu Akun Baru
              </h3>
              <form onSubmit={handleCreateSingleAccount} className="space-y-3 text-xs">
                <input
                  type="text"
                  placeholder="Username (mis. siswa_hafizh)"
                  value={singleUsername}
                  onChange={(e) => setSingleUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs"
                />
                <input
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  placeholder="Password Awal"
                  value={singlePassword}
                  onChange={(e) => setSinglePassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs"
                />
                <button
                  type="submit"
                  disabled={!singleUsername || !singlePassword}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Tambah Akun Tunggal
                </button>
                {singleSuccess && (
                  <p className="text-[11px] text-emerald-700 font-semibold text-center">
                    ✓ Akun siswa baru berhasil ditambahkan!
                  </p>
                )}
              </form>
            </div>

          </div>

          {/* Tabel Hasil Generate & Aksi Bagikan */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {generatedList.length > 0 
                    ? `Hasil Generate (${generatedList.length} Akun)` 
                    : `Daftar Akun Santri Tersedia (${students.length} Akun)`
                  }
                </h3>
                <p className="text-xs text-slate-500">
                  {generatedList.length > 0 
                    ? 'Bagikan ke masing-masing santri untuk login pertama kali'
                    : 'Pilih aksi salin format teks atau cetak kartu fisik'
                  }
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyAllGenerated}
                  disabled={generatedList.length === 0 && students.length === 0}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Salin semua akun dalam format teks rapi"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Tersalin!' : 'Salin Semua'}</span>
                </button>

                <button
                  onClick={() => onOpenPrintCards(generatedList.length > 0 ? generatedList : students)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Cetak kartu login santri siap digunting"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Kartu Siswa</span>
                </button>
              </div>
            </div>

            {/* Account List Display */}
            <div className="flex-1 overflow-y-auto max-h-[460px] border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Password Awal</th>
                    <th className="py-2.5 px-3">Nama Santri</th>
                    <th className="py-2.5 px-3">Avatar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(generatedList.length > 0 ? generatedList : students).map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-slate-400 tabular-nums">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{student.username}</td>
                      <td className="py-2 px-3 font-mono text-emerald-800 font-semibold bg-emerald-50/50">
                        {student.plainPassword || student.passwordHash}
                      </td>
                      <td className="py-2 px-3 text-slate-700">{student.displayName}</td>
                      <td className="py-2 px-3 text-base">{student.avatarEmoji}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Minta santri mengganti password setelah login pertama melalui menu <strong>Profil &gt; Ganti Password</strong>.</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DAFTAR SISWA & MODERASI */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Manajemen Santri & Moderasi</h2>
              <p className="text-xs text-slate-500">
                Mute siswa bermasalah, batalkan mute lebih awal, atau reset password siswa yang lupa
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari santri..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Santri</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Keterangan / Sisa Mute</th>
                  <th className="py-3 px-4 text-right">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Tidak ditemukan data santri.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isMuted = s.status === 'muted' && s.mutedUntil && new Date(s.mutedUntil).getTime() > Date.now();
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{s.avatarEmoji}</span>
                            <div>
                              <div className="font-semibold text-slate-900">{s.displayName}</div>
                              <div className="text-[10px] text-slate-400">{s.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          @{s.username}
                        </td>
                        <td className="py-3 px-4">
                          {isMuted ? (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                              <VolumeX className="w-3 h-3 text-amber-600" />
                              Di-mute
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {isMuted ? (
                            <div>
                              <div className="font-medium text-amber-900">
                                s/d {new Date(s.mutedUntil!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </div>
                              <div className="text-[10px] text-slate-400">Alasan: {s.muteReason || 'Melanggar adab'}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">- Normal -</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isMuted ? (
                              <button
                                onClick={() => handleUnmute(s.username)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                                title="Buka blokir mute lebih awal"
                              >
                                <Volume2 className="w-3 h-3 text-emerald-600" />
                                <span>Batalkan Mute</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setMuteTargetUser(s)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                                title="Mute obrolan santri"
                              >
                                <VolumeX className="w-3 h-3 text-amber-600" />
                                <span>Mute</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setResetTargetUser(s);
                                setNewPasswordInput('santri' + Math.floor(Math.random() * 899 + 100));
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                              title="Reset password baru bila santri lupa password"
                            >
                              <Key className="w-3 h-3 text-slate-500" />
                              <span>Reset Sandi</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOG MODERASI */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Catatan Sheet Log_Moderasi</h2>
              <p className="text-xs text-slate-500">
                Semua tindakan guru (hapus pesan, mute, reset password, generate akun) tersimpan otomatis untuk audit kepengasuhan santri
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              {logs.length} catatan terekam
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Waktu (WIB)</th>
                  <th className="py-3 px-4">Guru / Aktor</th>
                  <th className="py-3 px-4">Tindakan</th>
                  <th className="py-3 px-4">Target Siswa</th>
                  <th className="py-3 px-4">Keterangan / Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900 font-sans">
                        @{log.actorUsername}
                      </td>
                      <td className="py-2.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'hapus_pesan' 
                            ? 'bg-rose-100 text-rose-800' 
                            : log.action === 'mute_siswa' 
                            ? 'bg-amber-100 text-amber-800' 
                            : log.action === 'unmute_siswa'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 font-sans font-medium">
                        {log.targetUser || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 font-sans">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PENGATURAN KELAS & ADAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pengaturan Ruang Chat Kelas IMBS</h2>
            <p className="text-xs text-slate-500">
              Konfigurasi nama grup, pengumuman tersemat, mode hening belajar, dan filter adab santri
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Grup Chat (Variabel GROUP_NAME di Code.gs):
              </label>
              <input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pengumuman Papan Atas (Pinned Notice):
              </label>
              <textarea
                rows={3}
                value={pinnedNoticeInput}
                onChange={(e) => setPinnedNoticeInput(e.target.value)}
                placeholder="Tuliskan pengumuman penting untuk santri..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profanityFilter}
                  onChange={(e) => setProfanityFilter(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <div>
                  <div className="font-bold text-slate-800">Filter Kata Kasar & Santun Otomatis</div>
                  <div className="text-[11px] text-slate-400">
                    Otomatis menyamarkan kata yang tidak pantas dengan tanda bintang (***) sesuai adab santri IMBS.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chatLocked}
                  onChange={(e) => setChatLocked(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <div className="font-bold text-slate-800">Kunci Ruang Chat (Mode Hening)</div>
                  <div className="text-[11px] text-slate-400">
                    Hanya guru yang dapat mengirim pesan. Sangat berguna saat jam sholat berjamaah, apel pagi, atau ujian.
                  </div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Simpan Pengaturan</span>
                {settingsSaved && <Check className="w-4 h-4 text-white" />}
              </button>

              {settingsSaved && (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  ✓ Pengaturan berhasil diperbarui
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Modal: Mute Siswa dari Panel */}
      {muteTargetUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <VolumeX className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Mute Siswa</h3>
                <p className="text-xs text-slate-500">{muteTargetUser.displayName} (@{muteTargetUser.username})</p>
              </div>
            </div>

            <div className="space-y-4 text-xs mb-6">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Durasi Mute:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '10 Menit', val: 10 },
                    { label: '1 Jam', val: 60 },
                    { label: '1 Hari', val: 1440 },
                    { label: '7 Hari', val: 10080 }
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setMuteDuration(item.val)}
                      className={`py-2 px-3 rounded-lg font-semibold border transition-all text-center ${
                        muteDuration === item.val
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alasan Mute:</label>
                <input
                  type="text"
                  value={muteReason}
                  onChange={(e) => setMuteReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMuteTargetUser(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmMute}
                className="px-4 py-2 font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg"
              >
                Terapkan Mute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset Password Siswa */}
      {resetTargetUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Reset Sandi Siswa</h3>
                <p className="text-xs text-slate-500">
                  Target: <strong>{resetTargetUser.displayName}</strong> (@{resetTargetUser.username})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Sesuai panduan: password siswa di database tersimpan secara hash sehingga guru tidak bisa melihat sandi lama, melainkan me-reset ke password baru untuk dibagikan ke siswa.
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Password Baru:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPasswordInput('santri' + Math.floor(Math.random() * 899 + 100))}
                    className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                    title="Buat password acak baru"
                  >
                    Acak
                  </button>
                </div>
              </div>
            </div>

            {resetSuccessMsg ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold mb-4 text-center">
                ✓ {resetSuccessMsg}
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPassword}
                  disabled={!newPasswordInput.trim()}
                  className="px-4 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 rounded-lg shadow-xs"
                >
                  Simpan & Terapkan Sandi Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
