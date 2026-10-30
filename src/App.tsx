/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from './data/mockDatabase';
import { User, ClassSettings } from './types/chat';
import { Navbar } from './components/Navbar';
import { InitialSetupCard } from './components/InitialSetupCard';
import { ChatView } from './components/ChatView';
import { TeacherPanel } from './components/TeacherPanel';
import { SpreadsheetViewer } from './components/SpreadsheetViewer';
import { GuideView } from './components/GuideView';
import { LoginModal } from './components/LoginModal';
import { ProfileModal } from './components/ProfileModal';
import { PrintCardsModal } from './components/PrintCardsModal';
import { sounds } from './utils/audio';
import { RotateCcw } from 'lucide-react';

export default function App() {
  const [isDbReady, setIsDbReady] = useState<boolean>(() => db.isDatabaseReady());
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'chat' | 'teacher_panel' | 'database' | 'guide'>('chat');
  const [settings, setSettings] = useState<ClassSettings>(() => db.getSettings());
  
  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printStudents, setPrintStudents] = useState<User[]>([]);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Ensure restricted tabs cannot be accessed by non-guru
  useEffect(() => {
    if (currentUser?.role !== 'guru' && (activeTab === 'teacher_panel' || activeTab === 'database')) {
      setActiveTab('chat');
    }
  }, [currentUser, activeTab]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setSettings(db.getSettings());
    const curr = db.getCurrentUser();
    if (curr) {
      // Find latest state of current user in DB (in case of mute / unmute)
      const fresh = db.getUsers().find(u => u.id === curr.id) || curr;
      setCurrentUser(fresh);
    }
  };

  const handleSetupComplete = () => {
    setIsDbReady(true);
    setCurrentUser(db.getCurrentUser());
    handleRefresh();
  };

  const handleSwitchUser = (username: string) => {
    const users = db.getUsers();
    const target = users.find(u => u.username === username);
    if (target) {
      db.login(target.username, target.passwordHash);
      setCurrentUser(target);
      if (target.role !== 'guru' && (activeTab === 'teacher_panel' || activeTab === 'database')) {
        setActiveTab('chat');
      }
      sounds.playSend();
      handleRefresh();
    }
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    if (activeTab === 'teacher_panel' || activeTab === 'database') {
      setActiveTab('chat');
    }
    handleRefresh();
  };

  const handleResetToUninitialized = () => {
    if (confirm('Uji coba kembali Langkah 3? Status akan diatur menjadi "Database belum disiapkan" dengan kartu biru.')) {
      db.setDatabaseReady(false);
      db.logout();
      setIsDbReady(false);
      setCurrentUser(null);
      handleRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        groupName={settings.groupName}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!isDbReady ? (
          /* Langkah 3: Blue Card "Database belum disiapkan" */
          <div className="flex-1 flex flex-col justify-center py-10">
            <InitialSetupCard onSetupComplete={handleSetupComplete} />
          </div>
        ) : (
          /* Normal Application Views */
          <div className="flex-1 flex flex-col">
            {activeTab === 'chat' && (
              <ChatView
                currentUser={currentUser}
                settings={settings}
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenTeacherPanel={() => setActiveTab('teacher_panel')}
                onRefreshData={handleRefresh}
              />
            )}

            {activeTab === 'teacher_panel' && currentUser?.role === 'guru' && (
              <TeacherPanel
                currentUser={currentUser}
                onRefreshData={handleRefresh}
                onOpenPrintCards={(list) => {
                  setPrintStudents(list);
                  setIsPrintOpen(true);
                }}
                settings={settings}
                onUpdateSettings={(newSettings) => setSettings(newSettings)}
              />
            )}

            {activeTab === 'database' && currentUser?.role === 'guru' && (
              <SpreadsheetViewer onRefreshData={handleRefresh} />
            )}

            {activeTab === 'guide' && (
              <GuideView />
            )}
          </div>
        )}
      </main>

      {/* Discreet Simulation Utility Footer */}
      <footer className="border-t border-slate-200 bg-white py-2.5 px-4 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Chat Kelas IMBS</span>
          <span>·</span>
          <span>SMP IT Insan Mulia Maos (Cilacap)</span>
          <span>·</span>
          <span className="text-emerald-700 font-medium">Aktif & Sinkron (Asia/Jakarta)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToUninitialized}
            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
            title="Kembalikan ke status belum disiapkan untuk mencoba alur Langkah 3"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Simulasi Ulang "Database Belum Disiapkan"</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          handleRefresh();
        }}
      />

      {currentUser && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            handleRefresh();
          }}
        />
      )}

      <PrintCardsModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        students={printStudents}
      />

    </div>
  );
}
