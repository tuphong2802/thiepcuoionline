const SPREADSHEET_ID = 'DAN_ID_GOOGLE_SHEETS_VAO_DAY';
const SHEET_NAME = 'RSVP';

// Mở URL /exec trong trình duyệt để kiểm tra endpoint và quyền truy cập bảng tính.
function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss);
    return json_({ ok: true, message: 'RSVP endpoint is ready', sheet: sheet.getName() });
  } catch (err) {
    console.error('doGet failed:', err);
    return json_({ ok: false, message: 'Cannot open spreadsheet. Check SPREADSHEET_ID and owner permissions.' });
  }
}

function doPost(e) {
  const p = (e && e.parameter) ? e.parameter : {};

  // Honeypot: nếu sau này thêm input ẩn website vào form, bot điền trường này sẽ bị bỏ qua.
  if (String(p.website || '').trim()) return json_({ ok: true });

  const name = clean_(p.name, 120);
  const attendance = clean_(p.attendance, 80);
  const count = clean_(p.count, 40);
  const side = clean_(p.side, 60);
  const message = clean_(p.message, 1000);
  const invitee = clean_(p.invitee, 120);
  const validAnswers = [
    'Có, mình sẽ tham dự',
    'Rất tiếc, mình không thể tham dự'
  ];

  if (!name || !validAnswers.includes(attendance)) {
    return json_({ ok: false, message: 'Invalid RSVP data' });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss);
    sheet.appendRow([
      new Date(),
      safeCell_(name),
      attendance,
      safeCell_(count),
      safeCell_(side),
      safeCell_(message),
      safeCell_(invitee)
    ]);
    return json_({ ok: true, message: 'RSVP saved' });
  } catch (err) {
    console.error('doPost failed:', err);
    return json_({ ok: false, message: 'Failed to save RSVP' });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

// Chạy hàm này thủ công một lần trong Apps Script để cấp quyền và tạo sheet/tiêu đề.
function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateSheet_(ss);
  Logger.log('Ready: ' + ss.getUrl() + ' / ' + sheet.getName());
}

function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian',
      'Họ tên khách',
      'Xác nhận tham dự',
      'Số người',
      'Khách của',
      'Lời chúc',
      'Tên trên thiệp mời'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean_(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, maxLength);
}

function safeCell_(value) {
  return /^[=+\-@]/.test(String(value || '')) ? "'" + value : value;
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
