import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileCode, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Key,
  Database,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CODE_GS_CONTENT, INDEX_HTML_CONTENT, APPSSCRIPT_JSON_CONTENT } from '../data/appsScriptPackage';

export const GuideView: React.FC = () => {
  const [subTab, setSubTab] = useState<'panduan' | 'code_gs' | 'index_html' | 'manifest'>('panduan');
  const [copiedFile, setCopiedFile] = useState<string>('');

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(label);
    setTimeout(() => setCopiedFile(''), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 border border-emerald-200 shadow-2xs">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Panduan Guru & File Paket Apps Script
                </h1>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                  SMP IT Insan Mulia Maos
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Estimasi waktu deploy sekitar 15 menit sampai siswa bisa login. Tidak perlu keahlian coding.
              </p>
            </div>
          </div>

          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <span>Buka Google Apps Script</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubTab('panduan')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              subTab === 'panduan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Petunjuk Langkah Demi Langkah</span>
          </button>

          <button
            onClick={() => setSubTab('code_gs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              subTab === 'code_gs'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Code.gs (Backend)</span>
          </button>

          <button
            onClick={() => setSubTab('index_html')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              subTab === 'index_html'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Index.html (Frontend)</span>
          </button>

          <button
            onClick={() => setSubTab('manifest')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              subTab === 'manifest'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>appsscript.json</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: PETUNJUK LENGKAP */}
      {subTab === 'panduan' && (
        <div className="space-y-6">
          
          {/* Quick Requirement Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-950">
            <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Yang Dibutuhkan:</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Akun Google (akun guru atau akun sekolah @gmail.com / belajar.id).</li>
              <li>3 File dalam paket ini: <code>Code.gs</code>, <code>Index.html</code>, dan <code>appsscript.json</code> (dapat disalin lewat tab di atas).</li>
            </ul>
          </div>

          {/* Stepper Content */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Langkah 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Buat Project Apps Script
                </h3>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
                <li>Buka <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold">script.google.com</a> lalu klik <strong>New project</strong>.</li>
                <li>Ganti nama project menjadi <strong>Chat Kelas IMBS</strong>.</li>
                <li>Di editor, hapus isi file <code>Code.gs</code> bawaan, lalu tempel seluruh isi <code>Code.gs</code> dari paket ini.</li>
                <li>Klik tombol <strong>+</strong> di samping Files, pilih <strong>HTML</strong>, beri nama <strong>Index</strong>, lalu tempel seluruh isi <code>Index.html</code>.</li>
                <li>Klik ikon roda gigi <strong>Project Settings</strong>, centang <em>Show "appsscript.json" manifest file in editor</em>, lalu tempel isi <code>appsscript.json</code> (pastikan zona waktu <code>Asia/Jakarta</code>).</li>
                <li>Klik tombol <strong>Save</strong> (ikon disket).</li>
              </ol>
            </div>

            {/* Langkah 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Deploy Menjadi Aplikasi Web
                </h3>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
                <li>Klik tombol <strong>Deploy &gt; New deployment</strong>.</li>
                <li>Klik ikon roda gigi di samping "Select type", pilih <strong>Web app</strong>.</li>
                <li>
                  Isi pengaturan:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-700">
                    <li><strong>Description:</strong> Chat Kelas IMBS v1</li>
                    <li><strong>Execute as:</strong> Me (akun guru)</li>
                    <li><strong>Who has access:</strong> <strong>Anyone</strong> (siswa dapat membuka link tanpa harus login Google; login chat tetap memakai username + password dari guru).</li>
                  </ul>
                </li>
                <li>Klik <strong>Deploy</strong>, lalu berikan izin otorisasi saat diminta (Advanced &gt; Go to Chat Kelas IMBS &gt; Allow).</li>
                <li>Salin <strong>URL Web app</strong> — inilah link yang dibagikan ke santri.</li>
              </ol>
            </div>

            {/* Langkah 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Siapkan Database (Sekali Saja)
                </h3>
              </div>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>Buka URL web app dari Langkah 2.</p>
                <p>Akan muncul kartu biru <strong>"Database belum disiapkan"</strong> — klik <strong>Siapkan Database</strong>.</p>
                <p>Aplikasi otomatis membuat spreadsheet <strong>"Database Chat Kelas IMBS"</strong> di Google Drive akun guru berisi 4 sheet: <code>Users</code>, <code>Messages</code>, <code>Sessions</code>, dan <code>Log_Moderasi</code>.</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                  Akun guru otomatis dibuat:<br />
                  Username: <strong className="text-emerald-800">guru</strong><br />
                  Password: <strong className="text-emerald-800">guru123</strong>
                </div>
              </div>
            </div>

            {/* Langkah 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Amankan Akun Guru (Wajib, Segera)
                </h3>
              </div>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>Klik <strong>Login</strong>, masuk sebagai <code>guru</code> / <code>guru123</code>.</p>
                <p>Klik <strong>Profil</strong> di pojok kanan atas, ganti password default ke password baru yang kuat, lalu simpan.</p>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                  ⚠️ <strong>Penting:</strong> Jangan bagikan password guru ke santri. Password guru hanya untuk ustadz/guru pembina.
                </div>
              </div>
            </div>

            {/* Langkah 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  5
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Buat Akun Santri
                </h3>
              </div>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>Klik tombol <strong>Panel Guru</strong> (hanya muncul saat login sebagai guru).</p>
                <p>Pilih <strong>Generate Massal</strong>: Prefix: <code>siswa</code>, Jumlah: <code>30</code>, Mulai: <code>1</code> → menghasilkan <code>siswa01</code> s/d <code>siswa30</code> dengan password acak.</p>
                <p>Klik <strong>Generate Akun</strong>, lalu klik <strong>Salin Semua</strong> atau <strong>Cetak Kartu Siswa</strong> untuk digunting & dibagikan.</p>
              </div>
            </div>

            {/* Langkah 6 & Moderasi */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                  6
                </span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Santri Memakai Chat & Moderasi Guru
                </h3>
              </div>
              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p><strong>Tanpa Login:</strong> Chat hanya bisa dibaca (read-only), tidak bisa kirim.</p>
                <p><strong>Login:</strong> Santri login dengan username + password dari guru. Bisa pilih emoji keyboard 😊 dan ganti avatar emoji di menu Profil.</p>
                <p><strong>Moderasi Guru:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Hapus Pesan:</strong> Tombol 🗑️ Hapus di bawah pesan santri (tercatat di Log_Moderasi).</li>
                  <li><strong>Mute Siswa:</strong> Tombol 🔇 Mute (10 menit / 1 jam / 1 hari / 7 hari). Santri di-mute tetap bisa membaca namun tidak bisa mengirim pesan.</li>
                  <li><strong>Reset Password:</strong> Panel Guru &gt; Reset Sandi bila santri lupa.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Catatan Kejujuran Soal Batasan */}
          <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-700 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Yang Perlu Diketahui (Jujur Soal Batasan):</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 leading-relaxed">
              <li><strong>Password Santri:</strong> Disimpan dalam bentuk hash (acak), bukan teks asli — jadi jika santri lupa password, guru me-reset ke password baru.</li>
              <li><strong>Akses Anyone:</strong> Web app disetel Anyone agar santri tanpa akun Google tetap bisa membuka link web app. Keamanan chat dijaga oleh login username & password di dalam aplikasi.</li>
              <li><strong>Jeda 5 Detik:</strong> Chat diperbarui tiap 5 detik secara otomatis melalui polling Apps Script. Pesan baru muncul dengan jeda beberapa detik.</li>
              <li><strong>Cadangan Database:</strong> Buka Google Drive guru, cari spreadsheet <em>"Database Chat Kelas IMBS"</em>, lalu klik <strong>File &gt; Make a copy</strong> secara berkala.</li>
            </ul>
          </div>

        </div>
      )}

      {/* SUBTAB 2: CODE.GS */}
      {subTab === 'code_gs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-bold">Code.gs</span>
              <span className="text-slate-400">· Backend Google Apps Script</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(CODE_GS_CONTENT, 'Code.gs')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedFile === 'Code.gs' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'Code.gs' ? 'Tersalin!' : 'Salin Code.gs'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('Code.gs', CODE_GS_CONTENT)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                title="Download file Code.gs"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed">
            {CODE_GS_CONTENT}
          </pre>
        </div>
      )}

      {/* SUBTAB 3: INDEX.HTML */}
      {subTab === 'index_html' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="font-mono font-bold">Index.html</span>
              <span className="text-slate-400">· Tampilan Web App untuk Apps Script</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(INDEX_HTML_CONTENT, 'Index.html')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedFile === 'Index.html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'Index.html' ? 'Tersalin!' : 'Salin Index.html'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('Index.html', INDEX_HTML_CONTENT)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                title="Download file Index.html"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed">
            {INDEX_HTML_CONTENT}
          </pre>
        </div>
      )}

      {/* SUBTAB 4: MANIFEST (APPSSCRIPT.JSON) */}
      {subTab === 'manifest' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-bold">appsscript.json</span>
              <span className="text-slate-400">· Konfigurasi Zona Waktu Asia/Jakarta & Hak Akses Web App</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(APPSSCRIPT_JSON_CONTENT, 'appsscript.json')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedFile === 'appsscript.json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === 'appsscript.json' ? 'Tersalin!' : 'Salin appsscript.json'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('appsscript.json', APPSSCRIPT_JSON_CONTENT)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                title="Download appsscript.json"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed">
            {APPSSCRIPT_JSON_CONTENT}
          </pre>
        </div>
      )}

    </div>
  );
};
