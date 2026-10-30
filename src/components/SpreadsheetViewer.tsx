import React, { useState } from 'react';
import { db } from '../data/mockDatabase';
import { 
  Table, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  Search, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface SpreadsheetViewerProps {
  onRefreshData: () => void;
}

export const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({ onRefreshData }) => {
  const [activeSheet, setActiveSheet] = useState<'Users' | 'Messages' | 'Sessions' | 'Log_Moderasi'>('Users');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNotification, setCopiedNotification] = useState('');

  const users = db.getUsers();
  const messages = db.getMessages();
  const logs = db.getLogs();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeSheet === 'Users') {
      csvContent += "id,username,password_hash,full_name,display_name,role,avatar_emoji,created_at,muted_until,mute_reason\n";
      users.forEach(u => {
        csvContent += `"${u.id}","${u.username}","${u.passwordHash}","${u.fullName}","${u.displayName}","${u.role}","${u.avatarEmoji}","${u.createdAt}","${u.mutedUntil || ''}","${u.muteReason || ''}"\n`;
      });
    } else if (activeSheet === 'Messages') {
      csvContent += "id,user_id,sender_username,sender_name,sender_role,avatar_emoji,text,timestamp,is_deleted,delete_reason\n";
      messages.forEach(m => {
        csvContent += `"${m.id}","${m.userId}","${m.senderUsername}","${m.senderName}","${m.senderRole}","${m.avatarEmoji}","${m.text.replace(/"/g, '""')}","${m.timestamp}","${m.isDeleted}","${m.deleteReason || ''}"\n`;
      });
    } else if (activeSheet === 'Log_Moderasi') {
      csvContent += "id,timestamp,guru_username,tindakan,target_siswa,keterangan\n";
      logs.forEach(l => {
        csvContent += `"${l.id}","${l.timestamp}","${l.actorUsername}","${l.action}","${l.targetUser || ''}","${l.details.replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Database_Chat_Kelas_IMBS_${activeSheet}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(`Sheet ${activeSheet} berhasil diunduh sebagai file CSV.`);
    setTimeout(() => setCopiedNotification(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Google Spreadsheet Header Banner */}
      <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  Database Chat Kelas IMBS
                </h1>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Google Sheets Tersambung
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Penyimpanan: Akun Google Guru · Tersimpan otomatis setiap ada pesan atau aksi moderasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Cari di ${activeSheet}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
              />
            </div>

            <button
              onClick={() => {
                onRefreshData();
                setCopiedNotification('Data spreadsheet diperbarui.');
                setTimeout(() => setCopiedNotification(''), 2000);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Segarkan data spreadsheet"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Unduh sheet yang aktif dalam format CSV untuk cadangan"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cadangkan / Download CSV</span>
            </button>
          </div>

        </div>

        {copiedNotification && (
          <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{copiedNotification}</span>
          </div>
        )}
      </div>

      {/* Spreadsheet Table Grid */}
      <div className="bg-white border-x border-slate-200 overflow-x-auto min-h-[480px]">
        
        {/* SHEET 1: USERS */}
        {activeSheet === 'Users' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[11px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-3 border-r border-slate-200">id</th>
                <th className="py-2.5 px-3 border-r border-slate-200">username</th>
                <th className="py-2.5 px-3 border-r border-slate-200">password_hash</th>
                <th className="py-2.5 px-3 border-r border-slate-200">full_name</th>
                <th className="py-2.5 px-3 border-r border-slate-200">display_name</th>
                <th className="py-2.5 px-3 border-r border-slate-200">role</th>
                <th className="py-2.5 px-3 border-r border-slate-200">avatar_emoji</th>
                <th className="py-2.5 px-3 border-r border-slate-200">muted_until</th>
                <th className="py-2.5 px-3">mute_reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {users
                .filter(u => !searchTerm || u.username.includes(searchTerm) || u.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((u, idx) => (
                  <tr key={u.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-500">{u.id}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{u.username}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-400 truncate max-w-[120px]">
                      {u.passwordHash}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans text-slate-800">{u.fullName}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans font-semibold text-slate-800">{u.displayName}</td>
                    <td className="py-2 px-3 border-r border-slate-200">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'guru' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-base">{u.avatarEmoji}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-amber-700">
                      {u.mutedUntil ? new Date(u.mutedUntil).toLocaleTimeString('id-ID') : '-'}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-500">{u.muteReason || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* SHEET 2: MESSAGES */}
        {activeSheet === 'Messages' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[11px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-3 border-r border-slate-200">id</th>
                <th className="py-2.5 px-3 border-r border-slate-200">sender_username</th>
                <th className="py-2.5 px-3 border-r border-slate-200">sender_name</th>
                <th className="py-2.5 px-3 border-r border-slate-200">role</th>
                <th className="py-2.5 px-3 border-r border-slate-200">avatar</th>
                <th className="py-2.5 px-3 border-r border-slate-200 min-w-[280px]">text</th>
                <th className="py-2.5 px-3 border-r border-slate-200">timestamp</th>
                <th className="py-2.5 px-3 border-r border-slate-200">is_deleted</th>
                <th className="py-2.5 px-3">delete_reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {messages
                .filter(m => !searchTerm || m.text.toLowerCase().includes(searchTerm.toLowerCase()) || m.senderName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((m, idx) => (
                  <tr key={m.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-500">{m.id}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-800">{m.senderUsername}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans">{m.senderName}</td>
                    <td className="py-2 px-3 border-r border-slate-200">{m.senderRole}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center text-base">{m.avatarEmoji}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-sans text-slate-900">
                      {m.text}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-500 whitespace-nowrap">
                      {new Date(m.timestamp).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center">
                      {m.isDeleted ? <span className="text-rose-600 font-bold">TRUE</span> : <span className="text-slate-400">FALSE</span>}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-500">{m.deleteReason || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* SHEET 3: SESSIONS */}
        {activeSheet === 'Sessions' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[11px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-3 border-r border-slate-200">session_id</th>
                <th className="py-2.5 px-3 border-r border-slate-200">username</th>
                <th className="py-2.5 px-3 border-r border-slate-200">device / browser</th>
                <th className="py-2.5 px-3 border-r border-slate-200">ip_demo</th>
                <th className="py-2.5 px-3 border-r border-slate-200">created_at</th>
                <th className="py-2.5 px-3">expires_at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              <tr className="hover:bg-emerald-50/40">
                <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400">1</td>
                <td className="py-2 px-3 border-r border-slate-200 text-slate-500">sess_live_active</td>
                <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">guru</td>
                <td className="py-2 px-3 border-r border-slate-200 font-sans text-slate-700">Desktop Guru Pembina</td>
                <td className="py-2 px-3 border-r border-slate-200 text-slate-500">180.252.34.12</td>
                <td className="py-2 px-3 border-r border-slate-200 text-slate-500">{new Date().toLocaleTimeString('id-ID')}</td>
                <td className="py-2 px-3 text-slate-500">30 Hari kedepan</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* SHEET 4: LOG_MODERASI */}
        {activeSheet === 'Log_Moderasi' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono text-[11px] uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                <th className="py-2.5 px-3 border-r border-slate-200">id</th>
                <th className="py-2.5 px-3 border-r border-slate-200">timestamp</th>
                <th className="py-2.5 px-3 border-r border-slate-200">guru_username</th>
                <th className="py-2.5 px-3 border-r border-slate-200">tindakan</th>
                <th className="py-2.5 px-3 border-r border-slate-200">target_siswa</th>
                <th className="py-2.5 px-3">keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {logs.map((log, idx) => (
                <tr key={log.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-2 px-3 border-r border-slate-200 text-center text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-500">{log.id}</td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{log.actorUsername}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-bold text-emerald-800">{log.action}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-sans text-slate-800">{log.targetUser || '-'}</td>
                  <td className="py-2 px-3 font-sans text-slate-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* Sheet Tabs Bar (Bottom of Spreadsheet) */}
      <div className="bg-slate-100 rounded-b-2xl border border-slate-200 border-t-0 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center gap-1">
          {(['Users', 'Messages', 'Sessions', 'Log_Moderasi'] as const).map((sheet) => (
            <button
              key={sheet}
              onClick={() => setActiveSheet(sheet)}
              className={`px-3.5 py-1.5 font-semibold rounded-t-md transition-colors flex items-center gap-1.5 ${
                activeSheet === sheet
                  ? 'bg-white text-emerald-800 shadow-2xs border-t-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>{sheet}</span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                ({sheet === 'Users' ? users.length : sheet === 'Messages' ? messages.length : sheet === 'Log_Moderasi' ? logs.length : 1})
              </span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 hidden md:flex items-center gap-2">
          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
          <span>Cadangan mingguan: Google Drive &gt; File &gt; Make a copy</span>
        </div>
      </div>

    </div>
  );
};
