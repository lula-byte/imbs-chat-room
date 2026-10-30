import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User, ClassSettings } from '../types/chat';
import { db } from '../data/mockDatabase';
import { sounds } from '../utils/audio';
import { 
  Send, 
  Smile, 
  Trash2, 
  VolumeX, 
  Pin, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  AlertCircle, 
  Lock, 
  Search, 
  LogIn,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

interface ChatViewProps {
  currentUser: User | null;
  settings: ClassSettings;
  onOpenLogin: () => void;
  onOpenTeacherPanel: () => void;
  onRefreshData: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  settings,
  onOpenLogin,
  onOpenTeacherPanel,
  onRefreshData
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiTab, setEmojiTab] = useState<'adab' | 'wajah' | 'belajar'>('adab');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNoticeCollapsed, setIsNoticeCollapsed] = useState(false);
  
  // Moderation Modals State
  const [deleteModalMsg, setDeleteModalMsg] = useState<ChatMessage | null>(null);
  const [deleteReason, setDeleteReason] = useState('Melanggar adab & ketertiban kelas');
  const [muteModalUser, setMuteModalUser] = useState<{ username: string; name: string } | null>(null);
  const [muteDuration, setMuteDuration] = useState<number>(10); // in minutes
  const [muteReason, setMuteReason] = useState('Obrolan tidak sesuai waktu belajar');

  // Mute countdown
  const [muteCountdown, setMuteCountdown] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGuru = currentUser?.role === 'guru';

  const loadMessages = () => {
    const list = db.getMessages();
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
    // 5-second polling interval as specified in prompt: "Chat diperbarui tiap 5 detik"
    const pollInterval = setInterval(() => {
      loadMessages();
    }, 5000);
    return () => clearInterval(pollInterval);
  }, []);

  // Calculate live countdown for muted user
  useEffect(() => {
    if (!currentUser || currentUser.status !== 'muted' || !currentUser.mutedUntil) {
      setMuteCountdown('');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const end = new Date(currentUser.mutedUntil!).getTime();
      const diff = end - now;
      if (diff <= 0) {
        setMuteCountdown('');
        // Refresh user status
        db.unmuteStudent('system', currentUser.username);
        onRefreshData();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setMuteCountdown(`${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentUser, onRefreshData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      onOpenLogin();
      return;
    }

    const res = db.sendMessage(currentUser, inputText);
    if (!res.success) {
      alert(res.error);
      return;
    }

    sounds.playSend();
    setInputText('');
    setShowEmojiPicker(false);
    loadMessages();
    onRefreshData();
    setTimeout(scrollToBottom, 80);
  };

  const handleConfirmDelete = () => {
    if (!deleteModalMsg || !currentUser) return;
    db.deleteMessage(currentUser.username, deleteModalMsg.id, deleteReason);
    sounds.playModerationNotice();
    setDeleteModalMsg(null);
    loadMessages();
    onRefreshData();
  };

  const handleConfirmMute = () => {
    if (!muteModalUser || !currentUser) return;
    db.muteStudent(currentUser.username, muteModalUser.username, muteDuration, muteReason);
    sounds.playModerationNotice();
    setMuteModalUser(null);
    loadMessages();
    onRefreshData();
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    db.reactToMessage(messageId, currentUser.username, emoji);
    loadMessages();
  };

  const filteredMessages = messages.filter(m => {
    if (searchQuery.trim() === '') return true;
    return (
      m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const emojiList = {
    adab: ['🤲', '🕌', '📖', '🌙', '✨', '📿', '🤍', '🌱', '☀️', '⭐'],
    wajah: ['😊', '😃', '😇', '🤔', '👏', '👍', '🙌', '🤝', '👌', '🎉'],
    belajar: ['📚', '✏️', '📐', '🔬', '🎒', '📝', '🎯', '💡', '⏰', '📌']
  };

  const quickGreetings = [
    "Assalamu'alaikum ustadz",
    "Wa'alaikumussalam",
    "Jazakallahu khairan",
    "Afwan ustadz, izin bertanya",
    "Siap laksanakan ustadz"
  ];

  const formatMessageTime = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const isUserMuted = currentUser?.status === 'muted' && currentUser?.mutedUntil && new Date(currentUser.mutedUntil).getTime() > Date.now();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-white sm:border-x border-slate-200 shadow-sm relative">
      
      {/* Chat Room Subheader */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{settings.groupName}</span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {messages.length} pesan
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 hidden sm:inline">Sinkronisasi otomatis (5s)</span>
        </div>

        {/* Search within chat */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-48"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {isGuru && (
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <span>Panel Guru</span>
            </button>
          )}
        </div>
      </div>

      {/* Pinned School Notice / Announcement */}
      {settings.pinnedNotice && (
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2 text-xs transition-all">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Pin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-900">Pengumuman Tersemat</span>
                  <span className="text-[10px] text-amber-700">oleh {settings.pinnedNoticeAuthor}</span>
                </div>
                {!isNoticeCollapsed && (
                  <p className="text-amber-800 mt-0.5 leading-relaxed">
                    {settings.pinnedNotice}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsNoticeCollapsed(!isNoticeCollapsed)}
              className="text-amber-700 hover:text-amber-900 p-1"
              title={isNoticeCollapsed ? 'Tampilkan pengumuman' : 'Ciutkan pengumuman'}
            >
              {isNoticeCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        
        {/* Date separator */}
        <div className="flex items-center justify-center my-3">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-500 shadow-2xs">
            Hari ini · Percakapan Kelas SMP IT Insan Mulia Maos
          </span>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">Belum ada pesan yang cocok.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMsgFromGuru = msg.senderRole === 'guru';
            const isOwnMessage = currentUser?.username === msg.senderUsername;

            if (msg.isDeleted) {
              return (
                <div key={msg.id} className="flex items-center justify-center my-1">
                  <div className="text-[11px] text-slate-400 italic bg-slate-100 px-3 py-1 rounded-md border border-dashed border-slate-300">
                    Pesan telah dihapus oleh guru {isGuru && msg.deleteReason && `(Alasan: ${msg.deleteReason})`}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 group transition-opacity ${
                  isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Sender Avatar Emoji */}
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-2xs shrink-0 select-none ${
                    isMsgFromGuru 
                      ? 'bg-emerald-100 ring-2 ring-emerald-300' 
                      : 'bg-white border border-slate-200'
                  }`}
                  title={`${msg.senderName} (@${msg.senderUsername})`}
                >
                  {msg.avatarEmoji}
                </div>

                {/* Message Bubble Container */}
                <div className={`max-w-[85%] sm:max-w-md md:max-w-lg ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Name & Meta */}
                  <div className={`flex items-center gap-1.5 mb-1 text-[11px] ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-slate-800">
                      {msg.senderName}
                    </span>
                    {isMsgFromGuru && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                        Guru / Ustadz
                      </span>
                    )}
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 tabular-nums">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs relative break-words ${
                      isMsgFromGuru
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                        : isOwnMessage
                        ? 'bg-slate-900 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Reactions & Teacher Moderation Strip */}
                  <div className={`flex items-center gap-2 mt-1 px-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* Render active reactions */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                          if (users.length === 0) return null;
                          const hasReacted = currentUser && users.includes(currentUser.username);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReact(msg.id, emoji)}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-all ${
                                hasReacted
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                              title={users.join(', ')}
                            >
                              <span>{emoji}</span>
                              <span className="text-[10px] tabular-nums">{users.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Reaction button trigger on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => handleReact(msg.id, '👍')}
                        className="text-xs p-1 hover:bg-slate-200/60 rounded"
                        title="Beri jempol"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => handleReact(msg.id, '🤲')}
                        className="text-xs p-1 hover:bg-slate-200/60 rounded"
                        title="Doa / Aamiin"
                      >
                        🤲
                      </button>
                    </div>

                    {/* Teacher Moderation Controls (only visible to Guru on other students' messages) */}
                    {isGuru && msg.senderRole !== 'guru' && (
                      <div className="flex items-center gap-1 ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDeleteModalMsg(msg)}
                          className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded font-medium transition-colors"
                          title="Hapus pesan ini (hanya guru)"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>

                        <button
                          onClick={() => setMuteModalUser({ username: msg.senderUsername, name: msg.senderName })}
                          className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded font-medium transition-colors"
                          title="Mute siswa ini (hanya guru)"
                        >
                          <VolumeX className="w-3 h-3" />
                          <span>Mute</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Quick Salam Tags for Students */}
      {currentUser && !isUserMuted && (
        <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0">Salam santun:</span>
          {quickGreetings.map((greet, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(greet);
              }}
              className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded border border-slate-200 hover:border-emerald-300 whitespace-nowrap text-[11px] transition-colors shrink-0"
            >
              {greet}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 w-72 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 text-xs">
            <div className="flex gap-1">
              <button
                onClick={() => setEmojiTab('adab')}
                className={`px-2 py-1 rounded-md font-semibold ${
                  emojiTab === 'adab' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
                }`}
              >
                🤲 Adab
              </button>
              <button
                onClick={() => setEmojiTab('wajah')}
                className={`px-2 py-1 rounded-md font-semibold ${
                  emojiTab === 'wajah' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
                }`}
              >
                😊 Ekspresi
              </button>
              <button
                onClick={() => setEmojiTab('belajar')}
                className={`px-2 py-1 rounded-md font-semibold ${
                  emojiTab === 'belajar' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600'
                }`}
              >
                📚 Belajar
              </button>
            </div>
            <button 
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 text-xl p-1">
            {emojiList[emojiTab].map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(prev => prev + emoji);
                }}
                className="hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-slate-100 text-center select-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Area based on user state */}
      <div className="p-3 bg-white border-t border-slate-200">
        
        {/* CASE 1: Guest / Unauthenticated */}
        {!currentUser && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Mode Tamu (Hanya Membaca):</strong> Sesuai panduan sekolah, Anda dapat membaca chat. Untuk mengirim pesan, silakan login dengan akun siswa atau guru.
              </span>
            </div>
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Sekarang</span>
            </button>
          </div>
        )}

        {/* CASE 2: Muted Student */}
        {currentUser && isUserMuted && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-3 text-xs text-amber-900">
            <VolumeX className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">Akun Anda sedang di-mute oleh Ustadz/Guru</span>
                <span className="bg-amber-200 text-amber-900 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                  Tersisa: {muteCountdown}
                </span>
              </div>
              <p className="mt-1 text-amber-800">
                Alasan: "{currentUser.muteReason || 'Pembatasan obrolan sementara'}". Anda tetap dapat membaca semua pesan chat kelas, namun belum dapat mengirim pesan baru.
              </p>
            </div>
          </div>
        )}

        {/* CASE 3: Active User & Input form */}
        {currentUser && !isUserMuted && (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            
            {/* Emoji Keyboard Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showEmojiPicker 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Buka pilihan emoji adab & ekspresi"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan santun ke kelas... (Tekan Enter untuk kirim)"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-xs ${
                inputText.trim()
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>

      {/* Modal: Konfirmasi Hapus Pesan (Moderasi Guru) */}
      {deleteModalMsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Hapus Pesan Siswa</h3>
                <p className="text-xs text-slate-500">Pesan akan langsung hilang dari chat dan tercatat di Log Moderasi</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs border border-slate-200">
              <span className="font-bold text-slate-700">{deleteModalMsg.senderName}:</span>
              <p className="text-slate-600 mt-1 italic">"{deleteModalMsg.text}"</p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-slate-700 block">
                Pilih Alasan Penghapusan:
              </label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Kata kurang pantas / tidak sopan">Kata kurang pantas / tidak sopan</option>
                <option value="Di luar topik pelajaran / spam">Di luar topik pelajaran / spam</option>
                <option value="Melanggar adab & ketertiban kelas">Melanggar adab & ketertiban kelas</option>
                <option value="Pesan duplikat atau keliru kirim">Pesan duplikat atau keliru kirim</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalMsg(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
              >
                Ya, Hapus Pesan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Mute Siswa (Moderasi Guru) */}
      {muteModalUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-amber-700">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <VolumeX className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Mute Siswa</h3>
                <p className="text-xs text-slate-500">
                  Target: <strong>{muteModalUser.name}</strong> (@{muteModalUser.username})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Selama di-mute, siswa tetap bisa membaca semua obrolan, namun tidak bisa mengirim pesan hingga batas durasi selesai. Tindakan ini dicatat di sheet <strong>Log_Moderasi</strong>.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Pilih Durasi Mute:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
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
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="text-xs font-semibold text-slate-700 block">
                Alasan Tindakan Mute:
              </label>
              <input
                type="text"
                value={muteReason}
                onChange={(e) => setMuteReason(e.target.value)}
                placeholder="Misal: Berbicara di luar topik pelajaran saat jam belajar"
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMuteModalUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmMute}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
              >
                Terapkan Mute
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
