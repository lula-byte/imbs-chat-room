import React, { useState } from 'react';
import { Database, CheckCircle, ArrowRight, Sparkles, FolderPlus, Shield } from 'lucide-react';
import { db } from '../data/mockDatabase';

interface InitialSetupCardProps {
  onSetupComplete: () => void;
}

export const InitialSetupCard: React.FC<InitialSetupCardProps> = ({ onSetupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Memeriksa Google Drive akun guru...',
    'Membuat spreadsheet "Database Chat Kelas IMBS"...',
    'Menyiapkan 4 sheet: Users, Messages, Sessions, Log_Moderasi...',
    'Mendaftarkan akun default guru (guru / guru123)...',
    'Selesai! Database siap digunakan.'
  ];

  const handleStartSetup = () => {
    setLoading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setStepIndex(current);
      if (current >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          db.setupDatabase();
          // Auto login as default guru
          db.login('guru', 'guru123');
          onSetupComplete();
        }, 600);
      }
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-400/30 relative overflow-hidden">
        
        {/* Subtle decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-200">
                Langkah 3 — Persiapan Perdana
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Database belum disiapkan
              </h2>
            </div>
          </div>

          <p className="text-sm text-blue-100 leading-relaxed mb-6">
            Aplikasi Chat Kelas IMBS memerlukan basis data spreadsheet untuk menyimpan pesan, daftar akun santri, sesi login, dan log moderasi guru. Klik tombol di bawah untuk membuat database secara otomatis di Google Drive akun guru.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6 space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-200" />
              <span>Yang akan disiapkan secara otomatis:</span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-100 pl-6 list-disc">
              <li>Spreadsheet "Database Chat Kelas IMBS"</li>
              <li>Sheet Users (Data akun santri & guru)</li>
              <li>Sheet Messages (Riwayat obrolan kelas)</li>
              <li>Sheet Sessions (Status koneksi & login)</li>
              <li>Sheet Log_Moderasi (Catatan tindakan guru)</li>
              <li>Akun Guru Default: <strong>guru</strong> / <strong>guru123</strong></li>
            </ul>
          </div>

          {loading ? (
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  {steps[stepIndex]}
                </span>
                <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={handleStartSetup}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-blue-800 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Siapkan Database Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="text-xs text-blue-200 text-center sm:text-right flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-300 shrink-0" />
                <span>Proses hanya butuh sekitar 10 detik</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
