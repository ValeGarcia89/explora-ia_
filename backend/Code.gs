/** EXPLORA IA – backend en Google Apps Script (pegar en Extensiones → Apps Script de una Hoja de cálculo). */
const CARPETA_ID = "PEGA_AQUI_EL_ID_DE_LA_CARPETA_DE_DRIVE";
const MAX_BYTES = 30 * 1024 * 1024;
const COLS = ["fecha","codigo","clase","equipo (nombre heroico)","participantes reales (solo visible para ti)","titulo","descripcion","aprendi","enlaces","publicada","archivos (json)","OCULTAR (escribe SI para quitarla de la galería)"];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("Entregas");
  if (!sh) { sh = ss.insertSheet("Entregas"); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}
function carpeta_(code) {
  const raiz = DriveApp.getFolderById(CARPETA_ID), it = raiz.getFoldersByName(code);
  return it.hasNext() ? it.next() : raiz.createFolder(code);
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function t_(s) { s = String(s || "").slice(0, 600); return /^[=+\-@]/.test(s) ? "'" + s : s; }

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents), code = String(d.code || "");
    if (!/^EXP-C[1-4]-[A-Z0-9]{4}$/.test(code)) return json_({ ok: false, error: "código inválido" });
    if (d.op === "file") {
      const bytes = Utilities.base64Decode(d.data || "");
      if (bytes.length > MAX_BYTES) return json_({ ok: false, error: "archivo muy grande" });
      const nombre = String(d.name || "archivo").replace(/[\\\/:*?"<>|]/g, "_").slice(0, 120);
      const f = carpeta_(code).createFile(Utilities.newBlob(bytes, d.type || "application/octet-stream", nombre));
      return json_({ ok: true, id: f.getId() });
    }
    if (d.op === "meta") {
      const lock = LockService.getScriptLock(); lock.waitLock(20000);
      try {
        hoja_().appendRow([d.fecha, code, +d.n || "", t_((d.team || []).join(" · ")), t_((d.reales || []).join(" · ")),
          t_(d.titulo), t_(d.desc), t_(d.aprendi), t_((d.links || []).join(" ")), "SI",
          JSON.stringify(d.files || []), ""]);
      } finally { lock.releaseLock(); }
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "operación desconocida" });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== "gallery") return json_({ ok: true, msg: "EXPLORA IA activo" });
  const v = hoja_().getDataRange().getValues(), items = [];
  for (let i = 1; i < v.length; i++) {
    const r = v[i];
    if (String(r[11]).trim().toUpperCase() === "SI") continue;
    let files = []; try { files = JSON.parse(r[10]); } catch (x) {}
    files = files.filter(f => /^[\w-]+$/.test(f.id)).map(f => {
      try { const a = DriveApp.getFileById(f.id);
        if (a.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) a.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (x) {}
      return { id: f.id, name: f.name, type: f.type };
    });
    items.push({ code: r[1], n: r[2], team: String(r[3]).split(" · "), titulo: r[5], desc: r[6], aprendi: r[7],
      links: String(r[8]).split(/\s+/).filter(Boolean), files });
  }
  return json_({ ok: true, items: items.reverse() });
}
