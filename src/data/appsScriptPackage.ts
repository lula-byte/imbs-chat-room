/**
 * Paket file Google Apps Script untuk Chat Kelas IMBS
 * Sesuai panduan guru SMP IT Insan Mulia Maos
 */

export const CODE_GS_CONTENT = `/**
 * ====================================================================
 * CHAT KELAS IMBS — SMP IT Insan Mulia Maos
 * Backend Google Apps Script (Code.gs)
 * ====================================================================
 * Pengaturan:
 * - Spreadsheet otomatis dibuat saat klik "Siapkan Database"
 * - Zona Waktu: Asia/Jakarta
 */

const GROUP_NAME = "Grup Chat IMBS — SMP IT Insan Mulia Maos";
const SPREADSHEET_PROP_KEY = "IMBS_CHAT_SPREADSHEET_ID";

/**
 * Handle HTTP GET - Melayani antarmuka web app
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile("Index");
  template.groupName = GROUP_NAME;
  return template.evaluate()
    .setTitle(GROUP_NAME)
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Memeriksa status setup database
 */
function checkDatabaseStatus() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty(SPREADSHEET_PROP_KEY);
  if (!ssId) {
    return { isReady: false };
  }
  try {
    var ss = SpreadsheetApp.openById(ssId);
    return { 
      isReady: true, 
      spreadsheetUrl: ss.getUrl(),
      spreadsheetName: ss.getName()
    };
  } catch (err) {
    return { isReady: false, error: err.message };
  }
}

/**
 * Langkah 3: Siapkan Database Otomatis (Membuat Spreadsheet + 4 Sheet)
 */
function setupDatabase() {
  var props = PropertiesService.getScriptProperties();
  var existingId = props.getProperty(SPREADSHEET_PROP_KEY);
  if (existingId) {
    try {
      var existingSs = SpreadsheetApp.openById(existingId);
      return { success: true, message: "Database sudah ada", url: existingSs.getUrl() };
    } catch (e) {}
  }

  // Buat spreadsheet baru di Google Drive guru
  var ss = SpreadsheetApp.create("Database Chat Kelas IMBS");
  props.setProperty(SPREADSHEET_PROP_KEY, ss.getId());

  // Sheet 1: Users
  var sheetUsers = ss.getActiveSheet();
  sheetUsers.setName("Users");
  sheetUsers.appendRow(["id", "username", "password_hash", "full_name", "display_name", "role", "avatar_emoji", "created_at", "muted_until", "mute_reason"]);
  sheetUsers.getRange("1:1").setFontWeight("bold").setBackground("#e2e8f0");

  // Akun guru default otomatis: guru / guru123
  var guruSalt = "imbs_salt_";
  var defaultHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, guruSalt + "guru123");
  var defaultHashStr = defaultHash.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');

  sheetUsers.appendRow([
    "usr_guru_01",
    "guru",
    defaultHashStr,
    "Ustadz / Ustadzah Pembina",
    "Guru",
    "guru",
    "👨‍🏫",
    new Date().toISOString(),
    "",
    ""
  ]);

  // Sheet 2: Messages
  var sheetMsg = ss.insertSheet("Messages");
  sheetMsg.appendRow(["id", "user_id", "sender_username", "sender_name", "sender_role", "avatar_emoji", "text", "timestamp", "is_deleted", "deleted_by", "delete_reason"]);
  sheetMsg.getRange("1:1").setFontWeight("bold").setBackground("#e2e8f0");

  // Pesan sambutan perdana
  sheetMsg.appendRow([
    "msg_welcome_01",
    "usr_guru_01",
    "guru",
    "Guru",
    "guru",
    "👨‍🏫",
    "Assalamu'alaikum wr. wb. Selamat datang di Chat Kelas IMBS (SMP IT Insan Mulia Maos). Silakan manfaatkan grup ini untuk tanya jawab dan diskusi belajar secara santun.",
    new Date().toISOString(),
    false,
    "",
    ""
  ]);

  // Sheet 3: Sessions
  var sheetSessions = ss.insertSheet("Sessions");
  sheetSessions.appendRow(["session_id", "user_id", "username", "created_at", "expires_at"]);
  sheetSessions.getRange("1:1").setFontWeight("bold").setBackground("#e2e8f0");

  // Sheet 4: Log_Moderasi
  var sheetLog = ss.insertSheet("Log_Moderasi");
  sheetLog.appendRow(["id", "timestamp", "guru_username", "tindakan", "target_siswa", "keterangan"]);
  sheetLog.getRange("1:1").setFontWeight("bold").setBackground("#e2e8f0");
  sheetLog.appendRow([
    "log_01",
    new Date().toISOString(),
    "guru",
    "setup_database",
    "-",
    "Inisialisasi awal database Chat Kelas IMBS berhasil"
  ]);

  return {
    success: true,
    spreadsheetId: ss.getId(),
    url: ss.getUrl()
  };
}

/**
 * Hash password dengan SHA-256 dan salt sederhana
 */
function hashPassword(password) {
  var salt = "imbs_salt_";
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + password);
  return digest.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

/**
 * Autentikasi Pengguna (Guru / Siswa)
 */
function login(username, password) {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  if (!ssId) return { success: false, error: "Database belum disiapkan" };
  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName("Users");
  var data = sheet.getDataRange().getValues();

  var hashedInput = hashPassword(password);

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === username) {
      if (data[i][2] === hashedInput) {
        var user = {
          id: data[i][0],
          username: data[i][1],
          fullName: data[i][3],
          displayName: data[i][4],
          role: data[i][5],
          avatarEmoji: data[i][6],
          mutedUntil: data[i][8] || null,
          muteReason: data[i][9] || ""
        };
        return { success: true, user: user };
      } else {
        return { success: false, error: "Password keliru" };
      }
    }
  }
  return { success: false, error: "Username tidak ditemukan" };
}

/**
 * Mengambil daftar pesan terbaru (Polling 5 detik)
 */
function getMessages() {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  if (!ssId) return [];
  var ss = SpreadsheetApp.openById(ssId);
  var sheet = ss.getSheetByName("Messages");
  var data = sheet.getDataRange().getValues();
  var messages = [];

  for (var i = 1; i < data.length; i++) {
    var isDeleted = data[i][8] === true || data[i][8] === "true";
    if (!isDeleted) {
      messages.push({
        id: data[i][0],
        userId: data[i][1],
        senderUsername: data[i][2],
        senderName: data[i][3],
        senderRole: data[i][4],
        avatarEmoji: data[i][5],
        text: data[i][6],
        timestamp: data[i][7]
      });
    }
  }
  return messages.slice(-100); // Ambil 100 pesan terakhir
}

/**
 * Mengirim pesan baru
 */
function sendMessage(userData, text) {
  if (!userData || !userData.username) {
    return { success: false, error: "Harus login untuk mengirim pesan" };
  }
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  var ss = SpreadsheetApp.openById(ssId);

  // Periksa apakah siswa sedang di-mute
  var sheetUsers = ss.getSheetByName("Users");
  var usersData = sheetUsers.getDataRange().getValues();
  for (var i = 1; i < usersData.length; i++) {
    if (usersData[i][1] === userData.username) {
      var mutedUntil = usersData[i][8];
      if (mutedUntil) {
        var muteDate = new Date(mutedUntil);
        if (muteDate > new Date()) {
          return { success: false, error: "Anda sedang di-mute hingga " + muteDate.toLocaleTimeString("id-ID") };
        }
      }
      break;
    }
  }

  var sheetMsg = ss.getSheetByName("Messages");
  var msgId = "msg_" + new Date().getTime();
  var nowIso = new Date().toISOString();

  sheetMsg.appendRow([
    msgId,
    userData.id,
    userData.username,
    userData.displayName,
    userData.role,
    userData.avatarEmoji,
    text,
    nowIso,
    false,
    "",
    ""
  ]);

  return { success: true, messageId: msgId };
}

/**
 * Moderasi: Menghapus Pesan (Hanya Guru)
 */
function deleteMessage(guruUsername, messageId, reason) {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  var ss = SpreadsheetApp.openById(ssId);
  var sheetMsg = ss.getSheetByName("Messages");
  var data = sheetMsg.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === messageId) {
      sheetMsg.getRange(i + 1, 9).setValue(true); // is_deleted = true
      sheetMsg.getRange(i + 1, 10).setValue(guruUsername);
      sheetMsg.getRange(i + 1, 11).setValue(reason || "Dihapus oleh guru");

      // Catat ke Log_Moderasi
      var sheetLog = ss.getSheetByName("Log_Moderasi");
      sheetLog.appendRow([
        "log_" + new Date().getTime(),
        new Date().toISOString(),
        guruUsername,
        "hapus_pesan",
        data[i][2],
        "Pesan ID: " + messageId + " | Alasan: " + (reason || "Melanggar ketertiban")
      ]);

      return { success: true };
    }
  }
  return { success: false, error: "Pesan tidak ditemukan" };
}

/**
 * Moderasi: Mute Siswa (10 menit, 1 jam, 1 hari, 7 hari)
 */
function muteStudent(guruUsername, targetUsername, durationMinutes, reason) {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  var ss = SpreadsheetApp.openById(ssId);
  var sheetUsers = ss.getSheetByName("Users");
  var data = sheetUsers.getDataRange().getValues();

  var mutedUntil = new Date(new Date().getTime() + durationMinutes * 60 * 1000).toISOString();

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === targetUsername) {
      sheetUsers.getRange(i + 1, 9).setValue(mutedUntil);
      sheetUsers.getRange(i + 1, 10).setValue(reason || "Mute oleh guru");

      // Catat ke Log
      var sheetLog = ss.getSheetByName("Log_Moderasi");
      sheetLog.appendRow([
        "log_" + new Date().getTime(),
        new Date().toISOString(),
        guruUsername,
        "mute_siswa",
        targetUsername,
        "Durasi: " + durationMinutes + " menit | Alasan: " + (reason || "Membatasi obrolan")
      ]);

      return { success: true, mutedUntil: mutedUntil };
    }
  }
  return { success: false, error: "Siswa tidak ditemukan" };
}

/**
 * Moderasi: Batalkan Mute Lebih Awal
 */
function unmuteStudent(guruUsername, targetUsername) {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  var ss = SpreadsheetApp.openById(ssId);
  var sheetUsers = ss.getSheetByName("Users");
  var data = sheetUsers.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === targetUsername) {
      sheetUsers.getRange(i + 1, 9).setValue("");
      sheetUsers.getRange(i + 1, 10).setValue("");

      var sheetLog = ss.getSheetByName("Log_Moderasi");
      sheetLog.appendRow([
        "log_" + new Date().getTime(),
        new Date().toISOString(),
        guruUsername,
        "unmute_siswa",
        targetUsername,
        "Mute dibatalkan lebih awal oleh guru"
      ]);

      return { success: true };
    }
  }
  return { success: false, error: "Siswa tidak ditemukan" };
}

/**
 * Langkah 5: Generate Massal Akun Siswa (Prefix, Jumlah, Mulai dari)
 */
function bulkGenerateStudents(guruUsername, prefix, count, startNumber) {
  var ssId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROP_KEY);
  var ss = SpreadsheetApp.openById(ssId);
  var sheetUsers = ss.getSheetByName("Users");

  var adjectives = ["rajin", "santun", "cerdas", "hebat", "mulia", "kreatif"];
  var avatars = ["👦", "🧕", "🧑‍🎓", "📚", "⭐", "🌱"];
  var results = [];
  var rowsToAdd = [];

  for (var i = 0; i < count; i++) {
    var num = startNumber + i;
    var numStr = num < 10 ? "0" + num : "" + num;
    var username = prefix + numStr;
    var rawPassword = adjectives[Math.floor(Math.random() * adjectives.length)] + (Math.floor(Math.random() * 899) + 100);
    var hashed = hashPassword(rawPassword);
    var avatar = avatars[i % avatars.length];
    var displayName = "Siswa " + numStr;

    rowsToAdd.push([
      "usr_" + username,
      username,
      hashed,
      displayName,
      displayName,
      "siswa",
      avatar,
      new Date().toISOString(),
      "",
      ""
    ]);

    results.push({
      username: username,
      password: rawPassword,
      displayName: displayName,
      avatar: avatar
    });
  }

  // Masukkan baris sekaligus
  if (rowsToAdd.length > 0) {
    sheetUsers.getRange(sheetUsers.getLastRow() + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
  }

  // Catat ke Log_Moderasi
  var sheetLog = ss.getSheetByName("Log_Moderasi");
  sheetLog.appendRow([
    "log_" + new Date().getTime(),
    new Date().toISOString(),
    guruUsername,
    "bulk_generate",
    prefix + startNumber + " - " + prefix + (startNumber + count - 1),
    "Generate " + count + " akun siswa baru"
  ]);

  return { success: true, count: count, students: results };
}
`;

export const INDEX_HTML_CONTENT = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title><?= groupName ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .chat-container { height: calc(100vh - 160px); }
  </style>
</head>
<body class="bg-gray-100 flex flex-col h-screen">
  <!-- Header Aplikasi -->
  <header class="bg-emerald-700 text-white px-4 py-3 shadow flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold text-lg">IM</div>
      <div>
        <h1 class="font-bold text-base md:text-lg"><?= groupName ?></h1>
        <p class="text-xs text-emerald-100">SMP IT Insan Mulia Maos</p>
      </div>
    </div>
    <div id="user-badge" class="flex items-center space-x-2 text-sm">
      <span id="user-name" class="font-medium">Tamu (Read-only)</span>
      <button id="btn-login-modal" onclick="openLoginModal()" class="bg-white text-emerald-800 text-xs px-3 py-1.5 rounded font-semibold hover:bg-emerald-50">Login</button>
    </div>
  </header>

  <!-- Area Pesan Chat -->
  <main id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 chat-container">
    <div class="text-center text-xs text-gray-500 my-2">Memuat percakapan kelas...</div>
  </main>

  <!-- Input Bar Bawah -->
  <footer class="bg-white border-t p-3">
    <div id="guest-notice" class="text-center text-xs text-gray-500 py-1">
      Mode Tamu (Hanya Membaca) — Silakan login untuk mengirim pesan ke kelas.
    </div>
    <form id="chat-form" onsubmit="handleSendMessage(event)" class="hidden flex items-center space-x-2">
      <input type="text" id="chat-input" placeholder="Tulis pesan santun..." class="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
      <button type="submit" class="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800">Kirim</button>
    </form>
  </footer>

  <script>
    var currentUser = null;
    function pollMessages() {
      google.script.run.withSuccessHandler(renderMessages).getMessages();
    }
    setInterval(pollMessages, 5000);
    pollMessages();

    function renderMessages(msgs) {
      var container = document.getElementById('chat-messages');
      if (!msgs || msgs.length === 0) {
        container.innerHTML = '<div class="text-center text-xs text-gray-400">Belum ada pesan. Mulai obrolan dengan salam!</div>';
        return;
      }
      container.innerHTML = msgs.map(function(m) {
        var isGuru = m.senderRole === 'guru';
        return '<div class="flex items-start space-x-2">' +
          '<span class="text-xl">' + m.avatarEmoji + '</span>' +
          '<div class="bg-white rounded-lg p-2.5 shadow-sm max-w-lg border ' + (isGuru ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200') + '">' +
            '<div class="flex items-center space-x-2 text-xs text-gray-500 mb-1">' +
              '<span class="font-semibold text-gray-800">' + m.senderName + '</span>' +
              (isGuru ? '<span class="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-xs font-bold">Guru</span>' : '') +
              '<span>' + new Date(m.timestamp).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}) + '</span>' +
            '</div>' +
            '<p class="text-sm text-gray-800">' + m.text + '</p>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  </script>
</body>
</html>`;

export const APPSSCRIPT_JSON_CONTENT = `{
  "timeZone": "Asia/Jakarta",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_DEPLOYING"
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}`;
