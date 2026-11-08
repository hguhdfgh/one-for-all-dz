/* pages-admin.js — admin: "صفحات الخدمات" (videos per category, web designs, page texts) and "المتجر الرقمي"
   (digital products with durations / packages). Chains onto window.Admin like ops.js / life.js.
   Data: portfolio.section + portfolio.meta, products.meta, product_variants.meta, site_content key "pages". */
(function () {
  var SECS = {
    video: [['video_motion', 'موشن غرافيكس'], ['video_ecom', 'كرياتيفز المنتجات'], ['video_corporate', 'فيديوهات الشركات']],
    web: [['web_landing', 'صفحات الهبوط'], ['web_store', 'المتاجر الإلكترونية']]
  };
  var ALL = SECS.video.concat(SECS.web);
  var secName = function (k) { var s = ALL.filter(function (x) { return x[0] === k; })[0]; return s ? s[1] : k; };
  var STORE_CATS = ['subs', 'accounts', 'ai', 'design', 'tools', 'games', 'courses', 'digital', 'other'];
  var CAT_AR = { subs: 'اشتراكات', accounts: 'حسابات', ai: 'ذكاء اصطناعي', design: 'تصميم', tools: 'أدوات', games: 'ألعاب', courses: 'دورات', digital: 'رقمي', other: 'أخرى' };
  var L3 = ['ar', 'fr', 'en'];
  var a = function (s) { return esc(s == null ? '' : s); };
  var o3 = function (ar, fr, en) { ar = (ar || '').trim(); return ar ? { ar: ar, fr: (fr || '').trim() || ar, en: (en || '').trim() || ar } : null; };
  var noMeta = function (e) { return e && /meta|section/.test(e.message || '') && /column|schema/i.test(e.message || ''); };
  var MIG = 'قاعدة البيانات تحتاج تحديث صغير (أعمدة section و meta) قبل الحفظ. اطلب من Claude يطبقو.';
  function fail(e) { if (noMeta(e)) throw new Error(MIG); throw e; }

  /* ---------- media helpers ---------- */
  // a frame of the video as poster (webp), so the reel shows something before playing
  function videoPoster(file) {
    return new Promise(function (res) {
      try {
        var v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = URL.createObjectURL(file);
        var done = function (b) { URL.revokeObjectURL(v.src); res(b); };
        v.onloadeddata = function () { v.currentTime = Math.min(1, (v.duration || 2) / 3); };
        v.onseeked = function () { try { var s = Math.min(1, 720 / Math.max(v.videoWidth, v.videoHeight)); var c = document.createElement('canvas'); c.width = Math.round(v.videoWidth * s); c.height = Math.round(v.videoHeight * s); c.getContext('2d').drawImage(v, 0, 0, c.width, c.height); c.toBlob(done, 'image/webp', 0.8); } catch (e) { done(null); } };
        v.onerror = function () { done(null); }; setTimeout(function () { done(null); }, 15000);
      } catch (e) { res(null); }
    });
  }
  // long design screenshots: keep full height, cap the width (phone 1080 / desktop 1600), plus a thumbnail of the top
  async function prepDesign(file, desktop) {
    var out = { full: file, thumb: null };
    try {
      var bmp = await createImageBitmap(file); var maxW = desktop ? 1600 : 1080;
      var s = Math.min(1, maxW / bmp.width), w = Math.round(bmp.width * s), h = Math.round(bmp.height * s);
      if (w * h <= 16e6 && h <= 16000) {
        var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(bmp, 0, 0, w, h);
        var b = await new Promise(function (r) { c.toBlob(r, 'image/webp', 0.86); });
        if (b && b.size < file.size) out.full = new File([b], safeName(file.name).replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' });
      }
      var tw = 480, th = Math.round(tw * (desktop ? 0.66 : 1.4)), k = tw / bmp.width;
      var t = document.createElement('canvas'); t.width = tw; t.height = th; t.getContext('2d').drawImage(bmp, 0, 0, bmp.width, Math.min(bmp.height, th / k), 0, 0, tw, Math.min(th, bmp.height * k));
      out.thumb = await new Promise(function (r) { t.toBlob(r, 'image/webp', 0.8); });
    } catch (e) { }
    return out;
  }
  async function putPublic(path, blobOrFile, type) {
    var r = await sb.storage.from('public-media').upload(path, blobOrFile, { upsert: false, contentType: type || blobOrFile.type || undefined });
    if (r.error) throw r.error; return publicUrl(path);
  }
  async function getContent() { var r = await sb.from('site_content').select('value').eq('key', 'pages').maybeSingle(); return (r.data && r.data.value) || {}; }
  async function setContent(v) { var r = await sb.from('site_content').upsert({ key: 'pages', value: v }); if (r.error) throw r.error; }

  function patch() {
    var A = window.Admin; if (!A) return false; if (A._pages) return true; A._pages = true;
    var nav0 = A.nav.bind(A), route0 = A.route.bind(A);
    A.nav = function () {
      var n = nav0(); var i = n.findIndex(function (x) { return x.k === 'products'; });
      n.splice(i < 0 ? n.length : i + 1, 0, { k: 'store', h: '#/a/store', i: 'bag', l: 'المتجر الرقمي' }, { k: 'pages', h: '#/a/pages', i: 'grid', l: 'صفحات الخدمات' });
      return n;
    };
    A.route = function (b, c) { if (b === 'pages') return A.pages(c); if (b === 'store') return A.store(c); return route0(b, c); };

    /* =================== صفحات الخدمات =================== */
    A.pages = async function (tab) {
      tab = tab || 'video';
      var pg = A.sh('pages', 'صفحات الخدمات', '<div class="spin"></div>');
      var r = await Promise.all([sb.from('portfolio').select('*').order('sort'), getContent()]);
      A._pf = (r[0].data || []); A._pc = r[1] || {};
      var hasCol = !A._pf.length || 'section' in A._pf[0];
      var tabs = [['video', 'فيديوهات'], ['web', 'تصاميم الويب'], ['texts', 'نصوص الصفحات']];
      var head = '<div class="row between" style="margin-bottom:14px"><div class="seg" style="flex:1;max-width:520px">' + tabs.map(function (t) { return '<button class="' + (t[0] === tab ? 'on' : '') + '" onclick="go(\'#/a/pages/' + t[0] + '\')">' + t[1] + '</button>'; }).join('') + '</div>'
        + '<div class="row"><a class="btn sm" href="' + (tab === 'web' ? 'web' : tab === 'texts' ? 'video' : 'video') + '.html" target="_blank" rel="noopener">' + ic('eye') + ' شوف الصفحة</a></div></div>'
        + (hasCol ? '' : '<div class="card" style="border-color:var(--warn);margin-bottom:14px"><b>' + MIG + '</b></div>');
      if (tab === 'texts') { pg.innerHTML = head + textsHTML(); wireTexts(pg); return; }
      var pageKey = tab === 'web' ? 'web' : 'video';
      pg.innerHTML = head + '<div class="col" style="gap:14px">' + SECS[pageKey].map(function (s) {
        var items = A._pf.filter(function (x) { return x.section === s[0]; });
        var cs = ((A._pc[pageKey] || {}).sections || {})[s[0]] || {};
        return '<div class="card"><div class="row between" style="margin-bottom:10px"><div><h3 style="margin:0">' + a((cs.title && cs.title.ar) || s[1]) + ' <span class="chip">' + items.length + '</span></h3>'
          + '<div class="tiny muted">' + (cs.active === false ? 'مخفي من الصفحة' : 'ظاهر في الصفحة') + '</div></div>'
          + '<div class="row"><button class="btn sm" onclick="Admin.pgSecToggle(\'' + pageKey + '\',\'' + s[0] + '\',this)">' + (cs.active === false ? 'إظهار' : 'إخفاء') + '</button>'
          + '<button class="btn pri sm" onclick="Admin.pgItem(null,\'' + s[0] + '\')">' + ic('plus') + ' ' + (pageKey === 'web' ? 'تصميم' : 'فيديو') + '</button></div></div>'
          + (items.length ? '<div class="list">' + items.map(function (x, i) {
            var th = x.poster_url || (x.kind === 'image' ? x.media_url : '') || (ytId(x.media_url) ? 'https://i.ytimg.com/vi/' + ytId(x.media_url) + '/hqdefault.jpg' : '');
            var m = x.meta || {};
            return '<div class="li" style="cursor:default">' + (th ? '<img class="thumb" src="' + a(th) + '" alt="" style="object-fit:cover;object-position:top">' : '<span class="thumb" style="display:grid;place-items:center">' + ic('play') + '</span>')
              + '<div class="grow" style="min-width:0"><b class="small ell">' + a(tr(x.title) || '—') + '</b><div class="tiny muted">' + [m.client, m.device === 'desktop' ? 'حاسوب' : (pageKey === 'web' ? 'هاتف' : ''), m.home ? 'في الرئيسية' : '', x.active ? '' : 'مخفي'].filter(Boolean).map(a).join(' · ') + '</div></div>'
              + '<button class="btn icon sm ghost" aria-label="up" onclick="Admin.pgMove(\'' + s[0] + '\',' + i + ',-1)" ' + (i ? '' : 'disabled') + '>↑</button>'
              + '<button class="btn icon sm ghost" aria-label="down" onclick="Admin.pgMove(\'' + s[0] + '\',' + i + ',1)" ' + (i < items.length - 1 ? '' : 'disabled') + '>↓</button>'
              + '<button class="btn sm" onclick="Admin.pgItem(\'' + x.id + '\')">' + t('edit') + '</button></div>';
          }).join('') + '</div>' : '<p class="small faint" style="margin:0">ما زال ما زدت والو هنا. اضغط «+» وارفع ' + (pageKey === 'web' ? 'صورة التصميم كاملة (لقطة طويلة للصفحة)' : 'فيديو أو حط رابط') + '.</p>')
          + '</div>';
      }).join('') + (pageKey === 'video' ? '<p class="small muted">الأعمال لي في «أعمالي» (بلا قسم) تبقى في الصفحة الرئيسية فقط. أي فيديو هنا تقدر تظهرو حتى في الرئيسية بخيار «يظهر في الرئيسية».</p>' : '<p class="small muted">أحسن حاجة: لقطة شاشة كاملة للصفحة (Full page screenshot) بعرض الهاتف 390 إلى 430 بكسل أو بعرض الحاسوب 1440. الصورة تتصغر وحدها وتتعمل لها صورة مصغرة.</p>') + '</div>';
    };
    A.pgSecToggle = async function (pageKey, key, btn) {
      await busy(btn, async function () {
        var c = await getContent(); c[pageKey] = c[pageKey] || {}; c[pageKey].sections = c[pageKey].sections || {};
        var s = c[pageKey].sections[key] = c[pageKey].sections[key] || {}; s.active = s.active === false ? true : false;
        await setContent(c); toast(t('saved')); route();
      });
    };
    A.pgMove = async function (sec, i, d) {
      var items = A._pf.filter(function (x) { return x.section === sec; }); var x = items[i], y = items[i + d]; if (!x || !y) return;
      var sx = x.sort, sy = y.sort; if (sx === sy) { sx = i; sy = i + d; }
      await Promise.all([sb.from('portfolio').update({ sort: sy }).eq('id', x.id), sb.from('portfolio').update({ sort: sx }).eq('id', y.id)]); route();
    };
    A.pgItem = function (id, sec) {
      var x = id ? A._pf.filter(function (p) { return p.id === id; })[0] : { section: sec, active: true, kind: sec && sec.indexOf('web') === 0 ? 'image' : 'video', title: {}, description: {}, meta: { device: 'mobile' } };
      if (!x) return; var m = x.meta || {}; var web = (x.section || '').indexOf('web') === 0;
      var st = { media: x.media_url || '', poster: x.poster_url || '', kind: x.kind };
      var body = modal(id ? 'تعديل' : (web ? 'تصميم جديد' : 'فيديو جديد'), '<form id="pgf">'
        + '<div class="f"><label>القسم</label><select name="section">' + ALL.filter(function (s) { return (s[0].indexOf('web') === 0) === web; }).map(function (s) { return '<option value="' + s[0] + '" ' + (s[0] === x.section ? 'selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></div>'
        + '<div class="f"><label>العنوان</label><input name="t_ar" value="' + a(x.title && x.title.ar) + '" maxlength="80" required></div>'
        + '<div class="f"><label>وصف قصير</label><input name="d_ar" value="' + a(x.description && x.description.ar) + '" maxlength="140"></div>'
        + '<details style="margin-bottom:12px"><summary class="small muted" style="cursor:pointer">الفرنسية والإنجليزية (اختياري)</summary><div class="grid g2" style="gap:0 12px;margin-top:8px">'
        + '<div class="f"><label>Titre (FR)</label><input name="t_fr" value="' + a(x.title && x.title.fr !== x.title.ar ? x.title.fr : '') + '"></div><div class="f"><label>Title (EN)</label><input name="t_en" value="' + a(x.title && x.title.en !== x.title.ar ? x.title.en : '') + '"></div>'
        + '<div class="f"><label>Description (FR)</label><input name="d_fr" value="' + a(x.description && x.description.fr !== x.description.ar ? x.description.fr : '') + '"></div><div class="f"><label>Description (EN)</label><input name="d_en" value="' + a(x.description && x.description.en !== x.description.ar ? x.description.en : '') + '"></div></div></details>'
        + '<div class="grid g2" style="gap:0 12px"><div class="f"><label>العميل / العلامة</label><input name="client" value="' + a(m.client) + '" maxlength="40"></div>'
        + (web ? '<div class="f"><label>نوع التصميم</label><select name="device"><option value="mobile" ' + (m.device !== 'desktop' ? 'selected' : '') + '>هاتف</option><option value="desktop" ' + (m.device === 'desktop' ? 'selected' : '') + '>حاسوب</option></select></div>' : '<div class="f"><label>&nbsp;</label><label class="check"><input type="checkbox" name="home" ' + (m.home ? 'checked' : '') + '> يظهر حتى في الرئيسية (أعمالنا)</label></div>') + '</div>'
        + (web ? '<div class="f"><label>رابط الموقع الحقيقي (اختياري)</label><input name="link" class="ltr" placeholder="https://…" value="' + a(m.link) + '"></div>' : '')
        + '<div class="f"><label>' + (web ? 'صورة التصميم كاملة' : 'الفيديو (MP4 عمودي 9:16، أو رابط YouTube / jsDelivr)') + '</label><div class="row nowrap"><input name="url" class="in grow ltr" placeholder="https://…" value="' + a(st.media) + '"><button type="button" class="btn sm" id="pgu">' + ic('upload') + ' رفع</button></div><small class="faint" id="pgk"></small></div>'
        + '<div class="f"><label>' + (web ? 'صورة مصغرة (تتعمل وحدها)' : 'صورة الغلاف (تتعمل وحدها من الفيديو)') + '</label><div class="row nowrap"><input name="poster" class="in grow ltr" placeholder="https://…" value="' + a(st.poster) + '"><button type="button" class="btn sm" id="pgp">' + ic('image') + '</button></div><div id="pgprev" style="margin-top:6px"></div></div>'
        + '<label class="check" style="margin-bottom:12px"><input type="checkbox" name="active" ' + (x.active !== false ? 'checked' : '') + '> ظاهر في الموقع</label>'
        + '<div class="row"><button class="btn pri grow">' + t('save') + '</button>' + (id ? '<button type="button" class="btn danger" id="pgd">' + t('delete') + '</button>' : '') + '</div></form>');
      var f = $('#pgf', body);
      var prev = function () { $('#pgprev', body).innerHTML = f.poster.value ? '<img src="' + a(f.poster.value) + '" alt="" style="height:90px;border-radius:10px;object-fit:cover;object-position:top">' : ''; $('#pgk', body).textContent = st.kind || ''; };
      var kindOf = function (u) { return ytId(u) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u) ? 'video' : /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(u) ? 'image' : (u ? 'link' : st.kind); };
      f.url.oninput = function () { st.kind = kindOf(f.url.value.trim()); prev(); }; f.poster.oninput = prev; prev();
      $('#pgu', body).onclick = async function (e) {
        var fl = await pickFile(web ? 'image/*' : 'video/*,image/*'); if (!fl) return;
        await busy(e.currentTarget, async function () {
          var base = 'pages/' + f.section.value + '/' + Date.now() + '-';
          if (web) {
            var d = await prepDesign(fl, f.device && f.device.value === 'desktop');
            f.url.value = await putPublic(base + safeName(d.full.name), d.full); st.kind = 'image';
            if (d.thumb) f.poster.value = await putPublic(base + 'thumb.webp', d.thumb, 'image/webp');
          } else {
            if (fl.size > 50 * 1024 * 1024) throw new Error('الفيديو أكبر من 50MB. ضغطو ولا حط رابط jsDelivr من مستودع Media.');
            f.url.value = await putPublic(base + safeName(fl.name), fl); st.kind = fl.type.indexOf('video') === 0 ? 'video' : 'image';
            if (st.kind === 'video' && !f.poster.value) { var pb = await videoPoster(fl); if (pb) f.poster.value = await putPublic(base + 'poster.webp', pb, 'image/webp'); }
          }
          prev(); toast('تم الرفع');
        });
      };
      $('#pgp', body).onclick = async function (e) { var fl = await pickFile('image/*'); if (!fl) return; await busy(e.currentTarget, async function () { var p = 'pages/posters/' + Date.now() + '-' + safeName(fl.name); await upload('public-media', p, fl); f.poster.value = publicUrl(p); prev(); }); };
      f.onsubmit = async function (e) {
        e.preventDefault(); var d = Object.fromEntries(new FormData(f)); var url = (d.url || '').trim(); if (!url) return toast('زيد الملف ولا الرابط', true);
        var meta = Object.assign({}, m, { client: (d.client || '').trim() || undefined });
        if (web) { meta.device = d.device; meta.link = (d.link || '').trim() || undefined; } else meta.home = !!d.home;
        var row = { section: d.section, title: o3(d.t_ar, d.t_fr, d.t_en), description: o3(d.d_ar, d.d_fr, d.d_en), media_url: url, poster_url: (d.poster || '').trim() || null, kind: kindOf(url) || (web ? 'image' : 'video'), active: !!d.active, meta: JSON.parse(JSON.stringify(meta)) };
        await busy(e.submitter, async function () {
          var r = id ? await sb.from('portfolio').update(row).eq('id', id) : await sb.from('portfolio').insert(Object.assign({}, row, { sort: A._pf.filter(function (p) { return p.section === d.section; }).length + 1 }));
          if (r.error) fail(r.error); toast(t('saved')); closeModal(); route();
        });
      };
      var del = $('#pgd', body); if (del) del.onclick = async function () { if (!confirm(t('sure'))) return; var r = await sb.from('portfolio').delete().eq('id', id); if (r.error) return toast(errMsg(r.error), true); closeModal(); route(); };
    };

    /* ---------- page texts ---------- */
    var TXT = [
      ['video', 'صفحة الفيديو', [['eyebrow', 'الشارة الصغيرة'], ['title', 'العنوان الكبير (حط *كلمة* بين نجمتين باش تتلون)'], ['sub', 'الوصف']], SECS.video],
      ['web', 'صفحة المواقع', [['eyebrow', 'الشارة الصغيرة'], ['title', 'العنوان الكبير (*كلمة* = ملونة)'], ['sub', 'الوصف']], SECS.web],
      ['store', 'المتجر', [['eyebrow', 'الشارة الصغيرة'], ['title', 'العنوان الكبير (*كلمة* = ملونة)'], ['sub', 'الوصف']], []]
    ];
    function trio(name, val, area) {
      val = val || {};
      return L3.map(function (l) { return '<div class="f"' + (l === 'ar' ? '' : ' data-x') + '><label>' + l.toUpperCase() + '</label>' + (area ? '<textarea rows="2" name="' + name + '_' + l + '">' + a(val[l]) + '</textarea>' : '<input name="' + name + '_' + l + '" value="' + a(val[l]) + '">') + '</div>'; }).join('');
    }
    function textsHTML() {
      var c = A._pc;
      return '<p class="small muted">اترك الخانة فارغة باش يبقى النص الافتراضي. الفرنسية والإنجليزية اختيارية.</p><div class="grid g2" style="align-items:start">' + TXT.map(function (P) {
        var pc = c[P[0]] || {};
        return '<form class="card" data-pg="' + P[0] + '"><h3>' + P[1] + '</h3>'
          + P[2].map(function (f) { return '<fieldset style="border:0;padding:0;margin:0 0 6px"><legend class="small" style="font-weight:700;margin-bottom:6px">' + f[1] + '</legend>' + trio(f[0], pc[f[0]], f[0] === 'sub') + '</fieldset>'; }).join('')
          + P[3].map(function (s) { var cs = (pc.sections || {})[s[0]] || {}; return '<fieldset style="border:0;padding:0;margin:8px 0 6px"><legend class="small" style="font-weight:700;margin-bottom:6px">قسم: ' + s[1] + '</legend>' + trio('st.' + s[0], cs.title) + trio('ss.' + s[0], cs.sub, true) + '</fieldset>'; }).join('')
          + (P[0] === 'store' ? '<fieldset style="border:0;padding:0;margin:8px 0 6px"><legend class="small" style="font-weight:700;margin-bottom:6px">أسماء الأصناف</legend><div class="grid g2" style="gap:0 10px">' + STORE_CATS.map(function (k) { var v = ((pc.cats || {})[k] || {}).ar || ''; return '<div class="f"><label>' + k + '</label><input name="cat.' + k + '" placeholder="' + a(CAT_AR[k]) + '" value="' + a(v) + '"></div>'; }).join('') + '</div></fieldset>' : '')
          + '<button class="btn pri block">' + t('save') + '</button></form>';
      }).join('') + '</div>';
    }
    function wireTexts(pg) {
      $$('form[data-pg]', pg).forEach(function (f) {
        f.onsubmit = async function (e) {
          e.preventDefault(); var key = f.dataset.pg, d = Object.fromEntries(new FormData(f));
          var get = function (n) { return o3(d[n + '_ar'], d[n + '_fr'], d[n + '_en']); };
          await busy(e.submitter, async function () {
            var c = await getContent(); var pc = c[key] || {};
            ['eyebrow', 'title', 'sub'].forEach(function (n) { var v = get(n); if (v) pc[n] = v; else delete pc[n]; });
            var P = TXT.filter(function (x) { return x[0] === key; })[0];
            if (P[3].length) { pc.sections = pc.sections || {}; P[3].forEach(function (s) { var cs = pc.sections[s[0]] = pc.sections[s[0]] || {}; var tt = get('st.' + s[0]), ss = get('ss.' + s[0]); if (tt) cs.title = tt; else delete cs.title; if (ss) cs.sub = ss; else delete cs.sub; }); }
            if (key === 'store') { pc.cats = {}; STORE_CATS.forEach(function (k) { var v = (d['cat.' + k] || '').trim(); if (v) pc.cats[k] = { ar: v, fr: v, en: v }; }); }
            c[key] = pc; await setContent(c); A._pc = c; toast(t('saved'));
          });
        };
      });
    }

    /* =================== المتجر الرقمي =================== */
    A.store = async function () {
      var pg = A.sh('store', 'المتجر الرقمي', '<div class="spin"></div>');
      var r = await sb.from('products').select('*, product_variants(*)').order('sort');
      A._sp = (r.data || []).map(function (p) { p.vs = (p.product_variants || []).sort(function (x, y) { return (x.sort || 0) - (y.sort || 0); }); return p; });
      var list = A._sp.filter(function (p) { return p.type === 'digital' || (p.meta || {}).store; });
      var hasCol = !A._sp.length || 'meta' in A._sp[0];
      pg.innerHTML = '<div class="row between" style="margin-bottom:14px"><p class="small muted" style="margin:0;max-width:640px">المنتجات الرقمية تظهر في صفحة المتجر. كل منتج عندو مدد / باقات (السعر، السعر القديم، المخزون، المزايا). الطلب والدفع يمشو بنفس طريقة الخدمات: BaridiMob أو CCP ووصل.</p>'
        + '<div class="row"><a class="btn sm" href="store.html" target="_blank" rel="noopener">' + ic('eye') + ' شوف المتجر</a><button class="btn pri" onclick="Admin.spEdit()">' + ic('plus') + ' منتج جديد</button></div></div>'
        + (hasCol ? '' : '<div class="card" style="border-color:var(--warn);margin-bottom:14px"><b>' + MIG + '</b></div>')
        + (list.length ? '<div class="grid g3">' + list.map(function (p) {
          var m = p.meta || {}, act = p.vs.filter(function (v) { return v.active; }), ps = act.map(function (v) { return v.price; }).filter(function (x) { return x > 0; });
          return '<div class="card pc click" onclick="Admin.spEdit(\'' + p.id + '\')"><div class="cover" style="aspect-ratio:16/9;' + (m.color ? 'background:' + a(m.color) : '') + '">' + (p.cover_url ? '<img src="' + a(p.cover_url) + '" alt="">' : '<b style="font-size:34px;color:#fff">' + a((tr(p.name) || '?').slice(0, 2)) + '</b>') + '</div>'
            + '<div class="body"><div class="row between nowrap"><h3 style="margin:0" class="ell">' + a(tr(p.name)) + '</h3>' + (p.active ? '<span class="chip g">ظاهر</span>' : '<span class="chip">مخفي</span>') + '</div>'
            + '<div class="small muted">' + a(CAT_AR[p.category] || p.category || '') + ' · ' + act.length + ' مدة/باقة · ' + (m.delivery === 'instant' ? 'فوري' : 'يدوي') + '</div>'
            + '<div class="price">' + (ps.length ? (ps.length > 1 ? 'من ' : '') + money(Math.min.apply(null, ps)) : t('on_quote')) + '</div></div></div>';
        }).join('') + '</div>' : '<div class="card empty">' + ic('bag') + '<p>ما كاين حتى منتج رقمي بعد.</p><button class="btn pri" onclick="Admin.spEdit()">' + ic('plus') + ' زيد أول منتج</button></div>')
        + '<p class="small muted" style="margin-top:14px">تقدر تزيد حتى خدمة عادية للمتجر من «المنتجات» بتفعيل «يظهر في المتجر» هنا. الحسابات والاشتراكات تسلمها للزبون من صفحة الطلب (رسالة في المحادثة أو ملف).</p>';
    };
    var vRow = function (v) {
      var m = v.meta || {}, dur = (m.duration && m.duration.ar) || (v.name && v.name.ar) || '';
      return '<div class="card flat vrow" data-id="' + a(v.id || '') + '" style="padding:12px;margin-bottom:8px"><div class="grid" style="grid-template-columns:2fr 1fr 1fr 1fr;gap:8px">'
        + '<input class="in" data-k="dur" placeholder="المدة / الباقة (مثلا: شهر واحد)" value="' + a(dur) + '">'
        + '<input class="in" data-k="price" type="number" min="0" placeholder="السعر" value="' + a(v.price) + '">'
        + '<input class="in" data-k="old" type="number" min="0" placeholder="السعر القديم" value="' + a(m.old_price) + '">'
        + '<input class="in" data-k="cost" type="number" min="0" placeholder="التكلفة" value="' + a(v.cost) + '"></div>'
        + '<div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><input class="in" data-k="badge" placeholder="شارة (مثلا: الأكثر طلبا)" value="' + a(m.badge && (m.badge.ar || m.badge)) + '">'
        + '<select class="in" data-k="stock"><option value="in">متوفر</option><option value="low" ' + (m.stock === 'low' ? 'selected' : '') + '>كمية محدودة</option><option value="out" ' + (m.stock === 'out' ? 'selected' : '') + '>نفد</option></select></div>'
        + '<textarea class="in" data-k="feat" rows="2" style="margin-top:8px;min-height:56px" placeholder="مزايا هذي المدة (سطر لكل ميزة، اختياري)">' + a(m.features && m.features.ar) + '</textarea>'
        + '<div class="row between" style="margin-top:6px"><label class="check small"><input type="checkbox" data-k="active" ' + (v.active !== false ? 'checked' : '') + '> مفعّل</label>'
        + '<div class="row"><button type="button" class="btn icon sm ghost" data-mv="-1">↑</button><button type="button" class="btn icon sm ghost" data-mv="1">↓</button><button type="button" class="btn sm danger" data-rm>' + t('delete') + '</button></div></div></div>';
    };
    A.spEdit = function (id) {
      var p = id ? A._sp.filter(function (x) { return x.id === id; })[0] : { type: 'digital', category: 'subs', name: {}, description: {}, active: true, featured: false, sort: (A._sp || []).length + 1, delivery_days: 1, meta: { delivery: 'manual' }, vs: [] };
      if (!p) return; var m = p.meta || {}; var st = { cover: p.cover_url || '', gallery: (p.gallery || []).slice(), digital: p.digital_path || '' };
      var vs = p.vs.length ? p.vs : [{ name: { ar: 'شهر واحد' }, price: null, active: true, meta: {} }];
      var body = modal(id ? tr(p.name) : 'منتج رقمي جديد', '<form id="spf">'
        + '<div class="grid g2" style="gap:0 12px"><div class="f"><label>الاسم</label><input name="n_ar" required value="' + a(p.name.ar) + '"></div>'
        + '<div class="f"><label>Slug (رابط المنتج، حروف لاتينية)</label><input name="slug" class="ltr" required pattern="[a-z0-9_\\-]{2,60}" value="' + a(p.slug) + '" placeholder="netflix"></div></div>'
        + '<div class="f"><label>الوصف</label><textarea name="d_ar" rows="2">' + a(p.description && p.description.ar) + '</textarea></div>'
        + '<details style="margin-bottom:12px"><summary class="small muted" style="cursor:pointer">الفرنسية والإنجليزية (اختياري)</summary><div class="grid g2" style="gap:0 12px;margin-top:8px"><div class="f"><label>Nom (FR)</label><input name="n_fr" value="' + a(p.name.fr !== p.name.ar ? p.name.fr : '') + '"></div><div class="f"><label>Name (EN)</label><input name="n_en" value="' + a(p.name.en !== p.name.ar ? p.name.en : '') + '"></div>'
        + '<div class="f"><label>Description (FR)</label><textarea name="d_fr" rows="2">' + a(p.description && p.description.fr !== p.description.ar ? p.description.fr : '') + '</textarea></div><div class="f"><label>Description (EN)</label><textarea name="d_en" rows="2">' + a(p.description && p.description.en !== p.description.ar ? p.description.en : '') + '</textarea></div></div></details>'
        + '<div class="grid g2" style="gap:0 12px"><div class="f"><label>الصنف</label><input name="category" list="spcats" value="' + a(p.category) + '" required><datalist id="spcats">' + STORE_CATS.map(function (k) { return '<option value="' + k + '">' + CAT_AR[k] + '</option>'; }).join('') + '</datalist></div>'
        + '<div class="f"><label>لون البطاقة (إذا ما كانش صورة)</label><input name="color" type="color" value="' + a(m.color || '#0FAA60') + '" style="min-height:46px;padding:4px"></div>'
        + '<div class="f"><label>طريقة التسليم</label><select name="delivery"><option value="manual">يدوي (نبعثلو في حسابو)</option><option value="instant" ' + (m.delivery === 'instant' ? 'selected' : '') + '>فوري (ملف يتفتح بعد الدفع)</option></select></div>'
        + '<div class="f"><label>مدة التسليم (أيام)</label><input name="delivery_days" type="number" min="0" max="60" value="' + a(p.delivery_days) + '"></div>'
        + '<div class="f"><label>شارة المنتج</label><input name="badge" placeholder="مثلا: الأكثر طلبا" value="' + a(m.badge && (m.badge.ar || m.badge)) + '"></div>'
        + '<div class="f"><label>الضمان</label><input name="warranty" placeholder="مثلا: طول المدة" value="' + a(m.warranty && (m.warranty.ar || m.warranty)) + '"></div></div>'
        + '<div class="f"><label>واش يحتوي (سطر لكل ميزة)</label><textarea name="features" rows="3">' + a(m.features && m.features.ar) + '</textarea></div>'
        + '<div class="f"><label>ملاحظة التسليم (اختياري)</label><input name="note" placeholder="مثلا: نبعثو المعلومات في المحادثة خلال ساعتين" value="' + a(m.delivery_note && m.delivery_note.ar) + '"></div>'
        + '<div class="f"><label>الصورة</label><div class="upl" id="spcov"></div><div class="row"><button type="button" class="btn sm" id="spbc">' + ic('image') + ' رفع صورة</button><button type="button" class="btn sm" id="spbg">' + ic('plus') + ' صور إضافية</button></div></div>'
        + '<div class="f"><label>المدد والباقات</label><div id="spvs">' + vs.map(vRow).join('') + '</div><button type="button" class="btn sm" id="spva">' + ic('plus') + ' زيد مدة / باقة</button></div>'
        + '<div class="f" id="spdig"><label>ملف التسليم الفوري (يتفتح للزبون بعد تأكيد الدفع)</label><div class="row"><span class="small muted ell grow" id="spdn">' + a(st.digital || '—') + '</span><button type="button" class="btn sm" id="spbd">' + ic('upload') + ' رفع</button></div></div>'
        + '<div class="row" style="margin-bottom:14px"><label class="check"><input type="checkbox" name="active" ' + (p.active ? 'checked' : '') + '> ظاهر</label><label class="check"><input type="checkbox" name="featured" ' + (p.featured ? 'checked' : '') + '> مميز</label>'
        + (p.type !== 'digital' ? '<label class="check"><input type="checkbox" name="store" ' + (m.store ? 'checked' : '') + '> يظهر في المتجر</label>' : '') + '<label class="check">الترتيب <input name="sort" type="number" class="in" style="width:80px;min-height:36px" value="' + a(p.sort || 0) + '"></label></div>'
        + '<button class="btn pri block lg">' + t('save') + '</button></form>', { wide: true });
      var f = $('#spf', body), removed = [];
      var draw = function () { $('#spcov', body).innerHTML = [st.cover].concat(st.gallery).filter(Boolean).map(function (u, i) { return '<div class="u"><img src="' + a(u) + '" alt=""><button type="button" data-x="' + (i ? i - 1 : 'c') + '">×</button></div>'; }).join(''); };
      draw();
      body.addEventListener('click', function (e) {
        var x = e.target.dataset && e.target.dataset.x; if (x != null) { if (x === 'c') st.cover = ''; else st.gallery.splice(+x, 1); draw(); return; }
        var row = e.target.closest('.vrow'); if (!row) return;
        if (e.target.closest('[data-rm]')) { if (row.dataset.id) removed.push(row.dataset.id); row.remove(); }
        var mv = e.target.closest('[data-mv]'); if (mv) { var sib = +mv.dataset.mv < 0 ? row.previousElementSibling : row.nextElementSibling; if (sib) +mv.dataset.mv < 0 ? sib.before(row) : sib.after(row); }
      });
      var upl = async function (fl) { var path = 'products/' + Date.now() + '-' + safeName(fl.name); await upload('public-media', path, fl); return publicUrl(path); };
      $('#spbc', body).onclick = async function (e) { var fl = await pickFile('image/*'); if (fl) await busy(e.currentTarget, async function () { st.cover = await upl(fl); draw(); }); };
      $('#spbg', body).onclick = async function (e) { var fls = await pickFile('image/*', true); if (fls && fls.length) await busy(e.currentTarget, async function () { for (var i = 0; i < fls.length; i++) st.gallery.push(await upl(fls[i])); draw(); }); };
      $('#spbd', body).onclick = async function (e) { var fl = await pickFile(); if (fl) await busy(e.currentTarget, async function () { var path = (f.slug.value || 'product') + '/' + Date.now() + '-' + safeName(fl.name); var r = await sb.storage.from('digital').upload(path, fl, { upsert: true }); if (r.error) throw r.error; st.digital = path; $('#spdn', body).textContent = path; }); };
      $('#spva', body).onclick = function () { $('#spvs', body).insertAdjacentHTML('beforeend', vRow({ active: true, meta: {} })); };
      f.onsubmit = async function (e) {
        e.preventDefault(); var d = Object.fromEntries(new FormData(f));
        var feats = (d.features || '').trim();
        var meta = Object.assign({}, m, { color: d.color, delivery: d.delivery, badge: o3(d.badge) || undefined, warranty: o3(d.warranty) || undefined, features: feats ? { ar: feats, fr: feats, en: feats } : undefined, delivery_note: o3(d.note) || undefined });
        if (p.type !== 'digital') meta.store = !!d.store;
        var row = { type: p.type || 'digital', slug: d.slug.trim(), category: d.category.trim() || 'other', name: o3(d.n_ar, d.n_fr, d.n_en), description: o3(d.d_ar, d.d_fr, d.d_en) || { ar: '', fr: '', en: '' }, cover_url: st.cover || null, gallery: st.gallery, digital_path: st.digital || null, delivery_days: d.delivery_days ? +d.delivery_days : null, active: !!d.active, featured: !!d.featured, sort: +d.sort || 0, meta: JSON.parse(JSON.stringify(meta)) };
        var rows = $$('.vrow', body).map(function (r, i) {
          var g = function (k) { return r.querySelector('[data-k=' + k + ']'); }; var dur = g('dur').value.trim() || 'الباقة الأساسية';
          var old = vs.filter(function (v) { return v.id && v.id === r.dataset.id; })[0] || {}; var om = old.meta || {}; var fe = g('feat').value.trim();
          return { id: r.dataset.id || null, product_id: null, name: Object.assign({}, old.name || {}, { ar: dur, fr: (old.name && old.name.fr && old.name.fr !== (old.name.ar || '')) ? old.name.fr : dur, en: (old.name && old.name.en && old.name.en !== (old.name.ar || '')) ? old.name.en : dur }), price: g('price').value ? +g('price').value : null, cost: g('cost').value ? +g('cost').value : null, active: g('active').checked, sort: i + 1,
            meta: JSON.parse(JSON.stringify(Object.assign({}, om, { duration: { ar: dur, fr: (om.duration && om.duration.fr) || dur, en: (om.duration && om.duration.en) || dur }, old_price: g('old').value ? +g('old').value : undefined, badge: o3(g('badge').value) || undefined, stock: g('stock').value === 'in' ? undefined : g('stock').value, features: fe ? { ar: fe, fr: fe, en: fe } : undefined }))) };
        });
        await busy(e.submitter, async function () {
          var pid = p.id, r;
          if (pid) { r = await sb.from('products').update(row).eq('id', pid); if (r.error) fail(r.error); }
          else { r = await sb.from('products').insert(row).select('id').single(); if (r.error) fail(r.error); pid = r.data.id; }
          for (var i = 0; i < rows.length; i++) {
            var v = rows[i], vid = v.id; delete v.id; v.product_id = pid;
            r = vid ? await sb.from('product_variants').update(v).eq('id', vid) : await sb.from('product_variants').insert(v);
            if (r.error) fail(r.error);
          }
          for (var j = 0; j < removed.length; j++) { // variants used by orders can't be deleted: hide them instead
            r = await sb.from('product_variants').delete().eq('id', removed[j]);
            if (r.error) await sb.from('product_variants').update({ active: false }).eq('id', removed[j]);
          }
          if (typeof loadProducts === 'function') loadProducts(true).catch(function () {});
          closeModal(); toast(t('saved')); A.store();
        });
      };
    };
    return true;
  }
  var iv = setInterval(function () { if (patch()) clearInterval(iv); }, 300);
  setTimeout(function () { clearInterval(iv); }, 60000);
})();
