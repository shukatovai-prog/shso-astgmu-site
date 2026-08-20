/**
 * Вставьте этот код в Apps Script, созданный ИЗ Google Таблицы:
 * Расширения → Apps Script.
 * Затем: Развернуть → Новое развертывание → Веб-приложение.
 * Выполнять как: Я. Доступ: Все.
 * URL веб-приложения вставьте в data.js → site.joinEndpoint.
 */
const SHEET_NAME = 'Заявки на вступление';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow([
        'Дата отправки','ФИО','Дата рождения','Курс',
        'Телефон','VK / Telegram','Отряд','Комментарий','Согласие'
      ]);
      sh.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');

    sh.appendRow([
      new Date(),
      data.fio || '',
      data.birthdate || '',
      data.course || '',
      data.phone || '',
      data.social || '',
      data.team || '',
      data.comment || '',
      data.consent || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ok:true,service:'SHSO join form'}))
    .setMimeType(ContentService.MimeType.JSON);
}