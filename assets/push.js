/* push.js — Web Push opt-in (client: order updates; admin: new orders/receipts). Subscription is stored via rpc push_subscribe; sending happens server-side. */
(function () {
  var ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  var synced = false;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function b64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); s += '==='.slice((s.length + 3) % 4); var r = atob(s), a = new Uint8Array(r.length); for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  function ready() { return typeof S !== 'undefined' && S.me && typeof sb !== 'undefined' && !S.viewAs; }
  function admin() { try { return isAdmin(); } catch (e) { return false; } }

  async function subscribe(ask) {
    if (!ok || !ready()) return false;
    if (ask) { var p = await Notification.requestPermission(); if (p !== 'granted') return false; }
    if (Notification.permission !== 'granted') return false;
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.getSubscription();
    if (!sub) {
      var k = await sb.from('settings').select('value').eq('key', 'push_vapid_public').maybeSingle();
      var key = k.data && (typeof k.data.value === 'string' ? k.data.value : String(k.data.value)); if (!key) return false;
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
    }
    var j = sub.toJSON();
    var r = await sb.rpc('push_subscribe', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_ua: navigator.userAgent.slice(0, 200) });
    if (r.error) throw r.error;
    synced = true; return true;
  }
  window.ofaPush = async function (btn) {
    try {
      var on = await subscribe(true);
      var c = document.getElementById('pushcard'); if (c) c.remove();
      if (typeof toast === 'function') toast(on ? 'الإشعارات مفعّلة ✓' : 'ما تفعّلتش. تقدر تفعّلها من إعدادات المتصفح', !on);
    } catch (e) { console.error(e); if (typeof toast === 'function') toast('ما قدرناش نفعّل الإشعارات', true); }
  };
  window.ofaPushX = function () { ls('ofa_push_x', String(Date.now())); var c = document.getElementById('pushcard'); if (c) c.remove(); };

  function card() {
    if (!ready() || document.getElementById('pushcard')) return;
    var pg = document.getElementById('page'); if (!pg || pg.querySelector('.spin:only-child')) return;
    var h = location.hash || '';
    var where = admin() ? /^#\/a\/(dash)?$/.test(h) : /^#\/(orders|account)?$/.test(h);
    if (!where) return;
    var x = +(ls('ofa_push_x') || 0); if (Date.now() - x < 7 * 864e5) return;
    var txt = admin() ? 'يوصلك تنبيه في الهاتف كي يجي طلب جديد أو وصل دفع' : 'يوصلك خبر في الهاتف كي يتبدل طلبك أو يكون جاهز';
    var html;
    if (ok && Notification.permission === 'default') html = '<div class="grow"><b>فعّل الإشعارات</b><div class="small muted">' + txt + '</div></div><button class="btn pri sm" onclick="ofaPush(this)">تفعيل</button>';
    else if (!ok && ios && !standalone) html = '<div class="grow"><b>باش توصلك الإشعارات</b><div class="small muted">ثبّت التطبيق: زر المشاركة ثم "إضافة إلى الشاشة الرئيسية"، ومن بعد افتحو من الأيقونة</div></div>';
    else return;
    var el = document.createElement('div'); el.id = 'pushcard'; el.className = 'card row'; el.style.cssText = 'gap:12px;margin-bottom:12px;align-items:center';
    el.innerHTML = html + '<button class="btn icon sm ghost" aria-label="إغلاق" onclick="ofaPushX()">×</button>';
    var after = pg.querySelector('.today, .nx'); if (after) after.after(el); else pg.prepend(el);
  }
  setInterval(function () {
    if (!ready()) return;
    if (ok && !synced && Notification.permission === 'granted') { synced = true; subscribe(false).catch(function () { }); }
    card();
  }, 1500);
})();
