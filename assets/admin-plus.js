/* admin-plus.js — UI/UX phase 3 (admin): grouped menu, "today" hero, density toggle, bulk order status, undo on delete, dark by default. Chains onto Admin after ops.js + life.js. */
(function () {
  var GROUPS = [['العمل', ['dash', 'orders', 'cal', 'leads']], ['المتجر', ['clients', 'products', 'store', 'pages', 'site']], ['الأرقام', ['finance', 'stats', 'analytics', 'life']]];
  var BOTTOM = ['dash', 'orders', 'cal', 'clients'];
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var algNow = function () { return new Date(Date.now() + 36e5); };
  var dstr = function (d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
  var hm = function (iso) { var d = new Date(new Date(iso).getTime() + 36e5); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); };
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function grouped(nav) {
    var by = {}; nav.forEach(function (n) { by[n.k] = n; });
    var seen = {}, out = GROUPS.map(function (g) { return [g[0], g[1].filter(function (k) { return by[k] && (seen[k] = 1); }).map(function (k) { return by[k]; })]; });
    var rest = nav.filter(function (n) { return !seen[n.k]; });
    if (rest.length) out.push(['أخرى', rest]);
    return out.filter(function (g) { return g[1].length; });
  }
  function link(n, active) { return '<a class="nav ' + (n.k === active ? 'on' : '') + '" href="' + n.h + '">' + ic(n.i) + '<span>' + n.l + '</span>' + (n.c ? '<span class="cnt">' + n.c + '</span>' : '') + '</a>'; }

  function patch() {
    var A = window.Admin; if (!A || !A._ops || !A._life) return false; if (A._p3) return true; A._p3 = true;

    /* dark by default for the admin, only until he picks a theme himself */
    if (!ls('ofa_theme')) { document.documentElement.dataset.theme = 'dark'; ls('ofa_theme', 'dark'); }
    if (ls('ofa_dense') === '1') document.documentElement.classList.add('dense');

    /* ---- grouped sidebar + bottom bar (4 fixed + المزيد grouped) ---- */
    var shellPrev = window.shell;
    window.shell = function (active, title, body, o) {
      o = o || {}; var r = shellPrev(active, title, body, o); var nav = o.nav || [];
      if (!isAdmin() || S.viewAs || !nav.some(function (n) { return n.k === 'dash'; })) return r;
      var side = document.querySelector('.side'), brand = side && side.querySelector('.brand');
      if (side && brand) {
        side.querySelectorAll(':scope > a.nav').forEach(function (a) { a.remove(); });
        brand.insertAdjacentHTML('afterend', grouped(nav).map(function (g) { return '<div class="navg">' + g[0] + '</div>' + g[1].map(function (n) { return link(n, active); }).join(''); }).join(''));
      }
      var bn = document.querySelector('.bnav');
      if (bn) {
        var bottom = BOTTOM.map(function (k) { return nav.filter(function (n) { return n.k === k; })[0]; }).filter(Boolean);
        var rest = nav.filter(function (n) { return BOTTOM.indexOf(n.k) < 0; });
        A._more = rest;
        bn.innerHTML = bottom.map(function (n) { return '<button class="' + (n.k === active ? 'on' : '') + '" onclick="go(\'' + n.h + '\')">' + ic(n.i) + '<span>' + n.l + '</span>' + (n.c ? '<span class="cnt">' + n.c + '</span>' : '') + '</button>'; }).join('') +
          (rest.length ? '<button class="' + (rest.some(function (n) { return n.k === active; }) ? 'on' : '') + '" onclick="Admin.calMore()">' + ic('menu') + '<span>المزيد</span></button>' : '');
      }
      var top = document.querySelector('.top');
      if (top && !top.querySelector('.dens')) top.insertAdjacentHTML('beforeend', '<button class="btn icon sm ghost dens" title="كثافة العرض" aria-label="كثافة العرض" onclick="Admin.dense()">' + ic('grid') + '</button>');
      return r;
    };
    A.calMore = function () {
      var more = A._more || [];
      modal('المزيد', grouped(more).map(function (g) { return '<div class="navg" style="padding-inline:4px">' + g[0] + '</div><div class="list">' + g[1].map(function (n) { return '<a class="li" href="' + n.h + '" style="text-decoration:none;color:inherit" onclick="closeModal()">' + ic(n.i) + '<div class="grow">' + n.l + '</div></a>'; }).join('') + '</div>'; }).join(''));
    };
    A.dense = function () { var on = document.documentElement.classList.toggle('dense'); ls('ofa_dense', on ? '1' : '0'); toast(on ? 'عرض مدمج' : 'عرض مريح'); };

    /* ---- "today" hero on top of the dashboard: one answer to "what do I do now?" ---- */
    var dash0 = A.dash.bind(A);
    A.dash = async function () {
      var r = await dash0.apply(A, arguments);
      try { await hero(); } catch (e) { console.error(e); }
      return r;
    };
    async function hero() {
      var pg = document.getElementById('page'); if (!pg || !/^#\/a\/(dash)?$/.test(location.hash || '#/a/dash')) return;
      var now = new Date().toISOString(), td = dstr(algNow());
      var res = await Promise.all([
        sb.from('orders').select('id,number,title,status,due_date').not('status', 'in', '(completed,cancelled,refunded,delivered)'),
        sb.from('calendar_blocks').select('id,title,starts_at,ends_at,status').gte('ends_at', now).neq('status', 'done').order('starts_at').limit(2),
        sb.from('profiles').select('id,full_name,next_follow_up').lt('next_follow_up', td).not('next_follow_up', 'is', null),
      ]);
      var O = res[0].data || [], B = res[1].data || [], F = res[2].data || [];
      var rv = O.filter(function (o) { return o.status === 'payment_review'; });
      var qt = O.filter(function (o) { return o.status === 'quote_requested'; });
      var late = O.filter(function (o) { return o.due_date && o.due_date < td; });
      var urgent = rv.length + qt.length + late.length + F.length;
      var first, go1;
      if (rv.length) { first = 'أكّد ' + rv.length + ' وصل دفع'; go1 = '#/a/order/' + rv[0].id; }
      else if (qt.length) { first = 'سعّر ' + qt.length + ' طلب عرض سعر'; go1 = '#/a/order/' + qt[0].id; }
      else if (late.length) { first = late.length + ' طلب فات أجله'; go1 = '#/a/order/' + late[0].id; }
      else if (F.length) { first = F.length + ' متابعة متأخرة'; go1 = '#/a/client/' + F[0].id; }
      var nb = B[0], nowB = nb && nb.starts_at <= now;
      var blockTxt = nb ? (nowB ? 'دابا: ' : 'الجاي ' + hm(nb.starts_at) + ': ') + esc(nb.title) : 'ما كاين حتى بلوك باقي اليوم';
      var rows = [
        rv.length && ['b', 'وصولات تستنى التأكيد', rv.length],
        qt.length && ['w', 'عروض سعر', qt.length],
        late.length && ['b', 'طلبات متأخرة', late.length],
        F.length && ['w', 'متابعات متأخرة', F.length],
      ].filter(Boolean);
      var h = '<section class="card today" aria-label="اليوم"><div class="tdh"><div class="tdn num ' + (urgent ? '' : 'ok') + '">' + urgent + '</div><div class="grow"><div class="tiny muted">واش لازم ندير الآن؟</div>' +
        (first ? '<b class="tdt">' + esc(first) + '</b>' : '<b class="tdt">كلش مليح، ما كاين والو مستعجل</b>') +
        '<div class="small muted tdb">' + ic('clock') + '<span>' + blockTxt + '</span></div></div>' +
        (go1 ? '<a class="btn pri" href="' + go1 + '">ابدا</a>' : '<a class="btn" href="#/a/cal">الجدول</a>') + '</div>' +
        (rows.length ? '<div class="tdr">' + rows.map(function (x) { return '<span class="chip ' + x[0] + '"><span class="dot"></span>' + x[1] + ' <b class="num">' + x[2] + '</b></span>'; }).join('') + '</div>' : '') + '</section>';
      var old = pg.querySelector('.today'); if (old) old.remove();
      pg.insertAdjacentHTML('afterbegin', h);
    }

    /* ---- bulk status change on the orders list ---- */
    var BULK = ['paid', 'in_progress', 'in_review', 'delivered', 'completed', 'cancelled'];
    var sel = {};
    var orders0 = A.orders.bind(A);
    A.orders = async function () {
      sel = {};
      var r = await orders0.apply(A, arguments);
      var ol = document.getElementById('ol'); if (!ol) return r;
      var deco = function () {
        ol.querySelectorAll('a.li[href^="#/a/order/"]').forEach(function (a) {
          if (a.querySelector('.bk')) return; var id = a.getAttribute('href').split('/').pop();
          a.insertAdjacentHTML('afterbegin', '<span class="bk" role="checkbox" tabindex="0" aria-label="تحديد" aria-checked="' + (sel[id] ? 'true' : 'false') + '" data-id="' + id + '"></span>');
        });
      };
      var tog = function (e) { var cb = e.target.closest && e.target.closest('.bk'); if (!cb) return; if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return; e.preventDefault(); e.stopPropagation(); var on = cb.getAttribute('aria-checked') !== 'true'; cb.setAttribute('aria-checked', on); if (on) sel[cb.dataset.id] = 1; else delete sel[cb.dataset.id]; bar(); };
      ol.addEventListener('click', tog); ol.addEventListener('keydown', tog);
      new MutationObserver(deco).observe(ol, { childList: true });
      deco(); bar();
      return r;
    };
    function bar() {
      var ids = Object.keys(sel), b = document.getElementById('bulkbar');
      if (!ids.length) { if (b) b.remove(); return; }
      if (!b) { b = document.createElement('div'); b.id = 'bulkbar'; document.body.append(b); }
      b.innerHTML = '<b class="num">' + ids.length + '</b><span>محدد</span><select class="in" id="bkst" aria-label="الحالة">' + BULK.map(function (s) { return '<option value="' + s + '">' + t('st_' + s) + '</option>'; }).join('') + '</select><button class="btn pri sm" onclick="Admin.bulkApply(this)">تطبيق</button><button class="btn sm ghost" onclick="Admin.bulkClear()">إلغاء</button>';
    }
    A.bulkClear = function () { sel = {}; document.querySelectorAll('#ol .bk').forEach(function (c) { c.setAttribute('aria-checked', 'false'); }); bar(); };
    A.bulkApply = async function (btn) {
      var ids = Object.keys(sel), st = document.getElementById('bkst').value; if (!ids.length) return;
      var patchO = { status: st }; if (st === 'delivered') patchO.delivered_at = new Date().toISOString();
      await busy(btn, async function () { var q = await sb.from('orders').update(patchO).in('id', ids); if (q.error) throw q.error; toast(ids.length + ' طلب → ' + t('st_' + st)); sel = {}; bar(); A.orders(); });
    };
    addEventListener('hashchange', function () { if (location.hash !== '#/a/orders') { sel = {}; bar(); } });

    /* ---- undo (5 s) instead of "are you sure?" for simple deletes ---- */
    function undoable(name, rowSel) {
      var f0 = A[name]; if (typeof f0 !== 'function') return;
      A[name] = function (id) {
        var ev = window.event, row = ev && ev.target && ev.target.closest(rowSel);
        if (row) row.classList.add('gone');
        var done = false, box = document.getElementById('toast');
        if (!box) { box = document.createElement('div'); box.id = 'toast'; document.body.append(box); }
        var d = document.createElement('div'); d.className = 'undo'; d.innerHTML = '<span>تم الحذف</span><button type="button">تراجع</button>'; box.append(d);
        var run = function () { if (done) return; done = true; d.remove(); var c0 = window.confirm; window.confirm = function () { return true; }; try { f0.call(A, id); } finally { window.confirm = c0; } };
        d.querySelector('button').onclick = function () { if (done) return; done = true; d.remove(); if (row) row.classList.remove('gone'); };
        setTimeout(run, 5000);
      };
    }
    undoable('calDel', '.li'); undoable('delExpense', 'tr'); undoable('goalDel', '.li,tr'); undoable('pexDel', '.li,tr');

    /* re-render the page we're on so the new menu shows right away */
    if (/^#\/a\//.test(location.hash) && typeof route === 'function') route();
    return true;
  }
  var iv = setInterval(function () { if (patch()) clearInterval(iv); }, 300);
  setTimeout(function () { clearInterval(iv); }, 60000);
})();
