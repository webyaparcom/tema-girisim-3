/* eksen-konum-haritasi — Eksen Konum Haritası — iki eksenli alanda konumlanan seçenekler ve seçilenin kartı (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Dört bölgeli kare bir alan: yatay ve dikey eksenin iki ucunda etiketler (ör. Sakin ↔ Hareketli, Solo ↔ Eşli); her kayıt `x` · `y` (0–100) konumunda numaralı bir nokta ve adı. Nokta seçilince yandaki kart ad, rozet, metin ve iki eksen değerini çubukla gösterir. RTL'de yatay eksen aynalanır; dar ekranda yalnız seçilen noktanın adı yazılır. JS yokken tüm kartlar numaralı liste.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-eksen-konum-haritasi";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: eksen-konum-haritasi --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const ko = (i, ks) => { const t = x(i, ks); const n = Number(t.replace(",", ".")); return t !== "" && Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : NaN; };
    const L = { xe: metinAl(des, ["xEksenAd"]), ye: metinAl(des, ["yEksenAd"]), xb: metinAl(des, ["xBasAd"]), xs: metinAl(des, ["xSonAd"]), ya: metinAl(des, ["yAltAd"]), yu: metinAl(des, ["yUstAd"]) };
    const K = A.map((k, i) => ({ k, j: i, x: ko(i, ["x"]), y: ko(i, ["y"]), rz: x(i, ["rozet", "badge"]) }));
    const N = K.filter((z) => Number.isFinite(z.x) && Number.isFinite(z.y));
    const id = `${P}-{{id}}-kart`;
    const nokta = (z) => `<button type="button" class="${P}-nokta${z.x > 60 ? ` ${P}-nokta--ters` : ""}" style="inset-inline-start: ${z.x}%; inset-block-end: ${z.y}%" data-nokta="${z.j}" aria-pressed="false" aria-controls="${id}"><span class="${P}-nno" aria-hidden="true"><bdi>${sayiBicim(z.j + 1, 0)}</bdi></span><span class="${P}-netiket">${esc(z.k.baslik)}</span></button>`;
    const cubuk = (ad, v) => (ad && Number.isFinite(v) ? `<div class="${P}-olc"><dt>${esc(ad)}</dt><dd><span class="${P}-oyol"><span class="${P}-odolu" style="inline-size: ${v}%"></span></span></dd></div>` : "");
    const kart = (z) => `<article class="${P}-kart" data-kd="${z.j}"${Number.isFinite(z.x) && Number.isFinite(z.y) ? " data-konum" : ""}><div class="${P}-kbas"><span class="${P}-kno" aria-hidden="true"><bdi>${sayiBicim(z.j + 1, 0)}</bdi></span>${ikonH(z.k.ikon, `${P}-kik`)}<h3 class="${P}-kad">${z.k.url ? `<a class="${P}-bag" href="${esc(z.k.url)}">${esc(z.k.baslik)}</a>` : esc(z.k.baslik)}</h3>${z.rz ? `<span class="${P}-krozet">${esc(z.rz)}</span>` : ""}</div>${z.k.metin ? `<p class="${P}-kmetin">${satirlar(z.k.metin)}</p>` : ""}${cubuk(L.xe, z.x) || cubuk(L.ye, z.y) ? `<dl class="${P}-olcek">${cubuk(L.xe, z.x)}${cubuk(L.ye, z.y)}</dl>` : ""}</article>`;
    const alan = N.length ? `<div class="${P}-alan-kap"><div class="${P}-alan" role="group" aria-label="${esc([L.xe, L.ye].filter(Boolean).join(" × ") || B.baslik)}">${L.yu ? `<span class="${P}-uc ${P}-uc--ust" aria-hidden="true">${esc(L.yu)}</span>` : ""}${L.ya ? `<span class="${P}-uc ${P}-uc--alt" aria-hidden="true">${esc(L.ya)}</span>` : ""}${L.xb ? `<span class="${P}-uc ${P}-uc--bas" aria-hidden="true">${esc(L.xb)}</span>` : ""}${L.xs ? `<span class="${P}-uc ${P}-uc--son" aria-hidden="true">${esc(L.xs)}</span>` : ""}${N.map(nokta).join("")}</div></div>` : "";
    return `<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div><div class="${P}-duzen${alan ? "" : ` ${P}-duzen--liste`}">${alan}<div class="${P}-kartlar" id="${id}" aria-live="polite">${K.map(kart).join("")}</div></div>${ctaHtml()}`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
