/* client-pages.js - client dashboard: links to the service pages (video / web / ads / store) on the services screen,
   and store deep links app.html#/p/<slug>/<variantId> that open the order sheet with that package already picked
   (also after sign-in / sign-up). Additive: wraps renderAuth and viewServices from app.js.
   Admin: adds the ads accounts page texts form to «صفحات الخدمات» > «نصوص الصفحات» (wraps Admin.pages from pages-admin.js). */
(function () {
  var L = function (ar, fr, en) { return [ar, fr, en][['ar', 'fr', 'en'].indexOf(LANG)] || ar; };
  var CARDS = [
    { h: 'video.html', i: 'play', c: '#0FAA60', t: function () { return L('فيديوهات', 'Vidéos', 'Videos'); }, s: function () { return L('موشن، كرياتيفز وشركات', 'Motion, créas, corporate', 'Motion, creatives, corporate'); } },
    { h: 'web.html', i: 'globe', c: '#2D5FA8', t: function () { return L('صفحات هبوط ومتاجر', 'Landing pages et boutiques', 'Landing pages & stores'); }, s: function () { return L('تصفح تصاميمنا', 'Voir nos designs', 'Browse our designs'); } },
    { h: 'ads.html', i: 'chart', c: '#FE2C55', t: function () { return L('حسابات الإعلانات', 'Comptes publicitaires', 'Ad accounts'); }, s: function () { return L('تيك توك أدس وفايسبوك أدس', 'TikTok Ads et Facebook Ads', 'TikTok Ads & Facebook Ads'); } },
    { h: 'store.html', i: 'bag', c: '#B4610A', t: function () { return L('المتجر الرقمي', 'Boutique digitale', 'Digital store'); }, s: function () { return L('اشتراكات وحسابات', 'Abonnements et comptes', 'Subscriptions & accounts'); } }
  ];
  function strip() {
    return '<div class="xpl" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:16px">' + CARDS.map(function (c) {
      return '<a class="card click" href="' + c.h + '" style="display:flex;gap:12px;align-items:center;padding:14px;text-decoration:none;color:inherit">'
        + '<span style="flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,' + c.c + ',color-mix(in srgb,' + c.c + ' 60%,#000))">' + ic(c.i) + '</span>'
        + '<span style="min-width:0"><b style="display:block">' + esc(c.t()) + '</b><small class="muted">' + esc(c.s()) + '</small></span></a>';
    }).join('') + '</div>';
  }
  function patch() {
    if (typeof viewServices !== 'function' || typeof renderAuth !== 'function' || window._cpg) return !!window._cpg;
    window._cpg = true;
    var ra = renderAuth;
    renderAuth = function (mode, slug) {
      var m = location.hash.match(/^#\/p\/([\w-]+)\/([\w-]+)/);
      return ra.call(this, mode, m ? m[1] + '/' + m[2] : slug);
    };
    var vs = viewServices;
    viewServices = async function (openSlug) {
      await vs.apply(this, arguments);
      try {
        var pg = document.getElementById('page');
        if (pg && !pg.querySelector('.xpl')) { var hi = pg.firstElementChild; if (hi) hi.insertAdjacentHTML('afterend', strip()); }
        var m = location.hash.match(/^#\/p\/([\w-]+)\/([\w-]+)/);
        if (openSlug && m) {
          var r = document.querySelector('#of input[name=variant][value="' + m[2] + '"]');
          if (r && r.type === 'radio') { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); var lb = r.closest('label'); if (lb) lb.scrollIntoView({ block: 'nearest' }); }
        }
      } catch (e) { }
    };
    return true;
  }
  if (!patch()) { var iv = setInterval(function () { if (patch()) clearInterval(iv); }, 200); setTimeout(function () { clearInterval(iv); }, 30000); }

  /* ---------- admin: ads page texts (site_content "pages" > ads) ---------- */
  var ADS_F = [['eyebrow', 'الشارة الصغيرة'], ['title', 'العنوان الكبير (*كلمة* = ملونة)'], ['sub', 'الوصف']];
  var ADS_S = [['ads_tiktok', 'تيك توك أدس'], ['ads_meta', 'فايسبوك أدس']];
  var o3 = function (ar, fr, en) { ar = (ar || '').trim(); return ar ? { ar: ar, fr: (fr || '').trim() || ar, en: (en || '').trim() || ar } : null; };
  function trio(name, val, area) {
    val = val || {};
    return ['ar', 'fr', 'en'].map(function (l) { var v = esc(val[l] == null ? '' : val[l]); return '<div class="f"' + (l === 'ar' ? '' : ' data-x') + '><label>' + l.toUpperCase() + '</label>' + (area ? '<textarea rows="2" name="' + name + '_' + l + '">' + v + '</textarea>' : '<input name="' + name + '_' + l + '" value="' + v + '">') + '</div>'; }).join('');
  }
  var leg = function (s) { return '<legend class="small" style="font-weight:700;margin-bottom:6px">' + s + '</legend>'; };
  function adsForm(grid) {
    if (!grid || grid.querySelector('form[data-pg=ads]')) return;
    var pc = ((window.Admin || {})._pc || {}).ads || {}, sec = pc.sections || {};
    var html = '<form class="card" data-pg="ads"><h3>صفحة حسابات الإعلانات</h3>'
      + ADS_F.map(function (f) { return '<fieldset style="border:0;padding:0;margin:0 0 6px">' + leg(f[1]) + trio(f[0], pc[f[0]], f[0] === 'sub') + '</fieldset>'; }).join('')
      + ADS_S.map(function (s) { var cs = sec[s[0]] || {}; return '<fieldset style="border:0;padding:0;margin:8px 0 6px">' + leg('قسم: ' + s[1]) + trio('st.' + s[0], cs.title) + trio('ss.' + s[0], cs.sub, true) + '<label class="small muted" style="display:block;margin:4px 0">المميزات (كل سطر ميزة)</label>' + trio('sf.' + s[0], cs.feat, true) + '</fieldset>'; }).join('')
      + '<button class="btn pri block">' + t('save') + '</button></form>';
    var st = grid.querySelector('form[data-pg=store]'); st ? st.insertAdjacentHTML('beforebegin', html) : grid.insertAdjacentHTML('beforeend', html);
    var f = grid.querySelector('form[data-pg=ads]');
    f.onsubmit = async function (e) {
      e.preventDefault(); var d = Object.fromEntries(new FormData(f));
      var get = function (n) { return o3(d[n + '_ar'], d[n + '_fr'], d[n + '_en']); };
      await busy(e.submitter, async function () {
        var r = await sb.from('site_content').select('value').eq('key', 'pages').maybeSingle(); var c = (r.data && r.data.value) || {};
        var p = c.ads || {};
        ADS_F.forEach(function (x) { var v = get(x[0]); if (v) p[x[0]] = v; else delete p[x[0]]; });
        p.sections = p.sections || {};
        ADS_S.forEach(function (s) {
          var cs = p.sections[s[0]] || {};
          [['title', 'st.'], ['sub', 'ss.'], ['feat', 'sf.']].forEach(function (k) { var v = get(k[1] + s[0]); if (v) cs[k[0]] = v; else delete cs[k[0]]; });
          if (Object.keys(cs).length) p.sections[s[0]] = cs; else delete p.sections[s[0]];
        });
        c.ads = p; var w = await sb.from('site_content').upsert({ key: 'pages', value: c }); if (w.error) throw w.error;
        if (window.Admin) Admin._pc = c; toast(t('saved'));
      });
    };
  }
  function adminPatch() {
    var A = window.Admin; if (!A || !A._pages || typeof A.pages !== 'function') return false; if (A._adsTxt) return true; A._adsTxt = true;
    var p0 = A.pages;
    A.pages = async function (tab) {
      var r = await p0.apply(this, arguments);
      if (tab === 'texts') try { adsForm(document.querySelector('#page .grid.g2')); } catch (e) { console.error(e); }
      return r;
    };
    // the texts tab may already be on screen (opened directly by its link)
    var n = 0, ti = setInterval(function () { var g = /^#\/a\/pages\/texts/.test(location.hash) && document.querySelector('#page .grid.g2'); if (g) adsForm(g); if (g || ++n > 20) clearInterval(ti); }, 400);
    return true;
  }
  if (!adminPatch()) { var ia = setInterval(function () { if (adminPatch()) clearInterval(ia); }, 300); setTimeout(function () { clearInterval(ia); }, 60000); }
})();
