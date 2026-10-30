import React, { useState } from 'react';
import { db } from '../data/mockDatabase';
import { User } from '../types/chat';
import { sounds } from '../utils/audio';
import { UserCircle, Key, Smile, Check, AlertCircle, X, Shield, Lock } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarEmoji || '👦');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const [profileSaved, setProfileSaved] = useState(false);

  if (!isOpen) return null;

  const isGuru = currentUser.role === 'guru';

  const avatarOptions = [
    '👨‍🏫', '👩‍🏫', '👦', '👧', '🧕', '🧑‍🎓', '📚', '⭐', '🌱', '🌙', '🕌', '✨', '🤲', '💡', '✏️', '🏹', '🍱', '🏆'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateProfile(currentUser.id, displayName, selectedAvatar);
    const updated = { ...currentUser, displayName: displayName.trim(), avatarEmoji: selectedAvatar };
    onUpdateUser(updated);
    sounds.playSend();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (currentUser.passwordHash !== currentPassword.trim()) {
      setPasswordNotice({ text: 'Password saat ini keliru. Periksa kembali.', isError: true });
      return;
    }

    if (newPassword.length < 5) {
      setPasswordNotice({ text: 'Password baru minimal 5 karakter demi keamanan.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ text: 'Konfirmasi password baru tidak cocok.', isError: true });
      return;
    }

    db.changeOwnPassword(currentUser.id, newPassword.trim());
    sounds.playSend();
    setPasswordNotice({ text: 'Password berhasil diperbarui! Jangan bagikan kepada siapa pun.', isError: false });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl border border-emerald-200 shadow-2xs select-none">
            {selectedAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Profil & Keamanan Akun
              </h2>
              {isGuru ? (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                  Akun Guru
                </span>
              ) : (
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Akun Santri
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono">
              @{currentUser.username} · {currentUser.fullName}
            </p>
          </div>
        </div>

        {/* SECTION 1: EDIT PROFILE & AVATAR EMOJI */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pb-6 border-b border-slate-100">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nama Panggilan di Chat:
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Pilih Avatar Emoji (Sesuai Aturan Sekolah):
              </label>
              <span className="text-[10px] text-slate-400">Tidak ada upload foto pribadi</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {avatarOptions.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`text-xl p-2 rounded-lg transition-transform text-center select-none ${
                    selectedAvatar === emoji
                      ? 'bg-emerald-200 ring-2 ring-emerald-600 scale-110 shadow-xs'
                      : 'hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Simpan Nama & Avatar</span>
              {profileSaved && <Check className="w-3.5 h-3.5" />}
            </button>

            {profileSaved && (
              <span className="text-emerald-700 font-semibold text-xs">
                ✓ Profil diperbarui
              </span>
            )}
          </div>
        </form>

        {/* SECTION 2: GANTI PASSWORD (LANGKAH 4 UNTUK GURU & KEAMANAN SANTRI) */}
        <div className="pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-xs">
              Ganti Password {isGuru && '(Wajib untuk Akun Guru)'}
            </h3>
          </div>

          {passwordNotice && (
            <div className={`mb-3 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
              passwordNotice.isError ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {passwordNotice.isError ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /> : <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              <span>{passwordNotice.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">
                Password Saat Ini:
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={isGuru ? 'Masukkan password default "guru123" atau sandi lama' : 'Masukkan password saat ini'}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Password Baru:
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password baru yang kuat"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Ulangi Password Baru:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang password baru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Ganti Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
