/* ONE FOR ALL v3 — shared core (config, i18n, helpers) */
const CFG = {
  url: 'https://fvuowkqyrugygcrvkwwp.supabase.co',
  key: 'sb_publishable_iBRUEPugJshK4s5fytF7Tg_AUry3L7Z',
  wa: '213748221606', // public WhatsApp (contact). Admin login phone is separate (settings.admin_phones)
  aliasDomain: 'phone.oneforall.app',
};
const sb = window.supabase ? window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

/* ---------- i18n: key: [ar, fr, en] ---------- */
const T = {
  brand: ['ون فور أول', 'ONE FOR ALL', 'ONE FOR ALL'],
  tagline: ['وكالة تسويق رقمي', 'Agence marketing digital', 'Digital marketing agency'],
  login: ['تسجيل الدخول', 'Connexion', 'Log in'],
  register: ['إنشاء حساب', 'Créer un compte', 'Sign up'],
  logout: ['خروج', 'Déconnexion', 'Log out'],
  name: ['الاسم الكامل', 'Nom complet', 'Full name'],
  phone: ['رقم الهاتف', 'Téléphone', 'Phone number'],
  password: ['كلمة السر', 'Mot de passe', 'Password'],
  pw_hint: ['6 أحرف على الأقل', '6 caractères minimum', 'At least 6 characters'],
  have_acc: ['عندك حساب؟', 'Déjà un compte ?', 'Have an account?'],
  no_acc: ['ما عندكش حساب؟', 'Pas de compte ?', 'No account yet?'],
  or_wa: ['أو اطلب مباشرة عبر واتساب', 'ou commandez sur WhatsApp', 'or order on WhatsApp'],
  wa_order: ['اطلب عبر واتساب', 'Commander sur WhatsApp', 'Order on WhatsApp'],
  e_name: ['اكتب اسمك', 'Entrez votre nom', 'Enter your name'],
  e_phone: ['رقم الهاتف غير صحيح', 'Numéro invalide', 'Invalid phone number'],
  e_password: ['كلمة السر قصيرة', 'Mot de passe trop court', 'Password too short'],
  e_exists: ['هذا الرقم عنده حساب، سجّل الدخول', 'Ce numéro a déjà un compte', 'This number already has an account'],
  e_login: ['الرقم أو كلمة السر غير صحيحة', 'Numéro ou mot de passe incorrect', 'Wrong phone or password'],
  e_banned: ['الحساب موقوف، تواصل معنا', 'Compte suspendu, contactez-nous', 'Account suspended, contact us'],
  e_generic: ['صار خطأ، عاود المحاولة', 'Erreur, réessayez', 'Something went wrong, try again'],
  forgot: ['نسيت كلمة السر؟ راسلنا', 'Mot de passe oublié ? Écrivez-nous', 'Forgot password? Message us'],
  services: ['الخدمات', 'Services', 'Services'],
  my_orders: ['طلباتي', 'Mes commandes', 'My orders'],
  account: ['حسابي', 'Mon compte', 'Account'],
  order_now: ['اطلب الآن', 'Commander', 'Order now'],
  request_quote: ['اطلب عرض سعر', 'Demander un devis', 'Request a quote'],
  on_quote: ['حسب الطلب', 'Sur devis', 'On quote'],
  details: ['التفاصيل', 'Détails', 'Details'],
  package: ['الباقة', 'Formule', 'Package'],
  qty: ['الكمية', 'Quantité', 'Quantity'],
  total: ['المجموع', 'Total', 'Total'],
  confirm_order: ['تأكيد الطلب', 'Confirmer', 'Confirm order'],
  order_sent: ['تم إرسال طلبك', 'Commande envoyée', 'Order sent'],
  days: ['أيام', 'jours', 'days'],
  delivery: ['مدة التسليم', 'Délai', 'Delivery'],
  status: ['الحالة', 'Statut', 'Status'],
  pay_now: ['ادفع وارفع الوصل', 'Payer et envoyer le reçu', 'Pay & upload receipt'],
  pay_info: ['معلومات الدفع', 'Infos de paiement', 'Payment details'],
  upload_receipt: ['ارفع صورة الوصل', 'Envoyer le reçu', 'Upload receipt'],
  amount: ['المبلغ', 'Montant', 'Amount'],
  method: ['طريقة الدفع', 'Méthode', 'Method'],
  send: ['إرسال', 'Envoyer', 'Send'],
  save: ['حفظ', 'Enregistrer', 'Save'],
  cancel: ['إلغاء', 'Annuler', 'Cancel'],
  close: ['إغلاق', 'Fermer', 'Close'],
  delete: ['حذف', 'Supprimer', 'Delete'],
  edit: ['تعديل', 'Modifier', 'Edit'],
  add: ['إضافة', 'Ajouter', 'Add'],
  search: ['بحث…', 'Rechercher…', 'Search…'],
  comments: ['المحادثة', 'Discussion', 'Conversation'],
  write_msg: ['اكتب رسالة…', 'Écrire un message…', 'Write a message…'],
  files: ['الملفات', 'Fichiers', 'Files'],
  upload_file: ['رفع ملف', 'Envoyer un fichier', 'Upload file'],
  download: ['تحميل', 'Télécharger', 'Download'],
  progress: ['التقدم', 'Avancement', 'Progress'],
  accept_quote: ['قبول العرض', "Accepter l'offre", 'Accept quote'],
  cancel_order: ['إلغاء الطلب', 'Annuler la commande', 'Cancel order'],
  approve: ['موافق على التسليم', 'Valider la livraison', 'Approve delivery'],
  sure: ['متأكد؟', 'Vous êtes sûr ?', 'Are you sure?'],
  no_orders: ['ما عندك حتى طلب بعد', 'Aucune commande pour le moment', 'No orders yet'],
  browse: ['تصفح الخدمات', 'Voir les services', 'Browse services'],
  hello: ['مرحبا', 'Bonjour', 'Hello'],
  welcome_sub: ['اختر الخدمة لي تحتاجها واطلبها في دقيقة', 'Choisissez un service et commandez en une minute', 'Pick a service and order in a minute'],
  profile: ['معلوماتي', 'Mes infos', 'My details'],
  business: ['اسم النشاط', 'Activité', 'Business'],
  wilaya: ['الولاية', 'Wilaya', 'Province'],
  language: ['اللغة', 'Langue', 'Language'],
  change_pw: ['تغيير كلمة السر', 'Changer le mot de passe', 'Change password'],
  new_pw: ['كلمة السر الجديدة', 'Nouveau mot de passe', 'New password'],
  saved: ['تم الحفظ', 'Enregistré', 'Saved'],
  contact_us: ['تواصل معنا', 'Contactez-nous', 'Contact us'],
  paid_unlock: ['يتفعل التحميل بعد تأكيد الدفع', 'Téléchargement après confirmation du paiement', 'Download unlocks after payment is confirmed'],
  your_file: ['ملفك جاهز', 'Votre fichier est prêt', 'Your file is ready'],
  receipt_sent: ['تم إرسال الوصل، راح نأكده قريبا', 'Reçu envoyé, nous le vérifions', 'Receipt sent, we will verify it soon'],
  quote_wait: ['راح نبعثلك السعر قريبا', 'Nous vous envoyons le prix bientôt', 'We will send you the price soon'],
  payments: ['المدفوعات', 'Paiements', 'Payments'],
  date: ['التاريخ', 'Date', 'Date'],
  view_as: ['تشاهد كـ', 'Vue en tant que', 'Viewing as'],
  exit_view: ['رجوع للإدارة', "Retour à l'admin", 'Back to admin'],
  loading: ['جاري التحميل…', 'Chargement…', 'Loading…'],
  // statuses
  st_quote_requested: ['في انتظار السعر', 'Devis demandé', 'Quote requested'],
  st_quoted: ['السعر جاهز', 'Devis envoyé', 'Quoted'],
  st_pending_payment: ['في انتظار الدفع', 'En attente de paiement', 'Awaiting payment'],
  st_payment_review: ['نتحقق من الدفع', 'Paiement en vérification', 'Payment in review'],
  st_paid: ['مدفوع', 'Payé', 'Paid'],
  st_in_progress: ['قيد الإنجاز', 'En cours', 'In progress'],
  st_in_review: ['للمراجعة', 'À valider', 'In review'],
  st_delivered: ['تم التسليم', 'Livré', 'Delivered'],
  st_completed: ['مكتمل', 'Terminé', 'Completed'],
  st_cancelled: ['ملغى', 'Annulé', 'Cancelled'],
  st_refunded: ['مسترجع', 'Remboursé', 'Refunded'],
  pst_pending: ['قيد التحقق', 'En vérification', 'Pending'],
  pst_verified: ['مؤكد', 'Confirmé', 'Verified'],
  pst_rejected: ['مرفوض', 'Refusé', 'Rejected'],
  m_baridimob: ['بريدي موب', 'BaridiMob', 'BaridiMob'],
  m_ccp: ['CCP', 'CCP', 'CCP'],
  m_cash: ['نقدا', 'Espèces', 'Cash'],
  m_card: ['بطاقة', 'Carte', 'Card'],
  m_wallet: ['المحفظة', 'Portefeuille', 'Wallet'],
  m_other: ['أخرى', 'Autre', 'Other'],
};
const LANGS = ['ar', 'fr', 'en'];
let LANG = (() => { try { return localStorage.getItem('ofa_lang') } catch { return null } })() || 'ar';
if (!LANGS.includes(LANG)) LANG = 'ar';
const LI = () => LANGS.indexOf(LANG);
function t(k) { const v = T[k]; return v ? (v[LI()] || v[0]) : k; }
function tr(obj) { if (!obj) return ''; if (typeof obj === 'string') return obj; return obj[LANG] || obj.ar || obj.fr || obj.en || ''; }
function setLang(l) {
  LANG = l; try { localStorage.setItem('ofa_lang', l) } catch {}
  document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
}
setLang(LANG);

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => n == null || n === '' ? t('on_quote') : new Intl.NumberFormat(LANG === 'ar' ? 'ar-DZ' : LANG === 'fr' ? 'fr-DZ' : 'en-US', { maximumFractionDigits: 0 }).format(+n) + (LANG === 'ar' ? ' دج' : ' DA');
const fdate = d => d ? new Date(d).toLocaleDateString(LANG === 'ar' ? 'ar-DZ' : LANG === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const fdt = d => d ? new Date(d).toLocaleString(LANG === 'ar' ? 'ar-DZ' : LANG === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
const initials = s => (s || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

function normPhone(p) {
  let d = String(p || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0') && d.length === 10) d = '213' + d.slice(1);
  if (d.length === 9 && /^[567]/.test(d)) d = '213' + d;
  if (/^213[567]\d{8}$/.test(d)) return d;
  if (/^\d{8,15}$/.test(d) && !d.startsWith('213')) return d;
  return null;
}
const showPhone = p => p ? (p.startsWith('213') ? '0' + p.slice(3) : '+' + p) : '';
const waLink = (msg, phone = CFG.wa) => `https://wa.me/${phone}?text=${encodeURIComponent(msg || '')}`;

function toast(msg, bad) {
  let box = $('#toast'); if (!box) { box = document.createElement('div'); box.id = 'toast'; document.body.append(box); }
  const d = document.createElement('div'); d.textContent = msg; if (bad) d.className = 'bad'; box.append(d);
  setTimeout(() => d.remove(), 3200);
}
function modal(title, html, { wide } = {}) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" ${wide ? 'style="max-width:860px"' : ''}><div class="mh"><h3>${esc(title)}</h3><button class="btn icon sm ghost" data-close aria-label="${t('close')}">${ic('x')}</button></div><div class="mb">${html}</div></div>`;
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
  document.body.append(m); document.body.style.overflow = 'hidden';
  return m.querySelector('.mb');
}
function closeModal() { const m = $('#modal'); if (m) { m.id = ''; m.classList.add('out'); setTimeout(() => m.remove(), 220); } document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
async function busy(btn, fn) {
  if (btn) { btn.disabled = true; btn.dataset.l = btn.innerHTML; btn.innerHTML = '<span class="spin" style="margin:0;width:18px;height:18px;border-width:2px"></span>'; }
  try { return await fn(); }
  catch (e) { console.error(e); toast(errMsg(e), true); }
  finally { if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.l; } }
}
function errMsg(e) {
  const m = (e && (e.message || e.error_description || e.error)) || '';
  if (/banned/i.test(m)) return t('e_banned');
  if (/Invalid login/i.test(m)) return t('e_login');
  return m && m.length < 140 ? m : t('e_generic');
}

/* compress image client-side to save free storage */
async function compressImage(file, max = 1600, q = 0.82) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  try {
    const bmp = await createImageBitmap(file);
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', q));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }) : file;
  } catch { return file; }
}
const safeName = n => (n || 'file').normalize('NFKD').replace(/[^\w.\-]+/g, '_').slice(-80);
async function upload(bucket, path, file) {
  const f = await compressImage(file);
  const { error } = await sb.storage.from(bucket).upload(path, f, { upsert: false, contentType: f.type || undefined });
  if (error) throw error;
  return { path, size: f.size, name: f.name };
}
const publicUrl = path => sb.storage.from('public-media').getPublicUrl(path).data.publicUrl;
async function signedUrl(bucket, path, dl) {
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(path, 3600, dl ? { download: true } : undefined);
  if (error) throw error; return data.signedUrl;
}
function pickFile(accept = '*/*', multiple = false) {
  return new Promise(res => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = multiple;
    i.onchange = () => res(multiple ? [...i.files] : i.files[0]); i.click();
  });
}

/* ---------- icons (lucide-style, inline) ---------- */
const ICONS = {
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  bag: '<path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 5h14l3 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  wa: '<path d="M3 21l1.6-5A9 9 0 1 1 8 19.4z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-2-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-2z"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  star: '<path d="m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9L6.5 20l1-6.1L3 9.5l6.3-.9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  play: '<path d="M6 4l14 8-14 8z"/>',
  vol: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  full: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
};
const ic = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

function langSwitch(onChange) {
  return `<select class="in" style="width:auto;min-height:38px;padding:4px 10px;font-size:14px;border-radius:99px" aria-label="Language" onchange="setLang(this.value);(${onChange})()">${LANGS.map(l => `<option value="${l}" ${l === LANG ? 'selected' : ''}>${{ ar: 'العربية', fr: 'Français', en: 'English' }[l]}</option>`).join('')}</select>`;
}
function toggleTheme() {
  const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('ofa_theme', r.dataset.theme) } catch {}
}
try { const th = localStorage.getItem('ofa_theme'); if (th) document.documentElement.dataset.theme = th; } catch {}

/* run admin-provided HTML (custom sections) with scripts executed */
function mountHTML(el, html) { el.innerHTML = ''; try { el.append(document.createRange().createContextualFragment(html || '')); } catch (e) { console.error(e); } }

/* public settings cache */
async function publicSettings() {
  if (!sb) return {};
  const { data } = await sb.from('settings').select('key,value').eq('is_public', true);
  const o = {}; (data || []).forEach(r => o[r.key] = r.value); if (o.whatsapp) CFG.wa = o.whatsapp; return o;
}

/* ---------- motion: reveal-on-scroll (used by landing; CSS keeps content visible without JS) ---------- */
document.documentElement.classList.add('js');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rvIO = 'IntersectionObserver' in window && !REDUCED ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('shown'); setTimeout(() => e.target.classList.add('done'), 1300); rvIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
function reveal(root = document) { $$('.rv:not(.shown)', root).forEach(el => rvIO ? rvIO.observe(el) : el.classList.add('shown')); }

/* ---------- portfolio manager (extends admin.js "Site" section when an admin is signed in) ----------
   Videos/images go to public-media; each item: title, short description, service, poster, order, active. */
const ytId = u => (String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/) || [])[1] || null;
const PortfolioAdmin = {
  async open() {
    if (typeof loadProducts === 'function') await loadProducts();
    const { data } = await sb.from('portfolio').select('*').order('sort');
    this.items = data || [];
    const thumb = x => x.poster_url || (x.kind === 'image' ? x.media_url : '') || (ytId(x.media_url) ? `https://i.ytimg.com/vi/${ytId(x.media_url)}/hqdefault.jpg` : '');
    const body = modal(t('s_portfolio'), `
      <p class="small muted">${LANG === 'ar' ? 'أفضل حاجة: فيديوهات عمودية 9:16 (MP4 أقل من 50MB) أو رابط YouTube. يظهروا في صفحة الهبوط بنفس الترتيب.' : LANG === 'fr' ? 'Idéal : vidéos verticales 9:16 (MP4 < 50 Mo) ou lien YouTube, affichées dans cet ordre.' : 'Best: vertical 9:16 videos (MP4 under 50MB) or a YouTube link, shown in this order.'}</p>
      <div class="list" style="margin-bottom:14px">${this.items.map((x, i) => `<div class="li" style="cursor:default">
        ${thumb(x) ? `<img class="thumb" src="${esc(thumb(x))}" alt="">` : `<span class="thumb" style="display:grid;place-items:center">${ic(x.kind === 'image' ? 'image' : 'play')}</span>`}
        <div class="grow"><b class="small ell">${esc(tr(x.title) || '—')}</b><div class="tiny muted">${x.kind}${x.product_slug ? ' · ' + esc(x.product_slug) : ''}${x.active ? '' : ' · off'}</div></div>
        <button class="btn icon sm ghost" aria-label="up" onclick="PortfolioAdmin.move(${i},-1)" ${i ? '' : 'disabled'}>↑</button>
        <button class="btn icon sm ghost" aria-label="down" onclick="PortfolioAdmin.move(${i},1)" ${i < this.items.length - 1 ? '' : 'disabled'}>↓</button>
        <button class="btn sm" onclick="PortfolioAdmin.edit(${i})">${t('edit')}</button></div>`).join('') || `<p class="small faint">—</p>`}</div>
      <button class="btn pri block" onclick="PortfolioAdmin.edit()">${ic('plus')} ${t('add')}</button>`, { wide: true });
    return body;
  },
  async move(i, d) {
    const a = this.items[i], b = this.items[i + d]; if (!a || !b) return;
    await Promise.all([sb.from('portfolio').update({ sort: i + d + 1 }).eq('id', a.id), sb.from('portfolio').update({ sort: i + 1 }).eq('id', b.id)]);
    this.open();
  },
  edit(i) {
    const x = i != null ? this.items[i] : { kind: 'video', active: true, title: {}, description: {} };
    const prods = (typeof S !== 'undefined' && S.products) || [];
    const body = modal(i != null ? t('edit') : t('add'), `<form id="pfm">
      <div class="f"><label>${t('title')}</label><input name="title" value="${esc(tr(x.title))}" maxlength="80"></div>
      <div class="f"><label>${t('description')}</label><input name="desc" value="${esc(tr(x.description))}" maxlength="140"></div>
      <div class="f"><label>${LANG === 'ar' ? 'الخدمة' : 'Service'}</label><select name="slug"><option value="">—</option>${prods.map(p => `<option value="${p.slug}" ${p.slug === x.product_slug ? 'selected' : ''}>${esc(tr(p.name))}</option>`).join('')}</select></div>
      <div class="f"><label>${t('media')}</label><div class="row nowrap"><input name="url" class="in grow ltr" placeholder="https://… (MP4 / YouTube)" value="${esc(x.media_url || '')}"><button type="button" class="btn sm" id="pfmu">${ic('upload')}</button></div><small class="faint" id="pfmk">${x.kind}</small></div>
      <div class="f"><label>${LANG === 'ar' ? 'صورة الغلاف' : 'Poster'}</label><div class="row nowrap"><input name="poster" class="in grow ltr" placeholder="https://…" value="${esc(x.poster_url || '')}"><button type="button" class="btn sm" id="pfmp">${ic('image')}</button></div></div>
      <label class="check" style="margin-bottom:12px"><input type="checkbox" name="active" ${x.active !== false ? 'checked' : ''}> ${t('active')}</label>
      <div class="row"><button class="btn pri grow">${t('save')}</button>${i != null ? `<button type="button" class="btn danger" id="pfmd">${t('delete')}</button>` : ''}<button type="button" class="btn ghost" onclick="PortfolioAdmin.open()">${t('cancel')}</button></div></form>`);
    const f = $('#pfm', body); let kind = x.kind || 'video';
    const setKind = u => { kind = ytId(u) || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u) ? 'video' : /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u) ? 'image' : (u ? 'link' : kind); $('#pfmk', body).textContent = kind; };
    f.url.oninput = () => setKind(f.url.value.trim());
    const up = async (accept, cb, btn) => { const fl = await pickFile(accept); if (!fl) return; await busy(btn, async () => { const path = `portfolio/${Date.now()}-${safeName(fl.name)}`; await upload('public-media', path, fl); cb(publicUrl(path), fl); }); };
    $('#pfmu', body).onclick = e => up('video/*,image/*', (u, fl) => { f.url.value = u; kind = fl.type.startsWith('video') ? 'video' : 'image'; $('#pfmk', body).textContent = kind; }, e.currentTarget);
    $('#pfmp', body).onclick = e => up('image/*', u => f.poster.value = u, e.currentTarget);
    f.onsubmit = async e => {
      e.preventDefault(); const d = Object.fromEntries(new FormData(f)); if (!d.url) return toast(t('media'), true); setKind(d.url.trim());
      const row = { title: { ar: d.title, fr: d.title, en: d.title }, description: d.desc ? { ar: d.desc, fr: d.desc, en: d.desc } : null, product_slug: d.slug || null, media_url: d.url.trim(), poster_url: d.poster.trim() || null, kind, active: !!d.active };
      await busy(e.submitter, async () => {
        const r = i != null ? await sb.from('portfolio').update(row).eq('id', x.id) : await sb.from('portfolio').insert({ ...row, sort: this.items.length + 1 });
        if (r.error) throw r.error; toast(t('saved')); this.open();
      });
    };
    const del = $('#pfmd', body); if (del) del.onclick = async () => { if (!confirm(t('sure'))) return; await sb.from('portfolio').delete().eq('id', x.id); this.open(); };
  },
};
/* when admin.js registers window.Admin, route its portfolio buttons to the manager above */
(() => {
  let A; try {
    Object.defineProperty(window, 'Admin', { configurable: true, get: () => A, set: v => {
      A = v; if (!v) return;
      v.addPortfolio = () => PortfolioAdmin.open();
      const site = v.site.bind(v);
      v.site = async (...a) => { await site(...a); const box = $$('#page .upl').pop(); if (box) { box.style.cursor = 'pointer'; box.onclick = e => { if (!e.target.closest('button')) PortfolioAdmin.open(); }; } };
    } });
  } catch (e) { console.error(e); }
})();
