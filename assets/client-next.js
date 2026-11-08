/* client-next.js - client dashboard: "next step" card on top of my orders + live refresh on order changes. Additive. */
(function () {
  var MSG = {
    quoted: ['عرض السعر جاهز', 'راجع العرض ووافق عليه'],
    pending_payment: ['بقي الدفع', 'ادفع وأرسل الوصل'],
    in_review: ['العمل جاهز للمراجعة', 'شوف النتيجة واعتمدها'],
    delivered: ['تم التسليم', 'اعتمد الاستلام أو حمّل ملفاتك']
  };
  var WAIT = { quote_requested: 'نحضرو لك عرض السعر', payment_review: 'نراجعو الوصل', paid: 'استلمنا الدفع، نبدو قريب', in_progress: 'العمل جاري' };
  function card(rows) {
    var a = rows.filter(function (o) { return MSG[o.status]; })[0];
    if (a) {
      var m = MSG[a.status];
      return '<a class="card nx" href="#/order/' + a.id + '" style="display:block;text-decoration:none;color:inherit;margin-bottom:12px;border-inline-start:4px solid var(--green)"><div class="tiny muted">خطوتك الجاية</div><b>' + esc(m[0]) + '</b><div class="small muted">' + esc(m[1]) + ' · ' + esc(a.title) + '</div></a>';
    }
    var w = rows.filter(function (o) { return WAIT[o.status]; })[0];
    if (w) return '<div class="card nx" style="margin-bottom:12px"><div class="tiny muted">ما عليك حاجة دابا</div><b>' + esc(WAIT[w.status]) + '</b><div class="small muted">' + esc(w.title) + '</div></div>';
    return '';
  }
  function patch() {
    if (typeof viewOrders !== 'function' || typeof sb === 'undefined') return false;
    if (window._cnx) return true; window._cnx = true;
    var v0 = viewOrders;
    viewOrders = async function () {
      await v0();
      try {
        var r = await sb.from('orders').select('id,title,status').eq('client_id', cid()).order('created_at', { ascending: false });
        var html = card(r.data || []);
        var pg = document.getElementById('page');
        if (html && pg && !pg.querySelector('.nx')) pg.insertAdjacentHTML('afterbegin', html);
      } catch (e) { }
    };
    var ch = null;
    function live() {
      if (ch || !S.me || (typeof isAdmin === 'function' && isAdmin() && !S.viewAs)) return;
      try {
        ch = sb.channel('ofa-my-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: 'client_id=eq.' + cid() }, function () {
          var h = location.hash;
          if (/^#\/orders/.test(h) || /^#\/order\//.test(h)) { clearTimeout(live.t); live.t = setTimeout(function () { route(); }, 400); }
          if (typeof refreshCounts === 'function') refreshCounts();
          if (typeof toast === 'function') toast('تحديث في طلبك');
        }).subscribe();
      } catch (e) { }
    }
    setInterval(live, 3000);
    return true;
  }
  var iv = setInterval(function () { if (patch()) clearInterval(iv); }, 300);
  setTimeout(function () { clearInterval(iv); }, 60000);
})();
