import { ChatMessage, ClassSettings, ModerationLog, SessionInfo, User } from '../types/chat';

const STORAGE_KEY_DB_READY = 'imbs_db_ready';
const STORAGE_KEY_USERS = 'imbs_chat_users';
const STORAGE_KEY_MESSAGES = 'imbs_chat_messages';
const STORAGE_KEY_LOGS = 'imbs_chat_logs';
const STORAGE_KEY_SESSIONS = 'imbs_chat_sessions';
const STORAGE_KEY_SETTINGS = 'imbs_chat_settings';
const STORAGE_KEY_CURRENT_USER = 'imbs_chat_current_user';

export const INITIAL_SETTINGS: ClassSettings = {
  groupName: "Grup Chat IMBS — Kelas VII Al-Fatih",
  pinnedNotice: "Pengumuman: Besok pagi pukul 07.15 WIB sholat Dhuha berjamaah di Masjid Al-Ittihad IMBS. Jangan lupa membawa mushaf Al-Qur'an dan buku mutaba'ah harian.",
  pinnedNoticeAuthor: "Ustadz Ahmad Fauzi (Guru)",
  pinnedNoticeDate: new Date(Date.now() - 3600000 * 4).toISOString(),
  profanityFilterEnabled: true,
  isChatLocked: false,
  schoolName: "SMP IT Insan Mulia Maos"
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_guru_01',
    username: 'guru',
    passwordHash: 'guru123', // In real app stored as SHA-256
    fullName: 'Ustadz Ahmad Fauzi, S.Pd.I',
    displayName: 'Ustadz Ahmad (Guru)',
    role: 'guru',
    avatarEmoji: '👨‍🏫',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: 'active'
  },
  {
    id: 'usr_siswa_01',
    username: 'siswa01',
    passwordHash: 'santri123',
    fullName: 'Ahmad Zaki Al-Fatih',
    displayName: 'Zaki',
    role: 'siswa',
    avatarEmoji: '👦',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active'
  },
  {
    id: 'usr_siswa_02',
    username: 'siswa02',
    passwordHash: 'santri123',
    fullName: 'Fatimah Azzahra',
    displayName: 'Fatimah',
    role: 'siswa',
    avatarEmoji: '🧕',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active'
  },
  {
    id: 'usr_siswa_03',
    username: 'siswa03',
    passwordHash: 'santri123',
    fullName: 'Muhammad Rizky Pratama',
    displayName: 'Rizky',
    role: 'siswa',
    avatarEmoji: '🧑‍🎓',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active'
  },
  {
    id: 'usr_siswa_04',
    username: 'siswa04',
    passwordHash: 'santri123',
    fullName: 'Aisyah Humaira',
    displayName: 'Aisyah',
    role: 'siswa',
    avatarEmoji: '🧕',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active'
  },
  {
    id: 'usr_siswa_05',
    username: 'siswa05',
    passwordHash: 'santri123',
    fullName: 'Bilal Habasyi Mahendra',
    displayName: 'Bilal',
    role: 'siswa',
    avatarEmoji: '👦',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'active'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    userId: 'usr_guru_01',
    senderUsername: 'guru',
    senderName: 'Ustadz Ahmad (Guru)',
    senderRole: 'guru',
    avatarEmoji: '👨‍🏫',
    text: "Assalamu'alaikum warahmatullah wabarakatuh. Selamat datang di grup Chat Kelas IMBS (SMP IT Insan Mulia Maos). Silakan manfaatkan grup ini untuk bertanya materi, pengingat tugas, dan diskusi belajar dengan penuh adab & kesantunan.",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    isDeleted: false,
    isPinned: true,
    reactions: { '🤲': ['guru', 'siswa01', 'siswa02'] }
  },
  {
    id: 'msg_02',
    userId: 'usr_siswa_01',
    senderUsername: 'siswa01',
    senderName: 'Zaki',
    senderRole: 'siswa',
    avatarEmoji: '👦',
    text: "Wa'alaikumussalam warahmatullah ustadz. Alhamdulillah fitur chat kelas sudah aktif!",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isDeleted: false,
    reactions: { '👍': ['guru', 'siswa02'] }
  },
  {
    id: 'msg_03',
    userId: 'usr_siswa_02',
    senderUsername: 'siswa02',
    senderName: 'Fatimah',
    senderRole: 'siswa',
    avatarEmoji: '🧕',
    text: "Afwan Ustadz, untuk tugas IPA ringkasan ekosistem sawah Maos dikumpulkan besok pagi atau saat jam pelajaran ke-3 nggih?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDeleted: false,
    reactions: { '💡': ['siswa01'] }
  },
  {
    id: 'msg_04',
    userId: 'usr_guru_01',
    senderUsername: 'guru',
    senderName: 'Ustadz Ahmad (Guru)',
    senderRole: 'guru',
    avatarEmoji: '👨‍🏫',
    text: "Dikumpulkan saat jam ke-3 di meja Ustadz ya Mbak Fatimah. Yang belum selesai bab jaring-jaring makanan, silakan boleh didiskusikan bersama teman kelompoknya.",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    isDeleted: false,
    reactions: { '👍': ['siswa02', 'siswa03'] }
  },
  {
    id: 'msg_05',
    userId: 'usr_siswa_03',
    senderUsername: 'siswa03',
    senderName: 'Rizky',
    senderRole: 'siswa',
    avatarEmoji: '🧑‍🎓',
    text: "Siap Ustadz, kelompok 2 sudah selesai. InsyaAllah besok kami bawa portofolionya.",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isDeleted: false
  }
];

export const INITIAL_LOGS: ModerationLog[] = [
  {
    id: 'log_01',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
    actorUsername: 'guru',
    actorName: 'Ustadz Ahmad Fauzi',
    action: 'setup_database',
    targetUser: 'Database Chat Kelas IMBS',
    details: 'Inisialisasi 4 sheet: Users, Messages, Sessions, Log_Moderasi berhasil dibuat.'
  },
  {
    id: 'log_02',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    actorUsername: 'guru',
    actorName: 'Ustadz Ahmad Fauzi',
    action: 'bulk_generate',
    targetUser: 'siswa01 - siswa30',
    details: 'Generate massal 30 akun siswa perdana dengan password acak.'
  }
];

class DatabaseService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  isDatabaseReady(): boolean {
    const ready = localStorage.getItem(STORAGE_KEY_DB_READY);
    // If not set yet, default to true so the app is instantly rich and ready,
    // but the user can toggle "Belum Disiapkan" to test the initial setup wizard!
    if (ready === null) {
      localStorage.setItem(STORAGE_KEY_DB_READY, 'true');
      return true;
    }
    return ready === 'true';
  }

  setDatabaseReady(ready: boolean): void {
    localStorage.setItem(STORAGE_KEY_DB_READY, ready ? 'true' : 'false');
  }

  setupDatabase(): { success: boolean; spreadsheetName: string; spreadsheetId: string } {
    this.setDatabaseReady(true);
    // Ensure initial users exist
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
      this.setStorage(STORAGE_KEY_USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEY_MESSAGES)) {
      this.setStorage(STORAGE_KEY_MESSAGES, INITIAL_MESSAGES);
    }
    if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
      this.setStorage(STORAGE_KEY_SETTINGS, INITIAL_SETTINGS);
    }

    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: 'guru',
      actorName: 'Guru Pembina',
      action: 'setup_database',
      targetUser: 'Database Chat Kelas IMBS',
      details: 'Pembuatan spreadsheet Google Drive akun guru dengan 4 sheet: Users, Messages, Sessions, Log_Moderasi.'
    };
    const currentLogs = this.getLogs();
    this.setStorage(STORAGE_KEY_LOGS, [log, ...currentLogs]);

    return {
      success: true,
      spreadsheetName: 'Database Chat Kelas IMBS',
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
    };
  }

  getUsers(): User[] {
    return this.getStorage<User[]>(STORAGE_KEY_USERS, INITIAL_USERS);
  }

  saveUsers(users: User[]): void {
    this.setStorage(STORAGE_KEY_USERS, users);
  }

  getMessages(): ChatMessage[] {
    return this.getStorage<ChatMessage[]>(STORAGE_KEY_MESSAGES, INITIAL_MESSAGES);
  }

  saveMessages(msgs: ChatMessage[]): void {
    this.setStorage(STORAGE_KEY_MESSAGES, msgs);
  }

  getLogs(): ModerationLog[] {
    return this.getStorage<ModerationLog[]>(STORAGE_KEY_LOGS, INITIAL_LOGS);
  }

  getSettings(): ClassSettings {
    return this.getStorage<ClassSettings>(STORAGE_KEY_SETTINGS, INITIAL_SETTINGS);
  }

  saveSettings(settings: ClassSettings): void {
    this.setStorage(STORAGE_KEY_SETTINGS, settings);
  }

  getCurrentUser(): User | null {
    return this.getStorage<User | null>(STORAGE_KEY_CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    this.setStorage(STORAGE_KEY_CURRENT_USER, user);
  }

  login(username: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'Username tidak ditemukan. Pastikan huruf sudah sesuai.' };
    }
    if (user.passwordHash !== password.trim()) {
      return { success: false, error: 'Password keliru. Silakan periksa kembali atau minta reset ke guru.' };
    }

    // Update lastLogin
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
    this.saveUsers(updatedUsers);

    // Save session
    const currentSessions = this.getStorage<SessionInfo[]>(STORAGE_KEY_SESSIONS, []);
    const newSession: SessionInfo = {
      sessionId: 'sess_' + Date.now(),
      userId: user.id,
      username: user.username,
      ipAddress: '180.252.' + Math.floor(Math.random() * 200) + '.45',
      device: navigator.userAgent.includes('Mobile') ? 'Smartphone Siswa' : 'Desktop / Laptop Browser',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString()
    };
    this.setStorage(STORAGE_KEY_SESSIONS, [newSession, ...currentSessions.slice(0, 25)]);

    const loggedInUser = { ...user, lastLogin: new Date().toISOString() };
    this.setCurrentUser(loggedInUser);
    return { success: true, user: loggedInUser };
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  sendMessage(user: User, text: string): { success: boolean; message?: ChatMessage; error?: string } {
    // Check if muted
    const freshUser = this.getUsers().find(u => u.id === user.id) || user;
    if (freshUser.status === 'muted' && freshUser.mutedUntil) {
      const muteExpire = new Date(freshUser.mutedUntil).getTime();
      if (muteExpire > Date.now()) {
        const remainingMinutes = Math.ceil((muteExpire - Date.now()) / 60000);
        return {
          success: false,
          error: `Anda sedang di-mute oleh Guru/Ustadz selama ${remainingMinutes} menit lagi.`
        };
      }
    }

    const settings = this.getSettings();
    if (settings.isChatLocked && user.role !== 'guru') {
      return {
        success: false,
        error: 'Mode hening belajar aktif. Hanya Ustadz/Guru yang dapat mengirim pesan saat ini.'
      };
    }

    // Profanity / adab filter
    let processedText = text.trim();
    if (settings.profanityFilterEnabled) {
      const badWords = ['bodoh', 'goblok', 'tolol', 'anjing', 'babi', 'kampret', 'bangsat'];
      badWords.forEach(w => {
        const regex = new RegExp(`\\b${w}\\b`, 'gi');
        processedText = processedText.replace(regex, '***');
      });
    }

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId: user.id,
      senderUsername: user.username,
      senderName: user.displayName || user.fullName,
      senderRole: user.role,
      avatarEmoji: user.avatarEmoji || (user.role === 'guru' ? '👨‍🏫' : '👦'),
      text: processedText,
      timestamp: new Date().toISOString(),
      isDeleted: false
    };

    const messages = this.getMessages();
    this.saveMessages([...messages, newMsg]);
    return { success: true, message: newMsg };
  }

  deleteMessage(guruUsername: string, messageId: string, reason: string): { success: boolean; error?: string } {
    const messages = this.getMessages();
    const targetMsg = messages.find(m => m.id === messageId);
    if (!targetMsg) return { success: false, error: 'Pesan tidak ditemukan' };

    const updated = messages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          deletedBy: guruUsername,
          deleteReason: reason || 'Dihapus oleh guru'
        };
      }
      return m;
    });

    this.saveMessages(updated);

    // Log action
    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: guruUsername,
      actorName: 'Guru',
      action: 'hapus_pesan',
      targetUser: targetMsg.senderUsername,
      details: `Hapus pesan [${targetMsg.senderName}: "${targetMsg.text.substring(0, 30)}..."] — Alasan: ${reason}`
    };
    this.setStorage(STORAGE_KEY_LOGS, [log, ...this.getLogs()]);

    return { success: true };
  }

  muteStudent(
    guruUsername: string,
    targetUsername: string,
    durationMinutes: number,
    reason: string
  ): { success: boolean; error?: string } {
    const users = this.getUsers();
    const student = users.find(u => u.username === targetUsername);
    if (!student) return { success: false, error: 'Siswa tidak ditemukan' };

    const mutedUntil = new Date(Date.now() + durationMinutes * 60000).toISOString();
    const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        return {
          ...u,
          status: 'muted' as const,
          mutedUntil: mutedUntil,
          muteReason: reason || 'Mute oleh guru'
        };
      }
      return u;
    });

    this.saveUsers(updatedUsers);

    // If current logged-in user is target, sync
    const current = this.getCurrentUser();
    if (current && current.username === targetUsername) {
      this.setCurrentUser({ ...current, status: 'muted', mutedUntil, muteReason: reason });
    }

    const durationLabel = durationMinutes < 60 
      ? `${durationMinutes} Menit` 
      : durationMinutes === 1440 
        ? '1 Hari' 
        : durationMinutes === 10080 
          ? '7 Hari' 
          : `${Math.round(durationMinutes / 60)} Jam`;

    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: guruUsername,
      actorName: 'Guru',
      action: 'mute_siswa',
      targetUser: targetUsername,
      details: `Mute selama ${durationLabel} — Alasan: ${reason}`
    };
    this.setStorage(STORAGE_KEY_LOGS, [log, ...this.getLogs()]);

    return { success: true };
  }

  unmuteStudent(guruUsername: string, targetUsername: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const updatedUsers = users.map(u => {
      if (u.username === targetUsername) {
        return {
          ...u,
          status: 'active' as const,
          mutedUntil: null,
          muteReason: ''
        };
      }
      return u;
    });

    this.saveUsers(updatedUsers);

    const current = this.getCurrentUser();
    if (current && current.username === targetUsername) {
      this.setCurrentUser({ ...current, status: 'active', mutedUntil: null, muteReason: '' });
    }

    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: guruUsername,
      actorName: 'Guru',
      action: 'unmute_siswa',
      targetUser: targetUsername,
      details: 'Mute dibatalkan lebih awal oleh guru.'
    };
    this.setStorage(STORAGE_KEY_LOGS, [log, ...this.getLogs()]);

    return { success: true };
  }

  bulkGenerateStudents(
    guruUsername: string,
    prefix: string,
    count: number,
    startNumber: number
  ): { success: boolean; students: User[]; count: number } {
    const users = this.getUsers();
    const adjectives = ['santun', 'rajin', 'mulia', 'cerdas', 'hebat', 'beradab', 'sholeh', 'amanah'];
    const avatars = ['👦', '🧕', '🧑‍🎓', '📚', '⭐', '🌱', '🌙', '🕌'];
    const generated: User[] = [];

    for (let i = 0; i < count; i++) {
      const num = startNumber + i;
      const numStr = num < 10 ? '0' + num : '' + num;
      const username = `${prefix}${numStr}`;

      // Check if username already exists
      if (users.some(u => u.username === username)) {
        continue;
      }

      const adj = adjectives[i % adjectives.length];
      const randomSuffix = Math.floor(Math.random() * 899) + 100;
      const rawPassword = `${adj}${randomSuffix}`;
      const avatar = avatars[i % avatars.length];
      const displayName = `Siswa ${numStr}`;

      const newUser: User = {
        id: `usr_${username}_${Date.now()}`,
        username,
        passwordHash: rawPassword,
        plainPassword: rawPassword,
        fullName: `${displayName} (Kelas VII)`,
        displayName,
        role: 'siswa',
        avatarEmoji: avatar,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      generated.push(newUser);
    }

    const newUsersList = [...users, ...generated];
    this.saveUsers(newUsersList);

    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: guruUsername,
      actorName: 'Guru',
      action: 'bulk_generate',
      targetUser: `${prefix}${startNumber} s/d ${prefix}${startNumber + generated.length - 1}`,
      details: `Generate ${generated.length} akun siswa massal dengan password acak.`
    };
    this.setStorage(STORAGE_KEY_LOGS, [log, ...this.getLogs()]);

    return { success: true, students: generated, count: generated.length };
  }

  resetStudentPassword(guruUsername: string, targetUsername: string, newPass: string): { success: boolean } {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.username === targetUsername) {
        return { ...u, passwordHash: newPass, plainPassword: newPass };
      }
      return u;
    });
    this.saveUsers(updated);

    const log: ModerationLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      actorUsername: guruUsername,
      actorName: 'Guru',
      action: 'reset_password',
      targetUser: targetUsername,
      details: `Password di-reset ke: "${newPass}"`
    };
    this.setStorage(STORAGE_KEY_LOGS, [log, ...this.getLogs()]);

    return { success: true };
  }

  changeOwnPassword(userId: string, newPass: string): { success: boolean } {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, passwordHash: newPass, plainPassword: undefined };
      }
      return u;
    });
    this.saveUsers(updated);
    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      this.setCurrentUser({ ...curr, passwordHash: newPass });
    }
    return { success: true };
  }

  updateProfile(userId: string, displayName: string, avatarEmoji: string): { success: boolean } {
    const users = this.getUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, displayName: displayName.trim(), avatarEmoji };
      }
      return u;
    });
    this.saveUsers(updated);
    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      this.setCurrentUser({ ...curr, displayName: displayName.trim(), avatarEmoji });
    }
    return { success: true };
  }

  reactToMessage(messageId: string, username: string, emoji: string): void {
    const messages = this.getMessages();
    const updated = messages.map(m => {
      if (m.id === messageId) {
        const reactions = { ...(m.reactions || {}) };
        const userList = reactions[emoji] || [];
        if (userList.includes(username)) {
          // Remove reaction
          reactions[emoji] = userList.filter(u => u !== username);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          // Add reaction
          reactions[emoji] = [...userList, username];
        }
        return { ...m, reactions };
      }
      return m;
    });
    this.saveMessages(updated);
  }

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEY_DB_READY);
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

export const db = new DatabaseService();
