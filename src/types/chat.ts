export type UserRole = 'guru' | 'siswa' | 'guest';

export interface User {
  id: string;
  username: string;
  passwordHash: string; // Plain/hash for demo representation
  plainPassword?: string; // For initial display when bulk generated
  fullName: string;
  displayName: string;
  role: UserRole;
  avatarEmoji: string;
  createdAt: string;
  status: 'active' | 'muted' | 'suspended';
  mutedUntil?: string | null; // ISO string
  muteReason?: string;
  lastLogin?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  senderUsername: string;
  senderName: string;
  senderRole: UserRole;
  avatarEmoji: string;
  text: string;
  timestamp: string; // ISO string
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
  isPinned?: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of usernames
}

export interface ModerationLog {
  id: string;
  timestamp: string;
  actorUsername: string;
  actorName: string;
  action: 'hapus_pesan' | 'mute_siswa' | 'unmute_siswa' | 'reset_password' | 'setup_database' | 'bulk_generate';
  targetUser?: string;
  details: string;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  username: string;
  ipAddress: string;
  device: string;
  createdAt: string;
  expiresAt: string;
}

export interface ClassSettings {
  groupName: string;
  pinnedNotice: string;
  pinnedNoticeAuthor: string;
  pinnedNoticeDate: string;
  profanityFilterEnabled: boolean;
  isChatLocked: boolean; // Only teacher can send messages if true
  schoolName: string;
}
