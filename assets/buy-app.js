/* buy-app.js - «نشريلك» (AliExpress / Temu buying) inside app.html. Additive: wraps viewOrder (client),
   Admin.order and Admin.site (admin). Order data lives in orders.meta.buy (see supabase/buy_for_me.sql).
   Client: product card + tracking on the order page, and a "finish your order" banner when a draft from buy.html is waiting.
   Admin: per order (link, price, verified or typed by the client, AliExpress/Temu order number, tracking, real cost, re-check price)
   and the service settings (dollar rate, margin, minimum profit, rounding, Temu on/off). */
(function () {
  var L = function (ar, fr, en) { return [ar, fr, en][['ar', 'fr', 'en'].indexOf(LANG)] || ar; };
  var srcN = function (s) { return s === 'aliexpress' ? 'AliExpress' : s === 'temu' ? 'Temu' : L('موقع آخر', 'Autre site', 'Other site'); };
  var trackUrl = function (b) { return b.tracking_url || (b.tracking ? 'https://parcelsapp.com/en/tracking/' + encodeURIComponent(b.tracking) : ''); };
  function draft() { try { return JSON.parse(localStorage.getItem('ofa_buy') || 'null'); } catch (e) { return null; } }
  async function buyOf(id) { var r = await sb.from('orders').select('id,meta,cost,total,qty').eq('id', id).maybeSingle(); return r.data && r.data.meta && r.data.meta.buy ? r.data : null; }
  function prodHTML(b) {
    return '<div class="row" style="gap:12px;align-items:center">' + (b.image ? '<img src="' + esc(b.image) + '" alt="" style="width:64px;height:64px;border-radius:14px;object-fit:cover;flex:none">' : '<span class="thumb" style="display:grid;place-items:center;flex:none">' + ic('bag') + '</span>')
      + '<div class="grow" style="min-width:0"><span class="chip ' + (b.verified ? 'g' : 'w') + '">' + esc(srcN(b.source)) + '</span> <b class="small">' + esc(b.title || '') + '</b><br><a class="tiny muted ell" dir="ltr" href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer" style="display:block">' + esc(b.url) + '</a></div></div>';
  }
  /* ---------- client ---------- */
  function patchClient() {
    if (typeof viewOrder !== 'function' || window._byc) return !!window._byc;
    window._byc = true;
    var vo = viewOrder;
    viewOrder = async function (id) {
      await vo.apply(this, arguments);
      try {
        var o = await buyOf(id); if (!o) return;
        var b = o.meta.buy, pg = document.getElementById('page'); if (!pg || pg.querySelector('.byc')) return;
        var tu = trackUrl(b);
        var html = '<div class="card byc" style="margin-bottom:14px">' + prodHTML(b)
          + (b.tracking ? '<div class="sep"></div><div class="row between"><span class="small"><b>' + esc(L('رقم التتبع', 'N° de suivi', 'Tracking number')) + '</b><br><span dir="ltr">' + esc(b.tracking) + '</span></span>' + (tu ? '<a class="btn sm pri" target="_blank" rel="noopener" href="' + esc(tu) + '">' + esc(L('تتبع الطرد', 'Suivre le colis', 'Track parcel')) + '</a>' : '') + '</div>'
            : '<p class="tiny muted" style="margin:10px 0 0">' + esc(L('رقم التتبع يبان هنا كي يتبعث الطرد.', 'Le numéro de suivi apparaîtra ici à l’expédition.', 'The tracking number shows here once the parcel ships.')) + '</p>')
          + '</div>';
        var first = pg.querySelector('.card'); first ? first.insertAdjacentHTML('beforebegin', html) : pg.insertAdjacentHTML('afterbegin', html);
      } catch (e) { console.error(e); }
    };
    return true;
  }
  function banner() {
    var d = draft(); if (!d || !d.url || !S.me || isAdmin()) return;
    var pg = document.getElementById('page'); if (!pg || pg.querySelector('.byb') || !/^#\/?$|^#\/services|^$/.test(location.hash)) return;
    pg.insertAdjacentHTML('afterbegin', '<a class="card byb row between" href="buy.html" style="margin-bottom:14px;text-decoration:none;color:inherit;border-color:var(--green)"><span><b>' + esc(L('كمل طلب الشراء من ' + srcN(d.source), 'Finalisez votre achat ' + srcN(d.source), 'Finish your ' + srcN(d.source) + ' order')) + '</b><br><small class="muted ell">' + esc(d.title || d.url) + '</small></span><span class="btn pri sm">' + ic('arrow', 'ico flip go') + '</span></a>');
  }
  /* ---------- admin ---------- */
  function patchAdmin() {
    if (!window.Admin || typeof Admin.order !== 'function' || Admin._by) return !!(window.Admin && Admin._by);
    Admin._by = true;
    var ao = Admin.order;
    Admin.order = async function (id) {
      await ao.apply(this, arguments);
      try {
        var o = await buyOf(id); if (!o) return;
        var b = o.meta.buy, pg = document.getElementById('page'); if (!pg || pg.querySelector('.bya')) return;
        var tu = trackUrl(b), profit = o.cost ? o.total - o.cost : null;
        var html = '<form class="card bya" style="margin-bottom:14px"><h3 style="margin-top:0">' + esc('شراء من ' + srcN(b.source)) + '</h3>' + prodHTML(b)
          + '<div class="sep"></div><p class="small" style="margin:0 0 8px">' + esc(b.usd + ' $ × ' + (b.qty || 1)) + (b.ship_usd ? esc(' + شحن ' + b.ship_usd + ' $') : '') + ' · ' + esc('الدولار ' + b.rate + ' دج · الربح ' + b.margin + '%') + '<br>'
          + (b.verified ? '<span class="chip g">السعر جا من الموقع</span>' : '<span class="chip w">السعر كتبو الزبون: تأكد منو قبل الشراء</span>') + '</p>'
          + (b.options ? '<p class="small"><b>الخيارات:</b> ' + esc(b.options) + '</p>' : '') + '<p class="small"><b>العنوان:</b> ' + esc(b.address || '') + '</p>'
          + '<div class="row" style="gap:8px;margin-bottom:12px"><a class="btn sm" target="_blank" rel="noopener noreferrer" href="' + esc(b.url) + '">' + ic('arrow') + ' افتح المنتج</a><button type="button" class="btn sm ghost" data-recheck>عاود جيب السعر</button><span class="small muted" data-rc></span></div>'
          + '<div class="grid g2"><div class="f"><label>رقم طلبية ' + esc(srcN(b.source)) + '</label><input name="ali_order" dir="ltr" value="' + esc(b.ali_order || '') + '"></div>'
          + '<div class="f"><label>الثمن الحقيقي اللي خلصتو (دج)</label><input name="cost" type="number" min="0" dir="ltr" value="' + esc(o.cost == null ? '' : o.cost) + '"></div>'
          + '<div class="f"><label>رقم التتبع</label><input name="tracking" dir="ltr" value="' + esc(b.tracking || '') + '"></div>'
          + '<div class="f"><label>رابط التتبع (اختياري)</label><input name="tracking_url" dir="ltr" type="url" value="' + esc(b.tracking_url || '') + '"></div></div>'
          + (profit != null ? '<p class="small"><b>الربح الحقيقي:</b> ' + money(profit) + '</p>' : '')
          + '<button class="btn pri">' + t('save') + '</button>' + (tu ? ' <a class="btn ghost" target="_blank" rel="noopener" href="' + esc(tu) + '">تتبع</a>' : '') + '</form>';
        var first = pg.querySelector('.card'); first ? first.insertAdjacentHTML('beforebegin', html) : pg.insertAdjacentHTML('afterbegin', html);
        var f = pg.querySelector('.bya');
        f.querySelector('[data-recheck]').onclick = async function (e) {
          var out = f.querySelector('[data-rc]');
          await busy(e.currentTarget, async function () {
            var r = await (await fetch(CFG.url + '/functions/v1/price-check', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.key }, body: JSON.stringify({ url: b.url }) })).json();
            if (!r.ok) { out.textContent = 'ما قدرناش نجيبو السعر، شوفو في الموقع.'; return; }
            var d = r.usd - b.usd, pc = b.usd ? Math.round(100 * d / b.usd) : 0;
            out.innerHTML = 'دروك: <b dir="ltr">' + esc(r.usd) + ' $</b> ' + (Math.abs(pc) < 1 ? '(نفس السعر)' : pc > 0 ? '<span style="color:var(--bad)">(+' + pc + '%)</span>' : '(' + pc + '%)');
          });
        };
        f.onsubmit = async function (e) {
          e.preventDefault();
          var nb = Object.assign({}, b, { ali_order: f.ali_order.value.trim() || undefined, tracking: f.tracking.value.trim() || undefined, tracking_url: f.tracking_url.value.trim() || undefined });
          var c = f.cost.value === '' ? null : +f.cost.value;
          await busy(e.submitter, async function () {
            var r = await sb.from('orders').update({ meta: Object.assign({}, o.meta, { buy: nb }), cost: c }).eq('id', id);
            if (r.error) throw r.error; toast(t('saved')); route();
          });
        };
      } catch (e) { console.error(e); }
    };
    var as = Admin.site;
    Admin.site = async function () {
      await as.apply(this, arguments);
      try {
        var pg = document.getElementById('page'); if (!pg || pg.querySelector('.bys')) return;
        var r = await sb.from('settings').select('key,value').in('key', ['buy_rate', 'buy_margin', 'buy_min_profit', 'buy_round', 'buy_temu']);
        var v = {}; (r.data || []).forEach(function (x) { v[x.key] = x.value; });
        var fld = function (k, lab, hint) { return '<div class="f"><label>' + lab + '</label><input name="' + k + '" type="number" min="0" step="any" dir="ltr" value="' + esc(v[k] == null ? '' : v[k]) + '">' + (hint ? '<small class="tiny muted">' + hint + '</small>' : '') + '</div>'; };
        pg.insertAdjacentHTML('afterbegin', '<form class="card bys" style="margin-bottom:14px"><h3 style="margin-top:0">' + ic('bag') + ' نشريلك: AliExpress و Temu</h3>'
          + '<div class="grid g2">' + fld('buy_rate', 'سعر الدولار (USDT) بالدينار') + fld('buy_margin', 'الربح %', 'على سعر المنتج برك، الشحن بلا ربح') + fld('buy_min_profit', 'أقل ربح للطلب (دج)', '0 = بلا حد أدنى') + fld('buy_round', 'تقريب السعر (دج)', 'مثلا 50') + '</div>'
          + '<label class="row small" style="gap:8px;margin-bottom:12px"><input type="checkbox" name="buy_temu"' + (v.buy_temu === false ? '' : ' checked') + '> Temu مفعّل (السعر عبر Apify)</label>'
          + '<p class="tiny muted">مثال: منتج بـ 10$ → <b data-ex></b></p><button class="btn pri">' + t('save') + '</button> <a class="btn ghost" href="buy.html" target="_blank">شوف الصفحة</a></form>');
        var f = pg.querySelector('.bys');
        var ex = function () { var rt = +f.buy_rate.value || 0, mg = +f.buy_margin.value || 0, mn = +f.buy_min_profit.value || 0, rd = Math.max(+f.buy_round.value || 1, 1); var base = 10 * rt; f.querySelector('[data-ex]').textContent = money(Math.ceil((base + Math.max(10 * mg / 100 * rt, mn)) / rd) * rd); };
        f.addEventListener('input', ex); ex();
        f.onsubmit = async function (e) {
          e.preventDefault();
          var rows = ['buy_rate', 'buy_margin', 'buy_min_profit', 'buy_round'].map(function (k) { return { key: k, value: +f[k].value || 0, is_public: true }; });
          rows.push({ key: 'buy_temu', value: f.buy_temu.checked, is_public: true });
          if (!(rows[0].value > 0)) return toast('سعر الدولار لازم يكون أكبر من 0', true);
          await busy(e.submitter, async function () { var r = await sb.from('settings').upsert(rows); if (r.error) throw r.error; toast(t('saved')); });
        };
      } catch (e) { console.error(e); }
    };
    return true;
  }
  var iv = setInterval(function () {
    var a = patchClient(), was = !!(window.Admin && Admin._by), b = patchAdmin();
    if (b && !was && /^#\/a\/(order|site)/.test(location.hash)) route();
    if (a && (b || (S.me && !isAdmin()))) clearInterval(iv);
  }, 400);
  patchClient(); patchAdmin();
  addEventListener('hashchange', function () { setTimeout(banner, 600); }); setTimeout(banner, 1200);
})();
