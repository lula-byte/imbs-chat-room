import React from 'react';
import { User } from '../types/chat';
import { Printer, X, Download } from 'lucide-react';

interface PrintCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: User[];
}

export const PrintCardsModal: React.FC<PrintCardsModalProps> = ({
  isOpen,
  onClose,
  students
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cetak Kartu Login Siswa ({students.length} Santri)
            </h2>
            <p className="text-xs text-slate-500">
              Format siap cetak dan digunting untuk dibagikan ke masing-masing santri SMP IT Insan Mulia Maos
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 print:p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="border-2 border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 print:bg-white text-xs flex flex-col justify-between page-break-inside-avoid relative"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                        IM
                      </div>
                      <div>
                        <div className="font-bold text-[10px] text-slate-900 leading-none">SMP IT Insan Mulia</div>
                        <div className="text-[9px] text-slate-500">Chat Kelas IMBS</div>
                      </div>
                    </div>
                    <span className="text-base">{student.avatarEmoji}</span>
                  </div>

                  <div className="space-y-1 my-2">
                    <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Username:</span>
                      <span className="font-mono font-bold text-slate-900">{student.username}</span>
                    </div>

                    <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="text-slate-500 text-[10px]">Password:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        {student.plainPassword || student.passwordHash}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-600 px-1">
                      <span>Nama:</span>
                      <span className="font-medium truncate max-w-[140px]">{student.displayName}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-1 mt-1 text-[9px] text-slate-500 text-center italic">
                  *Wajib ganti password setelah login pertama (menu Profil).
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
