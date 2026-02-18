/**
 * =====================================================================
 * OMS - Order Management System | سیستم مدیریت سفارش و کالا
 * نسخه: 3.0 - بازنویسی کامل با رفع تمام باگ‌ها
 * =====================================================================
 */

// =====================================================================
// CONSTANTS - ثابت‌های اصلی (بدون PropertiesService در scope جهانی)
// =====================================================================

const DATA_HEADERS = [
  "تاریخ","نام کالا","تعداد کل","تعداد در پک",
  "وضعیت","نام بسته بندی","تامین کننده پارچه","نام تولیدی",
  "پارچه","سنگشویی (انتخابی)","کد کالا","استایل",
  "سالم 30","سالم 31","سالم 32","سالم 33","سالم 34","سالم 36","سالم 38","سالم 40",
  "اقتصادی 30","اقتصادی 31","اقتصادی 32","اقتصادی 33","اقتصادی 34","اقتصادی 36","اقتصادی 38","اقتصادی 40",
  "اقتصادی2 30","اقتصادی2 31","اقتصادی2 32","اقتصادی2 33","اقتصادی2 34","اقتصادی2 36","اقتصادی2 38","اقتصادی2 40",
  "اقتصادی3 30","اقتصادی3 31","اقتصادی3 32","اقتصادی3 33","اقتصادی3 34","اقتصادی3 36","اقتصادی3 38","اقتصادی3 40",
  "نمونه 30","نمونه 31","نمونه 32","نمونه 33","نمونه 34","نمونه 36","نمونه 38","نمونه 40",
  "استوک 30","استوک 31","استوک 32","استوک 33","استوک 34","استوک 36","استوک 38","استوک 40",
  "استوک پارچه","استوک شست","استوک تولید","استوک بسته بندی","تعداد قابل فروش",
  "شست متفاوت","ضایعات","کسری سنگشویی","اضافه سنگشویی","کسری بسته بندی",
  "تعداد دکمه","تعداد پرچ","تعداد کارت جیب",
  "تعداد کارت سایز","تعداد آویز","تعداد بند","تعداد چرم",
  "توضیحات","تکمیل کننده","کنترل اولیه","کنترل کننده","ثبت کننده","آخرین ویرایش توسط","BU","سطح سفارش"
];

const DATA_SHEET_NAME      = "DATA";
const CODE_HEADER_NAME     = "کد کالا";
const CODE_COL_1BASED      = DATA_HEADERS.indexOf(CODE_HEADER_NAME) + 1; // = 11
const DQ_REPORT_SHEET      = "DQ_REPORT";
const DQ_ARCHIVE_SHEET     = "ARCHIVE_DUPLICATES";
const CHANGE_LOG_SHEET     = "CHANGE_LOG";
const REPORT_PRESETS_SHEET = "REPORT_PRESETS";

// =====================================================================
// UTILITY HELPERS
// =====================================================================

function normalizeDigits_(input) {
  return String(input ?? "")
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

function _norm_(v) {
  if (v === null || v === undefined) return "";
  return normalizeDigits_(
    String(v).replace(/_/g, " ").replace(/\s+/g, " ").trim()
      .replace(/[ي]/g, "ی").replace(/[ك]/g, "ک")
  );
}

function normalizeCodeBasic_(v) {
  return normalizeDigits_(String(v ?? "")).trim()
    .replace(/[\s\u200c]/g, "").toUpperCase();
}

function numericCode_(v) {
  const s = normalizeDigits_(String(v ?? "")).trim().replace(/[\s\u200c]/g, "");
  if (!/^\d+$/.test(s)) return null;
  return s.replace(/^0+(?=\d)/, "");
}

function asPlain_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, "Asia/Tehran", "yyyy/MM/dd");
  return (v === null || v === undefined) ? "" : v;
}

function _toStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, "Asia/Tehran", "yyyy/MM/dd");
  return String(v ?? "");
}

function _toNum_(v) {
  const s = normalizeDigits_(String(v ?? "")).replace(/,/g, "").trim();
  if (s === "") return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function _coerceNumber_(v) {
  const s = normalizeDigits_(String(v ?? "")).replace(/,/g, "").trim();
  if (s === "") return "";
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function _isBadDate_(v) {
  if (v instanceof Date) return false;
  const s = normalizeDigits_(String(v ?? "")).trim();
  if (!s) return true;
  const m = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/.exec(s);
  if (!m) return true;
  const mm = Number(m[2]), dd = Number(m[3]);
  return !(mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31);
}

// [FIX] Lazy initialization - جلوگیری از crash هنگام parse
function _getDP_()    { return PropertiesService.getDocumentProperties(); }
function _getCache_() { return CacheService.getDocumentCache(); }

// =====================================================================
// COLUMN SETS
// =====================================================================

function _numColSet_() {
  const set = {};
  [2,3].forEach(i => set[i] = true);
  for (let i = 12; i <= 69; i++) set[i] = true;
  return set;
}

function _textColSet_() {
  const set = {};
  [1,4,5,6,7,8,9,11,76,77,78,79,80,81,82,83].forEach(i => set[i] = true);
  return set;
}

// =====================================================================
// CODE INDEX
// =====================================================================

function invalidateCodeIndex_() {
  try {
    const dp = _getDP_();
    dp.deleteProperty("CODE_INDEX_JSON");
    dp.deleteProperty("CODE_INDEX_LASTROW");
    dp.deleteProperty("CODE_INDEX_DUPS");
    _getCache_().remove("CODE_INDEX_JSON");
  } catch(e) {}
}

function buildCodeIndex_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sh) throw new Error('شیت "DATA" پیدا نشد.');

  const lastRow = sh.getLastRow();
  const index = {}, dups = {};

  if (lastRow >= 2) {
    const vals = sh.getRange(2, CODE_COL_1BASED, lastRow-1, 1).getValues();
    for (let i = 0; i < vals.length; i++) {
      const rowId = i + 2;
      const key = normalizeCodeBasic_(vals[i][0]);
      if (!key) continue;
      if (index[key] !== undefined && index[key] !== rowId) {
        dups[key] = dups[key] || [index[key]];
        if (!dups[key].includes(rowId)) dups[key].push(rowId);
      }
      index[key] = rowId;
    }
  }

  try {
    const dp = _getDP_();
    const j  = JSON.stringify(index);
    dp.setProperty("CODE_INDEX_JSON",    j);
    dp.setProperty("CODE_INDEX_LASTROW", String(lastRow));
    dp.setProperty("CODE_INDEX_DUPS",    JSON.stringify(dups));
    _getCache_().put("CODE_INDEX_JSON",  j, 300);
  } catch(e) {}

  return { index, lastRow, dups };
}

function getCodeIndex_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sh) throw new Error('شیت "DATA" پیدا نشد.');
  const lastRow = sh.getLastRow();

  try {
    const dp     = _getDP_();
    const cached = _getCache_().get("CODE_INDEX_JSON");
    const clast  = dp.getProperty("CODE_INDEX_LASTROW");
    if (cached && clast && Number(clast) === lastRow)
      return { index: JSON.parse(cached), lastRow, dups: JSON.parse(dp.getProperty("CODE_INDEX_DUPS")||"{}") };

    const ip = dp.getProperty("CODE_INDEX_JSON");
    const lp = dp.getProperty("CODE_INDEX_LASTROW");
    if (ip && lp && Number(lp) === lastRow) {
      _getCache_().put("CODE_INDEX_JSON", ip, 300);
      return { index: JSON.parse(ip), lastRow, dups: JSON.parse(dp.getProperty("CODE_INDEX_DUPS")||"{}") };
    }
  } catch(e) {}

  return buildCodeIndex_();
}

function findRowByCode_(code) {
  const sBasic = normalizeCodeBasic_(code);
  if (!sBasic) return { rowId: null, error: "کد کالا خالی است." };

  const { index, dups } = getCodeIndex_();
  if (dups && dups[sBasic] && dups[sBasic].length > 1)
    return { rowId: null, error: `برای کد "${code}" چندین ردیف وجود دارد: ${dups[sBasic].join(", ")}` };
  if (index[sBasic]) return { rowId: index[sBasic] };

  const sNum = numericCode_(code);
  if (sNum !== null) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(DATA_SHEET_NAME);
    if (sh && sh.getLastRow() >= 2) {
      const found = sh.getRange(2, CODE_COL_1BASED, sh.getLastRow()-1, 1)
        .createTextFinder(sNum).matchEntireCell(true).findNext();
      if (found) return { rowId: found.getRow() };
    }
  }
  return { rowId: null };
}

// =====================================================================
// SHEET SETUP
// =====================================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("مدیریت کالا")
    .addSeparator()
    .addItem("فرم ثبت کالا",       "showOrderDialog")
    .addToUi();

  // [FIX] فقط اگر DATA وجود ندارد، setupSheets اجرا شود
  try {
    if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_SHEET_NAME))
      setupSheets();
  } catch(e) {}
}

function showOrderDialog() {
  const html = HtmlService.createTemplateFromFile("dialog")
    .evaluate().setWidth(1400).setHeight(920);
  SpreadsheetApp.getUi().showModalDialog(html, "فرم ثبت اطلاعات کالا");
}

function showReportDialog() {
  const html = HtmlService.createTemplateFromFile("report")
    .evaluate().setWidth(1400).setHeight(920);
  SpreadsheetApp.getUi().showModalDialog(html, "گزارش‌گیری");
}

function showInventoryDialog() {
  const html = HtmlService.createTemplateFromFile("inventory")
    .evaluate().setWidth(1400).setHeight(920);
  SpreadsheetApp.getUi().showModalDialog(html, "داشبورد موجودی");
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try { ss.setSpreadsheetTimeZone("Asia/Tehran"); } catch(e) {}

  // [FIX] شیت DATA - فقط اگر موجود نیست (هدرها overwrite نمی‌شوند)
  let dataSh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!dataSh) {
    dataSh = ss.insertSheet(DATA_SHEET_NAME, 0);
    dataSh.getRange(1, 1, 1, DATA_HEADERS.length).setValues([DATA_HEADERS]).setFontWeight("bold");
    dataSh.setFrozenRows(1);
  }

  _ensureSimpleList_(ss, "استایل",          "لیست استایل‌ها");
  _ensureSimpleList_(ss, "پارچه",            "لیست پارچه‌ها");
  _ensureSimpleList_(ss, "تکمیل کننده",      "لیست تکمیل کننده‌ها");
  _ensureSimpleList_(ss, "کنترل کننده ها",   "لیست کنترل کننده‌ها");

  if (!ss.getSheetByName("پیمانکاران و تامین کنندگان")) {
    const sh = ss.insertSheet("پیمانکاران و تامین کنندگان");
    sh.appendRow(["نام","نقش"]);
    sh.getRange("A1:B1").setFontWeight("bold");
    sh.setFrozenRows(1);
  }
}

function _ensureSimpleList_(ss, name, header) {
  if (!ss.getSheetByName(name)) {
    const sh = ss.insertSheet(name);
    sh.appendRow([header]);
    sh.getRange("A1").setFontWeight("bold");
    sh.setFrozenRows(1);
  }
}

function _ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (headers && headers.length) {
    sh.clear();
    sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

// =====================================================================
// INITIAL DATA
// =====================================================================

function getInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let userName = "کاربر ناشناس";
  try { userName = Session.getActiveUser().getEmail() || "کاربر ناشناس"; } catch(e) {}

  const getList = (sheetName) => {
    const sh = ss.getSheetByName(sheetName);
    if (!sh || sh.getLastRow() < 2) return [];
    return sh.getRange(2,1,sh.getLastRow()-1,1).getValues()
      .flat().filter(v => String(v).trim() !== "");
  };

  const styleList         = getList("استایل");
  const fabricList        = getList("پارچه");
  const finisherList      = getList("تکمیل کننده");
  const controllerList    = getList("کنترل کننده ها");
  const initialControlList = getList("کنترل کننده ها");

  let fabricSuppliers = [], productionSuppliers = [], packingNames = [], stoneWashers = [];
  const csh = ss.getSheetByName("پیمانکاران و تامین کنندگان");
  if (csh && csh.getLastRow() >= 2) {
    csh.getRange(2,1,csh.getLastRow()-1,2).getValues().forEach(row => {
      const name = String(row[0]||"").trim();
      const role = String(row[1]||"").trim();
      if (!name) return;
      if      (role === "پارچه")      fabricSuppliers.push(name);
      else if (role === "تولیدی")     productionSuppliers.push(name);
      else if (role === "بسته بندی")  packingNames.push(name);
      else if (role === "سنگشویی")    stoneWashers.push(name);
    });
  }

  return { userName, styleList, fabricList, finisherList, controllerList, initialControlList,
    fabricSuppliers, productionSuppliers, packingNames, stoneWashers };
}

// =====================================================================
// DROPDOWN - افزودن آیتم جدید
// =====================================================================

// [FIX] تابعی که در نسخه قبل وجود نداشت و crash ایجاد می‌کرد
function getSimpleList_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(sheetName);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2,1,sh.getLastRow()-1,1).getValues()
    .flat().filter(v => String(v).trim() !== "");
}

function addDropdownItem(selectId, rawValue) {
  const v = _norm_(rawValue);
  if (!v) throw new Error("مقدار خالی است.");

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const addSimple = (sheetName) => {
    const sh = ss.getSheetByName(sheetName);
    if (!sh) throw new Error(`شیت "${sheetName}" پیدا نشد.`);
    if (getSimpleList_(sheetName).map(x => String(x).trim()).includes(v))
      return { ok: true, added: false, value: v };
    sh.appendRow([v]);
    return { ok: true, added: true, value: v };
  };

  const addContractor = (role) => {
    const sh = ss.getSheetByName("پیمانکاران و تامین کنندگان");
    if (!sh) throw new Error('شیت "پیمانکاران و تامین کنندگان" پیدا نشد.');
    const last = sh.getLastRow();
    if (last >= 2) {
      const exists = sh.getRange(2,1,last-1,2).getValues()
        .some(r => String(r[0]||"").trim() === v && String(r[1]||"").trim() === role);
      if (exists) return { ok: true, added: false, value: v };
    }
    sh.appendRow([v, role]);
    return { ok: true, added: true, value: v };
  };

  switch (String(selectId||"").trim()) {
    case "style":                  return addSimple("استایل");
    case "fabric":                 return addSimple("پارچه");
    case "finisher":               return addSimple("تکمیل کننده");
    case "controller":             return addSimple("کنترل کننده ها");
    case "initialControl":         return addSimple("کنترل کننده ها");
    case "packingName":            return addContractor("بسته بندی");
    case "fabricSupplierName":     return addContractor("پارچه");
    case "productionSupplierName": return addContractor("تولیدی");
    case "stoneWash":              return addContractor("سنگشویی");
    default: throw new Error("این دراپ‌داون برای افزودن آیتم جدید تعریف نشده است.");
  }
}

// =====================================================================
// DATA MAPPING
// =====================================================================

function mapRowToObject_(row, rowId) {
  const at = (i) => asPlain_(row[i]);
  return {
    rowId,
    date: at(0), name: at(1), count: at(2), packingCount: at(3),
    status: at(4), packingName: at(5), fabricSupplierName: at(6),
    productionSupplierName: at(7), fabric: at(8), stoneWash: at(9),
    code: at(10), style: at(11),

    size30_s: at(12), size31_s: at(13), size32_s: at(14), size33_s: at(15),
    size34_s: at(16), size36_s: at(17), size38_s: at(18), size40_s: at(19),

    size30_e: at(20), size31_e: at(21), size32_e: at(22), size33_e: at(23),
    size34_e: at(24), size36_e: at(25), size38_e: at(26), size40_e: at(27),

    size30_e2: at(28), size31_e2: at(29), size32_e2: at(30), size33_e2: at(31),
    size34_e2: at(32), size36_e2: at(33), size38_e2: at(34), size40_e2: at(35),

    size30_e3: at(36), size31_e3: at(37), size32_e3: at(38), size33_e3: at(39),
    size34_e3: at(40), size36_e3: at(41), size38_e3: at(42), size40_e3: at(43),

    size30_n: at(44), size31_n: at(45), size32_n: at(46), size33_n: at(47),
    size34_n: at(48), size36_n: at(49), size38_n: at(50), size40_n: at(51),

    size30_stock: at(52), size31_stock: at(53), size32_stock: at(54), size33_stock: at(55),
    size34_stock: at(56), size36_stock: at(57), size38_stock: at(58), size40_stock: at(59),

    stock_fabric: at(60), stock_wash: at(61), stock_production: at(62),
    stock_packaging: at(63), saleable_count: at(64), different_wash: at(65), 
    waste: at(66), stock_minus: at(67), stock_plus: at(68), stock_packaging_minus: at(69),

    btn: at(70), perch: at(71), pocketCard: at(72), sizeCard: at(73),
    hanger: at(74), band: at(75), leather: at(76),

    description: at(77), finisher: at(78), initialControl: at(79), controller: at(80),
    saverName: at(81), editorName: at(82), bu: at(83), bv: at(84)
  };
}

// =====================================================================
// SEARCH
// =====================================================================

function searchOrderData(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return { error: "شیت DATA خالی است." };

  const found = findRowByCode_(code);
  if (found.error) return { error: found.error };
  if (!found.rowId) return { error: `کد کالا "${code}" پیدا نشد.` };

  const row = sheet.getRange(found.rowId, 1, 1, DATA_HEADERS.length).getValues()[0];
  return mapRowToObject_(row, found.rowId);
}

// =====================================================================
// SAVE
// =====================================================================

function saveOrderData(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet) return { error: "شیت DATA پیدا نشد." };

  let userName = "کاربر ناشناس";
  try { userName = Session.getActiveUser().getEmail() || "کاربر ناشناس"; } catch(e) {}

  const codeNorm = normalizeCodeBasic_(data.code);
  if (!codeNorm)                      return { error: "کد کالا الزامی است." };
  if (!String(data.date||"").trim())   return { error: "تاریخ الزامی است." };
  if (!String(data.name||"").trim())   return { error: "نام کالا الزامی است." };
  if (!String(data.status||"").trim()) return { error: "وضعیت الزامی است." };
  if (!String(data.bu||"").trim())     return { error: "نوع سفارش (BU) الزامی است." };
  if (!String(data.bv||"").trim())     return { error: "سطح سفارش (BV) الزامی است." };

  const rowData = [
    data.date, data.name, data.count, data.packingCount,
    data.status, data.packingName, data.fabricSupplierName, data.productionSupplierName,
    data.fabric, data.stoneWash, codeNorm, data.style,

    data.size30_s, data.size31_s, data.size32_s, data.size33_s,
    data.size34_s, data.size36_s, data.size38_s, data.size40_s,
    data.size30_e, data.size31_e, data.size32_e, data.size33_e,
    data.size34_e, data.size36_e, data.size38_e, data.size40_e,
    data.size30_e2, data.size31_e2, data.size32_e2, data.size33_e2,
    data.size34_e2, data.size36_e2, data.size38_e2, data.size40_e2,
    data.size30_e3, data.size31_e3, data.size32_e3, data.size33_e3,
    data.size34_e3, data.size36_e3, data.size38_e3, data.size40_e3,
    data.size30_n, data.size31_n, data.size32_n, data.size33_n,
    data.size34_n, data.size36_n, data.size38_n, data.size40_n,

    data.size30_stock, data.size31_stock, data.size32_stock, data.size33_stock,
    data.size34_stock, data.size36_stock, data.size38_stock, data.size40_stock,

    data.stock_fabric, data.stock_wash, data.stock_production, data.stock_packaging,
    data.saleable_count, data.different_wash, data.waste, data.stock_minus, 
    data.stock_plus, data.stock_packaging_minus,

    data.btn, data.perch, data.pocketCard, data.sizeCard,
    data.hanger, data.band, data.leather,

    data.description, data.finisher, data.initialControl, data.controller,
    data.originalSaverName || userName, userName, data.bu, data.bv
  ];

  // نرمال‌سازی
  try {
    const ncs = _numColSet_(), tcs = _textColSet_();
    for (let i = 0; i < rowData.length; i++) {
      if (i === 10) continue;
      if (tcs[i]) rowData[i] = _norm_(rowData[i]);
      if (ncs[i]) {
        const n = _coerceNumber_(rowData[i]);
        rowData[i] = (!Number.isNaN(n) && n !== "") ? n : (n === "" ? "" : rowData[i]);
      }
    }
  } catch(e) {}

  const found = findRowByCode_(data.code);
  if (found.error) return { error: found.error };

  let targetRowId = null;
  if (data.rowId) {
    const rId = parseInt(data.rowId, 10);
    if (found.rowId && found.rowId !== rId)
      return { error: `کد کالا "${data.code}" قبلاً در ردیف ${found.rowId} ثبت شده است.` };
    targetRowId = rId;
  } else {
    targetRowId = found.rowId || null;
  }

  if (targetRowId) {
    const beforeRow = sheet.getRange(targetRowId, 1, 1, rowData.length).getValues()[0];
    sheet.getRange(targetRowId, 1, 1, rowData.length).setValues([rowData]);
    _appendChangeLog_("UPDATE", codeNorm, targetRowId, beforeRow, rowData);
    _syncIndex_(codeNorm, targetRowId, sheet.getLastRow());
    // [FIX] برگشت rowId برای آپدیت فرم
    return { ok: true, rowId: targetRowId, message: `ردیف ${targetRowId} (کد: ${codeNorm}) به‌روزرسانی شد. ✔` };
  }

  sheet.appendRow(rowData);
  const newRowId = sheet.getLastRow();
  _appendChangeLog_("CREATE", codeNorm, newRowId, null, rowData);
  _syncIndex_(codeNorm, newRowId, newRowId);
  // [FIX] برگشت rowId برای رکورد جدید
  return { ok: true, rowId: newRowId, message: `اطلاعات جدید ثبت شد (کد: ${codeNorm}). ✔` };
}

function _syncIndex_(codeNorm, rowId, lastRow) {
  try {
    const idx = getCodeIndex_();
    idx.index[codeNorm] = rowId;
    const dp = _getDP_();
    const j  = JSON.stringify(idx.index);
    dp.setProperty("CODE_INDEX_JSON",    j);
    dp.setProperty("CODE_INDEX_LASTROW", String(lastRow));
    _getCache_().put("CODE_INDEX_JSON",  j, 300);
  } catch(e) {}
}

// =====================================================================
// CHANGE LOG
// =====================================================================

function _appendChangeLog_(action, code, rowId, beforeRow, afterRow) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(CHANGE_LOG_SHEET);
    if (!sh) {
      sh = ss.insertSheet(CHANGE_LOG_SHEET);
      sh.appendRow(["زمان","کاربر","عملیات","کد کالا","ردیف","فیلد","مقدار قبلی","مقدار جدید"]);
      sh.getRange(1,1,1,8).setFontWeight("bold");
      sh.setFrozenRows(1);
    }
    let user = "کاربر ناشناس";
    try { user = Session.getActiveUser().getEmail() || user; } catch(e) {}
    const ts = new Date();

    if (!beforeRow) { sh.appendRow([ts,user,action,code,rowId,"—","—","ایجاد شد"]); return; }

    const rows = [];
    for (let i = 0; i < DATA_HEADERS.length; i++) {
      const a = asPlain_(beforeRow[i]), b = asPlain_(afterRow[i]);
      if (String(a) !== String(b)) rows.push([ts,user,action,code,rowId,DATA_HEADERS[i],a,b]);
    }
    if (rows.length) sh.getRange(sh.getLastRow()+1,1,rows.length,8).setValues(rows);
  } catch(e) {}
}

// =====================================================================
// DATA INTEGRITY
// =====================================================================

function auditDataIntegrity() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const { dups } = getCodeIndex_();
  const keys = Object.keys(dups || {});

  let sh = ss.getSheetByName("DUPLICATES");
  if (!sh) sh = ss.insertSheet("DUPLICATES");
  sh.clear();
  sh.getRange(1,1,1,4).setValues([["کد کالا","تعداد","ردیف‌ها","زمان گزارش"]]).setFontWeight("bold");

  if (!keys.length) {
    sh.getRange(2,1).setValue("مورد تکراری پیدا نشد. ✅");
    SpreadsheetApp.getUi().alert("یکپارچگی", "هیچ کد تکراری پیدا نشد. ✅", SpreadsheetApp.getUi().ButtonSet.OK);
    return { ok: true, duplicates: 0 };
  }

  const now = new Date();
  sh.getRange(2,1,keys.length,4).setValues(keys.map(k => [k, dups[k].length, dups[k].join(", "), now]));
  SpreadsheetApp.getUi().alert("یکپارچگی", `${keys.length} کد تکراری. شیت DUPLICATES را ببینید.`, SpreadsheetApp.getUi().ButtonSet.OK);
  return { ok: true, duplicates: keys.length };
}

// [FIX] تابع repairDataIntegrityByCode کاملاً مستقل (بدون embed فانکشن‌های دیگر)
function repairDataIntegrityByCode() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const dataSh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!dataSh) throw new Error('شیت "DATA" پیدا نشد.');

  const lastRow = dataSh.getLastRow();
  if (lastRow < 3) return { ok: true, moved: 0 };

  const { dups } = buildCodeIndex_();
  const codes = Object.keys(dups || {});
  if (!codes.length) {
    SpreadsheetApp.getUi().alert("تعمیر", "هیچ تکراری وجود ندارد. ✅", SpreadsheetApp.getUi().ButtonSet.OK);
    return { ok: true, moved: 0 };
  }

  let arc = ss.getSheetByName(DQ_ARCHIVE_SHEET);
  if (!arc) arc = ss.insertSheet(DQ_ARCHIVE_SHEET);
  if (arc.getLastRow() === 0) {
    arc.appendRow(["زمان", ...DATA_HEADERS]);
    arc.getRange(1,1,1,DATA_HEADERS.length+1).setFontWeight("bold");
  }

  const toMove = [];
  codes.forEach(k => {
    const rows = dups[k].slice().sort((a,b)=>a-b);
    rows.pop();
    rows.forEach(r => toMove.push(r));
  });
  toMove.sort((a,b)=>b-a);

  toMove.forEach(r => {
    const row = dataSh.getRange(r,1,1,DATA_HEADERS.length).getValues()[0];
    arc.appendRow([new Date(), ...row.map(asPlain_)]);
    dataSh.deleteRow(r);
  });

  invalidateCodeIndex_();
  buildCodeIndex_();

  SpreadsheetApp.getUi().alert("تعمیر", `${toMove.length} ردیف تکراری به ${DQ_ARCHIVE_SHEET} منتقل شد.`, SpreadsheetApp.getUi().ButtonSet.OK);
  return { ok: true, moved: toMove.length };
}

// =====================================================================
// DATA QUALITY
// =====================================================================

function runDataQualityScan() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const dataSh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!dataSh) throw new Error('شیت "DATA" پیدا نشد.');

  const lastRow = dataSh.getLastRow();
  const lastCol = DATA_HEADERS.length;
  const report  = _ensureSheet_(DQ_REPORT_SHEET, ["نوع مشکل","کد کالا","ردیف","ستون","مقدار","شرح"]);

  if (lastRow < 2) { report.getRange(2,1).setValue("DATA خالی است."); return {ok:true,issues:0}; }

  const { dups } = getCodeIndex_();
  const dupKeys  = Object.keys(dups||{});
  const out = [];
  dupKeys.forEach(k => out.push(["کد تکراری",k,"","کد کالا","",`ردیف‌ها: ${dups[k].join(", ")}`]));

  const data    = dataSh.getRange(2,1,lastRow-1,lastCol).getValues();
  const numCols = _numColSet_();
  const txtCols = _textColSet_();

  for (let r = 0; r < data.length; r++) {
    const rowId = r + 2, row = data[r];
    const codeRaw = row[10];
    const codeKey = normalizeCodeBasic_(codeRaw);

    if (!codeKey)
      out.push(["کد خالی","",rowId,"کد کالا",asPlain_(codeRaw),"کد کالا الزامی است."]);
    else {
      const codeShown = String(asPlain_(codeRaw));
      if (codeShown && codeShown !== codeKey)
        out.push(["کد غیرنرمال",codeKey,rowId,"کد کالا",codeShown,"پیشنهاد: حذف فاصله/نیم‌فاصله، یکسان‌سازی ارقام."]);
    }

    if (_isBadDate_(row[0]))
      out.push(["تاریخ نامعتبر",codeKey||"",rowId,"تاریخ",asPlain_(row[0]),"فرمت تاریخ درست نیست."]);

    for (let c = 0; c < lastCol; c++) {
      if (!numCols[c] || row[c]===""||row[c]===null||row[c]===undefined) continue;
      const n = _coerceNumber_(row[c]);
      if (Number.isNaN(n))
        out.push(["عدد نامعتبر",codeKey||"",rowId,DATA_HEADERS[c],asPlain_(row[c]),"این ستون عددی است."]);
      else if (n < 0)
        out.push(["عدد منفی",codeKey||"",rowId,DATA_HEADERS[c],n,"مقادیر منفی معمولاً اشتباه."]);
    }

    for (let c = 0; c < lastCol; c++) {
      if (!txtCols[c] || !row[c]) continue;
      const s = String(row[c]), fixed = _norm_(s);
      if (s !== fixed && (s.includes("_")||/^\s|\s$/.test(s)||/\s{2,}/.test(s)||/[يك]/.test(s)||/[۰-۹٠-٩]/.test(s)))
        out.push(["متن نیازمند نرمال‌سازی",codeKey||"",rowId,DATA_HEADERS[c],s,"تبدیل '_' به فاصله، یکسان‌سازی ی/ک."]);
    }

    // بررسی تطابق تعداد کل با جمع سایزها
    const totalN = _coerceNumber_(row[2]);
    if (!Number.isNaN(totalN) && totalN !== "") {
      let sum = 0, hasAny = false;
      for (let c = 12; c <= 51; c++) {
        const nn = _coerceNumber_(row[c]);
        if (Number.isNaN(nn)||nn==="") continue;
        hasAny = true; sum += nn;
      }
      if (hasAny && Math.abs(sum-totalN)>0.0001)
        out.push(["عدم تطابق تعداد",codeKey||"",rowId,"تعداد کل",totalN,`جمع سایزها = ${sum}`]);
    }
  }

  if (out.length) report.getRange(2,1,out.length,6).setValues(out);
  else report.getRange(2,1).setValue("هیچ مشکلی پیدا نشد ✅");

  SpreadsheetApp.getUi().alert("کنترل کیفیت", `${out.length} مورد یافت شد. شیت ${DQ_REPORT_SHEET} را ببینید.`, SpreadsheetApp.getUi().ButtonSet.OK);
  return { ok:true, issues: out.length, duplicates: dupKeys.length };
}

function applyDataQualityFixes() {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const dataSh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!dataSh) throw new Error('شیت "DATA" پیدا نشد.');

  const lastRow = dataSh.getLastRow();
  const lastCol = DATA_HEADERS.length;
  if (lastRow < 2) return {ok:true,updated:0};

  const data    = dataSh.getRange(2,1,lastRow-1,lastCol).getValues();
  const numCols = _numColSet_();
  const txtCols = _textColSet_();
  let updatedRows = 0;

  for (let r = 0; r < data.length; r++) {
    const row = data[r]; let changed = false;
    const cFix = normalizeCodeBasic_(row[10]);
    if (cFix && String(row[10]) !== cFix) { row[10] = cFix; changed = true; }

    for (let c = 0; c < lastCol; c++) {
      if (!txtCols[c]||!row[c]) continue;
      const fixed = _norm_(String(row[c]));
      if (String(row[c]) !== fixed) { row[c] = fixed; changed = true; }
    }
    for (let c = 0; c < lastCol; c++) {
      if (!numCols[c]||row[c]===""||row[c]===null||row[c]===undefined) continue;
      const n = _coerceNumber_(row[c]);
      if (!Number.isNaN(n) && String(row[c]) !== String(n)) { row[c] = n; changed = true; }
    }
    if (changed) updatedRows++;
  }

  const chunk = 400;
  for (let s = 0; s < data.length; s += chunk)
    dataSh.getRange(2+s,1,data.slice(s,s+chunk).length,lastCol).setValues(data.slice(s,s+chunk));

  invalidateCodeIndex_();
  buildCodeIndex_();
  try { runDataQualityScan(); } catch(e) {}

  SpreadsheetApp.getUi().alert("اصلاح کیفیت", `${updatedRows} ردیف اصلاح شد.`, SpreadsheetApp.getUi().ButtonSet.OK);
  return { ok:true, updated: updatedRows };
}

// =====================================================================
// REPORT
// =====================================================================

function getReportInit() {
  return {
    headers: DATA_HEADERS,
    init: getInitialData(),
    statusOptions: ["ورودی","تکمیل شده","ارسال شده به انبار محصول"],
    buOptions: ["رویال جین","بار مشتری","نیوکالکشن"],
    bvOptions: ["لارج","نرمال","ECO"]
  };
}

function _matchCond_(cell, op, v1, v2) {
  const raw = _toStr_(cell);
  const opN = String(op||"").toLowerCase();
  const s = _norm_(raw), a = _norm_(_toStr_(v1)), b = _norm_(_toStr_(v2));

  if (opN === "isempty")    return s === "";
  if (opN === "isnotempty") return s !== "";

  const isJDate = x => /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(String(x||"").trim());
  if (["gt","gte","lt","lte","between"].includes(opN) && isJDate(s) && isJDate(a)) {
    const S = s.replace(/-/g,"/"), A = a.replace(/-/g,"/"), B = b.replace(/-/g,"/");
    if (opN==="gt") return S>A; if (opN==="gte") return S>=A;
    if (opN==="lt") return S<A; if (opN==="lte") return S<=A;
    if (opN==="between") return (!A||S>=A)&&(!B||S<=B);
  }

  const sL = s.toLowerCase(), aL = a.toLowerCase();
  if (opN==="eq")          return s===a;
  if (opN==="neq")         return s!==a;
  if (opN==="contains")    return sL.includes(aL);
  if (opN==="notcontains") return !sL.includes(aL);
  if (opN==="startswith")  return sL.startsWith(aL);

  const nS = _toNum_(raw), nA = _toNum_(v1), nB = _toNum_(v2);
  if (!isNaN(nS)&&!isNaN(nA)) {
    if (opN==="numgt")      return nS>nA;
    if (opN==="numgte")     return nS>=nA;
    if (opN==="numlt")      return nS<nA;
    if (opN==="numlte")     return nS<=nA;
    if (opN==="numeq")      return nS===nA;
    if (opN==="numbetween") return nS>=nA&&(!isNaN(nB)?nS<=nB:true);
  }
  return true;
}

function getReportData(params) {
  const p  = params || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return { rows:[], total:0 };

  const lastRow = sh.getLastRow();
  const lastCol = DATA_HEADERS.length;
  const allData = sh.getRange(2,1,lastRow-1,lastCol).getValues();

  const from    = String(p.dateFrom||"").trim();
  const to      = String(p.dateTo  ||"").trim();
  const code    = _norm_(p.code    ||"");
  const name    = _norm_(p.name    ||"");
  const status  = _norm_(p.status  ||"");
  const bu      = _norm_(p.bu      ||"");
  const bv      = _norm_(p.bv      ||"");
  const filters = Array.isArray(p.filters) ? p.filters : [];

  const filtered = allData.filter(row => {
    // [FIX] تاریخ با _toStr_ برای تبدیل صحیح Date → جلالی
    const d = _toStr_(row[0]).trim();
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    if (code   && !_norm_(_toStr_(row[10])).includes(code))  return false;
    if (name   && !_norm_(_toStr_(row[1])).includes(name))   return false;
    if (status && _norm_(_toStr_(row[4])) !== status)        return false;
    if (bu     && _norm_(_toStr_(row[72])) !== bu)           return false;
    if (bv     && _norm_(_toStr_(row[73])) !== bv)           return false;
    for (const f of filters) {
      const idx = DATA_HEADERS.indexOf(f.col);
      if (idx < 0) continue;
      if (!_matchCond_(row[idx], f.op, f.v1, f.v2)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const page  = Math.max(1, parseInt(p.page||1, 10));
  const size  = Math.min(500, Math.max(1, parseInt(p.pageSize||100, 10)));
  const start = (page-1)*size;
  const cols  = Array.isArray(p.cols)&&p.cols.length
    ? p.cols.map(c => DATA_HEADERS.indexOf(c)).filter(i => i >= 0)
    : null;

  const pageData = filtered.slice(start, start+size).map((row, ri) => {
    const r = cols ? cols.map(i => asPlain_(row[i])) : row.map(asPlain_);
    r._rowIndex = start + ri + 2;
    return r;
  });

  return {
    rows: pageData, total, page, pageSize: size,
    totalPages: Math.ceil(total/size),
    headers: cols ? cols.map(i => DATA_HEADERS[i]) : DATA_HEADERS
  };
}

// =====================================================================
// REPORT PRESETS
// =====================================================================

function _getUserKey_() {
  try { const e=Session.getActiveUser().getEmail(); if(e) return e; } catch(e) {}
  return "anonymous";
}

function _ensurePresets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(REPORT_PRESETS_SHEET);
  if (!sh) sh = ss.insertSheet(REPORT_PRESETS_SHEET);
  if (sh.getLastRow()===0) {
    sh.appendRow(["id","name","user","isDefault","createdAt","updatedAt","configJson"]);
    sh.getRange(1,1,1,7).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function getReportPresets() {
  const sh = _ensurePresets_();
  const user = _getUserKey_();
  const lr = sh.getLastRow();
  if (lr < 2) return { presets:[], defaultId:"" };

  const rows = sh.getRange(2,1,lr-1,7).getValues();
  let defaultId=""; const presets=[];

  for (const r of rows) {
    const id=String(r[0]||"").trim(), name=String(r[1]||"").trim(),
          u=String(r[2]||"").trim()||"anonymous",
          isDef=String(r[3]||"").toLowerCase()==="true";
    if (!id||!name||u!==user) continue;
    presets.push({id,name,isDefault:isDef});
    if (isDef) defaultId=id;
  }

  presets.sort((a,b)=>{
    if (a.isDefault&&!b.isDefault) return -1;
    if (!a.isDefault&&b.isDefault) return 1;
    return a.name.localeCompare(b.name,"fa");
  });
  return {presets,defaultId};
}

function loadReportPreset(id) {
  const pid=String(id||"").trim();
  if (!pid) throw new Error("شناسه گزارش خالی است.");
  const sh=_ensurePresets_(), user=_getUserKey_(), lr=sh.getLastRow();
  if (lr<2) throw new Error("هیچ preset ذخیره نشده است.");
  const rows=sh.getRange(2,1,lr-1,7).getValues();
  for (const r of rows) {
    const rid=String(r[0]||"").trim(), u=String(r[2]||"").trim()||"anonymous";
    if (rid!==pid||u!==user) continue;
    let config={};
    try { config=JSON.parse(String(r[6]||"{}")||"{}"); } catch(e) {}
    return {id:rid,name:String(r[1]||"").trim(),config,isDefault:String(r[3]||"").toLowerCase()==="true"};
  }
  throw new Error("preset پیدا نشد.");
}

function saveReportPreset(preset) {
  const p=preset||{}, sh=_ensurePresets_(), user=_getUserKey_();
  let id=String(p.id||"").trim();
  const name=String(p.name||"").trim();
  if (!name) throw new Error("نام گزارش الزامی است.");
  const isDef=!!p.isDefault, cfg=JSON.stringify(p.config||{}), now=new Date();
  const lr=sh.getLastRow();

  if (id&&lr>=2) {
    const rows=sh.getRange(2,1,lr-1,7).getValues();
    for (let i=0;i<rows.length;i++) {
      const rid=String(rows[i][0]||"").trim(), u=String(rows[i][2]||"").trim()||"anonymous";
      if (rid===id&&u===user) {
        sh.getRange(i+2,1,1,7).setValues([[id,name,user,isDef,rows[i][4],now,cfg]]);
        if (isDef) _clearDefaults_(sh,id,user);
        return {ok:true,id};
      }
    }
  }

  id=id||"p_"+Date.now();
  sh.appendRow([id,name,user,isDef,now,now,cfg]);
  if (isDef) _clearDefaults_(sh,id,user);
  return {ok:true,id};
}

function _clearDefaults_(sh,keepId,user) {
  const lr=sh.getLastRow();
  if (lr<2) return;
  const rows=sh.getRange(2,1,lr-1,7).getValues();
  for (let i=0;i<rows.length;i++) {
    const rid=String(rows[i][0]||"").trim(), u=String(rows[i][2]||"").trim()||"anonymous";
    if (rid!==keepId&&u===user&&String(rows[i][3]||"").toLowerCase()==="true")
      sh.getRange(i+2,4).setValue("false");
  }
}

function deleteReportPreset(id) {
  const pid=String(id||"").trim();
  if (!pid) throw new Error("شناسه گزارش خالی است.");
  const sh=_ensurePresets_(), user=_getUserKey_(), lr=sh.getLastRow();
  if (lr<2) throw new Error("preset پیدا نشد.");
  const rows=sh.getRange(2,1,lr-1,7).getValues();
  for (let i=rows.length-1;i>=0;i--) {
    const rid=String(rows[i][0]||"").trim(), u=String(rows[i][2]||"").trim()||"anonymous";
    if (rid===pid&&u===user) { sh.deleteRow(i+2); return {ok:true}; }
  }
  throw new Error("preset پیدا نشد.");
}

// =====================================================================
// ON EDIT
// =====================================================================

function onEdit(e) {
  try {
    const range = e&&e.range;
    if (!range) return;
    const sh = range.getSheet();
    if (!sh||sh.getName()!==DATA_SHEET_NAME) return;
    const col = range.getColumn();
    if (col<=CODE_COL_1BASED&&(col+range.getNumColumns()-1)>=CODE_COL_1BASED)
      invalidateCodeIndex_();
  } catch(err) {}
}
