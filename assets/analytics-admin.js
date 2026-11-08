/* analytics-admin.js — Comprehensive Page Analytics Dashboard for ONE FOR ALL */
(function () {
  function patch() {
    var A = window.Admin;
    if (!A) return false;
    if (A._analytics) return true;
    A._analytics = true;

    // Add Analytics to Nav
    var nav0 = A.nav.bind(A);
    A.nav = function () {
      var n = nav0();
      var idx = n.findIndex(function (x) { return x.k === 'stats' || x.k === 'finance'; });
      n.splice(idx >= 0 ? idx + 1 : n.length, 0, {
        k: 'analytics',
        h: '#/a/analytics',
        i: 'chart',
        l: 'تحليلات الصفحات'
      });
      return n;
    };

    // Route
    var route0 = A.route.bind(A);
    A.route = function (b, c) {
      if (b === 'analytics') return A.analyticsView(c);
      return route0(b, c);
    };

    // Analytics View Implementation
    A.analyticsView = async function (filterPage) {
      var timeRange = sessionStorage.getItem('ofa_an_time') || '7d';
      var selectedPage = filterPage || sessionStorage.getItem('ofa_an_page') || 'all';

      var pg = A.sh('analytics', 'تحليلات الصفحات والزوار', '<div class="spin"></div>');

      // Date cutoff
      var now = Date.now();
      var cutoff = new Date(now - 7 * 864e5).toISOString();
      if (timeRange === 'today') {
        var d = new Date(); d.setHours(0, 0, 0, 0);
        cutoff = d.toISOString();
      } else if (timeRange === '30d') {
        cutoff = new Date(now - 30 * 864e5).toISOString();
      } else if (timeRange === 'all') {
        cutoff = new Date(0).toISOString();
      }

      // Fetch views
      var res = await sb.from('page_views')
        .select('*')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .limit(3000);

      var allViews = res.data || [];

      // Extract unique pages for dropdown filter
      var pagesMap = {};
      allViews.forEach(function (v) {
        var p = v.page || '/';
        pagesMap[p] = (pagesMap[p] || 0) + 1;
      });
      var availablePages = Object.keys(pagesMap).sort(function (a, b) { return pagesMap[b] - pagesMap[a]; });

      // Apply page filter
      var views = selectedPage === 'all' ? allViews : allViews.filter(function (v) { return v.page === selectedPage; });

      // KPIs
      var totalViews = views.length;
      var uniqueVisitors = new Set(views.map(function (v) { return v.visitor_id || v.id; })).size;
      var uniqueSessions = new Set(views.map(function (v) { return v.session_id || v.id; })).size;
      var totalDuration = views.reduce(function (sum, v) { return sum + (v.duration_sec || 0); }, 0);
      var avgDurationSec = totalViews ? Math.round(totalDuration / totalViews) : 0;
      var avgDurationText = avgDurationSec > 60 ? (Math.floor(avgDurationSec / 60) + ' د و ' + (avgDurationSec % 60) + ' ث') : (avgDurationSec + ' ثانية');

      var mobileCount = views.filter(function (v) { return v.device_type === 'mobile'; }).length;
      var mobilePct = totalViews ? Math.round((mobileCount / totalViews) * 100) : 0;

      // Aggregations helper
      function aggregate(key, labelFn) {
        var counts = {};
        views.forEach(function (v) {
          var k = v[key] || 'غير محدد';
          counts[k] = (counts[k] || 0) + 1;
        });
        var list = Object.keys(counts).map(function (k) {
          return { key: k, label: labelFn ? labelFn(k) : k, count: counts[k], pct: totalViews ? Math.round((counts[k] / totalViews) * 100) : 0 };
        });
        list.sort(function (a, b) { return b.count - a.count; });
        return list;
      }

      var sources = aggregate('referrer_domain');
      var devices = aggregate('device_type', function (k) { return k === 'mobile' ? 'هاتف (Mobile)' : (k === 'tablet' ? 'لوحي (Tablet)' : 'حاسوب (Desktop)'); });
      var browsers = aggregate('browser');
      var operatingSystems = aggregate('os');
      var cities = aggregate('city');
      var countries = aggregate('country');

      // Pages Breakdown
      var pageStats = {};
      allViews.forEach(function (v) {
        var p = v.page || '/';
        if (!pageStats[p]) {
          pageStats[p] = { page: p, views: 0, visitors: new Set(), duration: 0, mobile: 0, topSource: {} };
        }
        pageStats[p].views++;
        if (v.visitor_id) pageStats[p].visitors.add(v.visitor_id);
        pageStats[p].duration += (v.duration_sec || 0);
        if (v.device_type === 'mobile') pageStats[p].mobile++;
        var src = v.referrer_domain || 'مباشر';
        pageStats[p].topSource[src] = (pageStats[p].topSource[src] || 0) + 1;
      });

      var pageList = Object.keys(pageStats).map(function (p) {
        var st = pageStats[p];
        var bestSrc = Object.keys(st.topSource).sort(function (a, b) { return st.topSource[b] - st.topSource[a]; })[0] || '—';
        return {
          page: p,
          views: st.views,
          unique: st.visitors.size,
          avgSec: st.views ? Math.round(st.duration / st.views) : 0,
          mobilePct: st.views ? Math.round((st.mobile / st.views) * 100) : 0,
          topSource: bestSrc
        };
      }).sort(function (a, b) { return b.views - a.views; });

      function timeAgo(iso) {
        if (!iso) return '—';
        var sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
        if (sec < 60) return 'منذ ثوانٍ';
        if (sec < 3600) return 'منذ ' + Math.floor(sec / 60) + ' دقيقة';
        if (sec < 86400) return 'منذ ' + Math.floor(sec / 3600) + ' ساعة';
        return 'منذ ' + Math.floor(sec / 86400) + ' يوم';
      }

      function badgeColor(name) {
        if (/tiktok/i.test(name)) return 'background:#000;color:#fff;border-color:#FE2C55';
        if (/instagram/i.test(name)) return 'background:linear-gradient(45deg,#f09433,#bc1888);color:#fff';
        if (/facebook/i.test(name)) return 'background:#1877F2;color:#fff';
        if (/google/i.test(name)) return 'background:#EA4335;color:#fff';
        if (/whatsapp/i.test(name)) return 'background:#25D366;color:#fff';
        return 'background:var(--surface-2);color:var(--ink)';
      }

      var pageDisplayName = function (p) {
        if (p === '/' || p === '/index.html') return 'الصفحة الرئيسية (/)';
        if (p === '/capcut' || p === '/capcut.html') return 'صفحة CapCut Pro الجانبية (/capcut)';
        if (p === '/app' || p === '/app.html') return 'لوحة التطبيق (/app)';
        if (p === '/store' || p === '/store.html') return 'المتجر الرقمي (/store)';
        if (p === '/ads' || p === '/ads.html') return 'إعلانات إبداعية (/ads)';
        if (p === '/tiktok-ads' || p === '/tiktok-ads.html') return 'إعلانات تيك توك (/tiktok-ads)';
        if (p === '/video-ads' || p === '/video-ads.html') return 'إعلانات الفيديو (/video-ads)';
        if (p === '/web' || p === '/web.html') return 'تصاميم الويب (/web)';
        return p;
      };

      // HTML Render
      pg.innerHTML = `
        <div class="row between" style="margin-bottom:16px;flex-wrap:wrap;gap:10px">
          <div>
            <h2 style="margin:0 0 4px 0;font-size:22px;display:flex;align-items:center;gap:8px">
              ${ic('chart')} تحليلات الصفحات والزيارات
            </h2>
            <div class="small muted">تحليلات مفصلة ودقيقة لمصادر الزوار، الأجهزة، والصفحات المتفاعلة.</div>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <select class="in" id="an_page_sel" style="max-width:240px;font-size:13px" onchange="sessionStorage.setItem('ofa_an_page', this.value); Admin.analyticsView(this.value)">
              <option value="all" ${selectedPage === 'all' ? 'selected' : ''}>📊 كل الصفحات (${allViews.length})</option>
              ${availablePages.map(function (p) {
                return '<option value="' + esc(p) + '" ' + (selectedPage === p ? 'selected' : '') + '>' + esc(pageDisplayName(p)) + ' (' + pagesMap[p] + ')</option>';
              }).join('')}
            </select>
            <div class="seg">
              <button class="${timeRange === 'today' ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_an_time','today');Admin.analyticsView('${selectedPage}')">اليوم</button>
              <button class="${timeRange === '7d' ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_an_time','7d');Admin.analyticsView('${selectedPage}')">7 أيام</button>
              <button class="${timeRange === '30d' ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_an_time','30d');Admin.analyticsView('${selectedPage}')">30 يوم</button>
              <button class="${timeRange === 'all' ? 'on' : ''}" onclick="sessionStorage.setItem('ofa_an_time','all');Admin.analyticsView('${selectedPage}')">الكل</button>
            </div>
            <button class="btn icon sm ghost" title="تحديث" onclick="Admin.analyticsView('${selectedPage}')">${ic('clock')}</button>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid g4" style="margin-bottom:18px">
          <div class="card kpi" style="border-start-start-radius:18px">
            <span>إجمالي المشاهدات</span>
            <b class="num" style="font-size:26px;color:var(--green)">${totalViews}</b>
            <div class="tiny muted">${selectedPage === 'all' ? 'عبر كامل الموقع' : pageDisplayName(selectedPage)}</div>
          </div>
          <div class="card kpi">
            <span>الزوار الفريدون</span>
            <b class="num" style="font-size:26px">${uniqueVisitors}</b>
            <div class="tiny muted">${uniqueSessions} جلسة نشطة</div>
          </div>
          <div class="card kpi">
            <span>متوسط وقت البقاء</span>
            <b class="num" style="font-size:26px">${avgDurationText}</b>
            <div class="tiny muted">تفاعل الزائر داخل الصفحة</div>
          </div>
          <div class="card kpi" style="border-start-end-radius:18px">
            <span>نسبة الهاتف</span>
            <b class="num" style="font-size:26px;color:#1877F2">${mobilePct}%</b>
            <div class="tiny muted">${mobileCount} زيارة من الهاتف</div>
          </div>
        </div>

        <!-- Pages Comparison Table (Shown if All Pages is selected) -->
        ${selectedPage === 'all' ? `
        <div class="card" style="margin-bottom:18px">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0;font-size:16px">${ic('grid')} أداء الصفحات الفردية</h3>
            <span class="chip">${pageList.length} صفحات</span>
          </div>
          <div style="overflow-x:auto">
            <table class="table" style="width:100%;text-align:start;font-size:13.5px;border-collapse:collapse">
              <thead>
                <tr style="border-bottom:1px solid var(--line);color:var(--muted)">
                  <th style="padding:8px 10px">الصفحة</th>
                  <th style="padding:8px 10px">الزيارات</th>
                  <th style="padding:8px 10px">الزوار الفريدون</th>
                  <th style="padding:8px 10px">متوسط الوقت</th>
                  <th style="padding:8px 10px">نسبة الهاتف</th>
                  <th style="padding:8px 10px">أهم مصدر</th>
                  <th style="padding:8px 10px">إجراء</th>
                </tr>
              </thead>
              <tbody>
                ${pageList.map(function (p) {
                  return `
                    <tr style="border-bottom:1px solid var(--line)">
                      <td style="padding:10px">
                        <b>${esc(pageDisplayName(p.page))}</b>
                        <div class="tiny faint ltr">${esc(p.page)}</div>
                      </td>
                      <td style="padding:10px"><b class="num">${p.views}</b></td>
                      <td style="padding:10px">${p.unique}</td>
                      <td style="padding:10px">${p.avgSec} ثانية</td>
                      <td style="padding:10px">${p.mobilePct}%</td>
                      <td style="padding:10px"><span class="chip" style="font-size:11px">${esc(p.topSource)}</span></td>
                      <td style="padding:10px">
                        <button class="btn sm" onclick="sessionStorage.setItem('ofa_an_page','${esc(p.page)}');Admin.analyticsView('${esc(p.page)}')">تفاصيل</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        <!-- Sources, Devices & Locations Breakdown -->
        <div class="grid g2" style="margin-bottom:18px;align-items:start">
          
          <!-- Sources (Referrers) -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">${ic('globe')} مصادر الزيارات (من أين جاء الزبون؟)</h3>
              <span class="chip">${sources.length}</span>
            </div>
            <div class="list">
              ${sources.length ? sources.map(function (s) {
                return `
                  <div class="li" style="cursor:default;flex-direction:column;align-items:stretch;gap:4px">
                    <div class="row between">
                      <span class="chip" style="${badgeColor(s.key)};font-weight:600">${esc(s.label)}</span>
                      <div class="row" style="gap:8px">
                        <b class="num">${s.count}</b>
                        <span class="tiny faint">(${s.pct}%)</span>
                      </div>
                    </div>
                    <div style="background:var(--surface-2);height:5px;border-radius:99px;overflow:hidden">
                      <div style="background:var(--green);height:100%;width:${s.pct}%;border-radius:99px"></div>
                    </div>
                  </div>
                `;
              }).join('') : '<div class="empty">لا توجد بيانات كافية</div>'}
            </div>
          </div>

          <!-- Devices, Browsers & OS -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">${ic('box')} نوع الأجهزة والمتصفحات</h3>
              <span class="chip">${devices.length} أنواع</span>
            </div>
            
            <b class="small" style="display:block;margin:6px 0">الأجهزة:</b>
            <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap">
              ${devices.map(function (d) {
                return '<span class="chip" style="font-size:12px"><b>' + esc(d.label) + '</b>: ' + d.count + ' (' + d.pct + '%)</span>';
              }).join('')}
            </div>

            <b class="small" style="display:block;margin:6px 0">المتصفحات (بما فيها تطبيقات التواصل):</b>
            <div class="list" style="margin-bottom:12px">
              ${browsers.slice(0, 5).map(function (b) {
                return `
                  <div class="li" style="cursor:default;padding:6px 0">
                    <span class="small">${esc(b.label)}</span>
                    <span class="grow"></span>
                    <b class="num small">${b.count}</b>
                    <span class="tiny faint">(${b.pct}%)</span>
                  </div>
                `;
              }).join('')}
            </div>

            <b class="small" style="display:block;margin:6px 0">نظام التشغيل (OS):</b>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              ${operatingSystems.map(function (o) {
                return '<span class="chip" style="font-size:11px">' + esc(o.label) + ' (' + o.count + ')</span>';
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Geographic & Realtime Visitors -->
        <div class="grid g2" style="align-items:start">
          
          <!-- Locations / Cities -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">${ic('home')} التوزيع الجغرافي والولايات</h3>
              <span class="chip">${cities.length} مدن</span>
            </div>
            <div class="list">
              ${cities.slice(0, 8).map(function (c) {
                return `
                  <div class="li" style="cursor:default">
                    <span class="small">${esc(c.label)}</span>
                    <span class="grow"></span>
                    <b class="num small">${c.count}</b>
                    <span class="tiny faint">(${c.pct}%)</span>
                  </div>
                `;
              }).join('')}
              ${!cities.length ? '<div class="empty">لا توجد بيانات جغرافية</div>' : ''}
            </div>
          </div>

          <!-- Real-time Visitor Stream -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">${ic('user')} آخر الزيارات المباشرة</h3>
              <span class="chip" style="background:#22B04B;color:#fff">مباشر</span>
            </div>
            <div class="list">
              ${views.slice(0, 10).map(function (v) {
                return `
                  <div class="li" style="cursor:default;align-items:start;padding:8px 0">
                    <span class="av" style="font-size:11px;background:var(--surface-2)">${v.device_type === 'mobile' ? '📱' : '💻'}</span>
                    <div class="grow" style="min-width:0">
                      <div class="row between nowrap">
                        <b class="small ell">${esc(pageDisplayName(v.page))}</b>
                        <span class="tiny faint">${timeAgo(v.created_at)}</span>
                      </div>
                      <div class="tiny muted" style="margin-top:2px">
                        ${esc(v.city || 'الجزائر')} · <span class="chip" style="font-size:10px;padding:2px 6px">${esc(v.referrer_domain || 'مباشر')}</span> · ${esc(v.browser || '')}
                        ${v.duration_sec ? ' · بقاء: ' + v.duration_sec + ' ث' : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
              ${!views.length ? '<div class="empty">لا توجد زيارات مسجلة بعد</div>' : ''}
            </div>
          </div>

        </div>
      `;
    };
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    patch();
  } else {
    window.addEventListener('DOMContentLoaded', patch);
  }
})();
