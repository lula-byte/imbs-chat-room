import React, { useState } from 'react';
import { db } from '../data/mockDatabase';
import { User } from '../types/chat';
import { sounds } from '../utils/audio';
import { LogIn, Key, UserCheck, AlertCircle, X, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = db.login(username, password);
    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Login gagal. Periksa username dan password.');
      return;
    }

    sounds.playSend();
    onLoginSuccess(res.user);
    onClose();
  };

  const fillQuick = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-2xs">
            <LogIn className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Masuk ke Chat Kelas IMBS
            </h2>
            <p className="text-xs text-slate-500">
              SMP IT Insan Mulia Maos
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Username:
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: guru atau siswa01"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Masuk Sekarang</span>
          </button>
        </form>

        {/* Quick Demo Accounts for Testing */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Uji Coba Cepat (Klik untuk Mengisi):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuick('guru', 'guru123')}
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-left transition-colors"
            >
              <div className="font-bold text-emerald-900">👨‍🏫 Akun Guru Default</div>
              <div className="text-[10px] text-emerald-700 font-mono">guru / guru123</div>
            </button>

            <button
              type="button"
              onClick={() => fillQuick('siswa01', 'santri123')}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-left transition-colors"
            >
              <div className="font-bold text-slate-800">👦 Siswa (Zaki)</div>
              <div className="text-[10px] text-slate-500 font-mono">siswa01 / santri123</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
