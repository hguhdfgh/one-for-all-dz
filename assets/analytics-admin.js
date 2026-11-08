/* analytics-admin.js — Comprehensive Page Analytics & Conversion Dashboard for ONE FOR ALL */
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

    // Copy to clipboard helper
    window.ofaCopyUtm = function (url) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          toast('تم نسخ الرابط الترويجي بنجاح! 📋');
        }).catch(function () {
          fallbackCopy(url);
        });
      } else {
        fallbackCopy(url);
      }
    };
    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        toast('تم نسخ الرابط بنجاح! 📋');
      } catch (e) {
        prompt('انسخ الرابط:', text);
      }
      document.body.removeChild(ta);
    }

    // Dynamic UTM link generator updater
    window.ofaUpdateUtmGen = function () {
      var page = document.getElementById('utm_page_sel').value;
      var src = document.getElementById('utm_src_sel').value;
      var med = document.getElementById('utm_med_sel').value;
      var camp = (document.getElementById('utm_camp_in').value || 'promo').trim().toLowerCase().replace(/\s+/g, '_');
      
      var base = 'https://one-for-all-dz.vercel.app' + page;
      var full = base + '?utm_source=' + encodeURIComponent(src) + '&utm_medium=' + encodeURIComponent(med) + '&utm_campaign=' + encodeURIComponent(camp);
      
      var disp = document.getElementById('utm_result_url');
      if (disp) disp.value = full;
    };

    // Analytics View Implementation
    A.analyticsView = async function (filterPage) {
      var timeRange = sessionStorage.getItem('ofa_an_time') || '7d';
      var selectedPage = filterPage || sessionStorage.getItem('ofa_an_page') || 'all';

      var pg = A.sh('analytics', 'تحليلات الصفحات ومعدل التحويل', '<div class="spin"></div>');

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

      // Fetch views and conversion events in parallel
      var results = await Promise.all([
        sb.from('page_views').select('*').gte('created_at', cutoff).order('created_at', { ascending: false }).limit(3000),
        sb.from('conversion_events').select('*').gte('created_at', cutoff).order('created_at', { ascending: false }).limit(1000)
      ]);

      var allViews = results[0].data || [];
      var allConvs = results[1].data || [];

      // Extract unique pages for dropdown filter
      var pagesMap = {};
      allViews.forEach(function (v) {
        var p = v.page || '/';
        pagesMap[p] = (pagesMap[p] || 0) + 1;
      });
      var availablePages = Object.keys(pagesMap).sort(function (a, b) { return pagesMap[b] - pagesMap[a]; });

      // Apply page filter
      var views = selectedPage === 'all' ? allViews : allViews.filter(function (v) { return v.page === selectedPage; });
      var convs = selectedPage === 'all' ? allConvs : allConvs.filter(function (c) { return c.page === selectedPage; });

      // KPIs
      var totalViews = views.length;
      var uniqueVisitors = new Set(views.map(function (v) { return v.visitor_id || v.id; })).size;
      var uniqueSessions = new Set(views.map(function (v) { return v.session_id || v.id; })).size;
      var totalConversions = convs.length;
      var conversionRate = uniqueVisitors ? ((totalConversions / uniqueVisitors) * 100).toFixed(1) : 0;
      var pipelineValue = convs.reduce(function (sum, c) { return sum + (c.price || 0); }, 0);

      var totalDuration = views.reduce(function (sum, v) { return sum + (v.duration_sec || 0); }, 0);
      var avgDurationSec = totalViews ? Math.round(totalDuration / totalViews) : 0;
      var avgDurationText = avgDurationSec > 60 ? (Math.floor(avgDurationSec / 60) + ' د و ' + (avgDurationSec % 60) + ' ث') : (avgDurationSec + ' ثانية');

      var mobileCount = views.filter(function (v) { return v.device_type === 'mobile'; }).length;
      var mobilePct = totalViews ? Math.round((mobileCount / totalViews) * 100) : 0;

      // Aggregations helper
      function aggregate(list, key, labelFn) {
        var counts = {};
        list.forEach(function (v) {
          var k = v[key] || 'غير محدد';
          counts[k] = (counts[k] || 0) + 1;
        });
        var arr = Object.keys(counts).map(function (k) {
          return { key: k, label: labelFn ? labelFn(k) : k, count: counts[k], pct: list.length ? Math.round((counts[k] / list.length) * 100) : 0 };
        });
        arr.sort(function (a, b) { return b.count - a.count; });
        return arr;
      }

      var sources = aggregate(views, 'referrer_domain');
      var devices = aggregate(views, 'device_type', function (k) { return k === 'mobile' ? 'هاتف (Mobile)' : (k === 'tablet' ? 'لوحي (Tablet)' : 'حاسوب (Desktop)'); });
      var browsers = aggregate(views, 'browser');
      var operatingSystems = aggregate(views, 'os');
      var cities = aggregate(views, 'city');
      var planConvs = aggregate(convs, 'plan_name');

      // Conversion rate by traffic source
      var sourceCR = {};
      sources.forEach(function (s) {
        var sViews = views.filter(function (v) { return (v.referrer_domain || 'مباشر') === s.key; });
        var sConvs = convs.filter(function (c) { return (c.referrer_domain || 'مباشر') === s.key; });
        var uVis = new Set(sViews.map(function (v) { return v.visitor_id; })).size;
        sourceCR[s.key] = {
          views: sViews.length,
          visitors: uVis,
          convs: sConvs.length,
          cr: uVis ? ((sConvs.length / uVis) * 100).toFixed(1) : 0
        };
      });

      // Pages Breakdown
      var pageStats = {};
      allViews.forEach(function (v) {
        var p = v.page || '/';
        if (!pageStats[p]) {
          pageStats[p] = { page: p, views: 0, visitors: new Set(), duration: 0, mobile: 0, convs: 0, topSource: {} };
        }
        pageStats[p].views++;
        if (v.visitor_id) pageStats[p].visitors.add(v.visitor_id);
        pageStats[p].duration += (v.duration_sec || 0);
        if (v.device_type === 'mobile') pageStats[p].mobile++;
        var src = v.referrer_domain || 'مباشر';
        pageStats[p].topSource[src] = (pageStats[p].topSource[src] || 0) + 1;
      });

      allConvs.forEach(function (c) {
        var p = c.page || '/';
        if (pageStats[p]) pageStats[p].convs++;
      });

      var pageList = Object.keys(pageStats).map(function (p) {
        var st = pageStats[p];
        var bestSrc = Object.keys(st.topSource).sort(function (a, b) { return st.topSource[b] - st.topSource[a]; })[0] || '—';
        var cr = st.visitors.size ? ((st.convs / st.visitors.size) * 100).toFixed(1) : 0;
        return {
          page: p,
          views: st.views,
          unique: st.visitors.size,
          convs: st.convs,
          cr: cr,
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
              ${ic('chart')} تحليلات الصفحات ومعدل التحويل (CR%)
            </h2>
            <div class="small muted">تتبع حي للمشاهدات، نقرات الواتساب، والتحويلات لكل مصدر تسويقي.</div>
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

        <!-- 5 KPI Cards -->
        <div class="grid g5" style="margin-bottom:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
          <div class="card kpi">
            <span>إجمالي المشاهدات</span>
            <b class="num" style="font-size:26px;color:var(--green)">${totalViews}</b>
            <div class="tiny muted">${selectedPage === 'all' ? 'عبر كامل الموقع' : pageDisplayName(selectedPage)}</div>
          </div>
          <div class="card kpi">
            <span>الزوار الفريدون</span>
            <b class="num" style="font-size:26px">${uniqueVisitors}</b>
            <div class="tiny muted">${uniqueSessions} جلسة نشطة</div>
          </div>
          <div class="card kpi" style="border-inline-start:3px solid #22B04B">
            <span>نقرات الواتساب (تحويلات)</span>
            <b class="num" style="font-size:26px;color:#22B04B">🔥 ${totalConversions}</b>
            <div class="tiny muted">معدل التحويل: <b>${conversionRate}%</b></div>
          </div>
          <div class="card kpi">
            <span>قيمة الطلبات المتوقعة</span>
            <b class="num" style="font-size:24px;color:#0B5E27">${money(pipelineValue)}</b>
            <div class="tiny muted">إجمالي الباقات المختارة</div>
          </div>
          <div class="card kpi">
            <span>متوسط وقت البقاء</span>
            <b class="num" style="font-size:24px">${avgDurationText}</b>
            <div class="tiny muted">${mobilePct}% من الهواتف</div>
          </div>
        </div>

        <!-- Conversion Breakdown by Plan (If CapCut or All) -->
        ${planConvs.length ? `
        <div class="card" style="margin-bottom:18px">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0;font-size:16px">🎯 تفصيل التحويلات حسب الباقة (الطلبات الأكثر طلباً)</h3>
            <span class="chip">${totalConversions} طلب نقر</span>
          </div>
          <div class="row" style="gap:12px;flex-wrap:wrap">
            ${planConvs.map(function (pl) {
              return `
                <div style="flex:1;min-width:180px;background:var(--surface-2);border-radius:14px;padding:12px 14px">
                  <div class="row between"><b class="small">${esc(pl.label)}</b><span class="chip pri">${pl.count}</span></div>
                  <div style="background:rgba(0,0,0,0.08);height:6px;border-radius:99px;margin:8px 0;overflow:hidden">
                    <div style="background:var(--green);height:100%;width:${pl.pct}%"></div>
                  </div>
                  <div class="tiny muted">${pl.pct}% من إجمالي التحويلات</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Traffic Sources & Conversion Rate (CR%) by Source -->
        <div class="grid g2" style="margin-bottom:18px;align-items:start">
          
          <!-- Sources & Conversion Power -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">${ic('globe')} مصادر الزيارات وقوة التحويل (CR%)</h3>
              <span class="chip">${sources.length} مصادر</span>
            </div>
            <div class="list">
              ${sources.length ? sources.map(function (s) {
                var crData = sourceCR[s.key] || { convs: 0, cr: 0 };
                return `
                  <div class="li" style="cursor:default;flex-direction:column;align-items:stretch;gap:6px">
                    <div class="row between">
                      <div class="row" style="gap:8px">
                        <span class="chip" style="${badgeColor(s.key)};font-weight:600">${esc(s.label)}</span>
                        <span class="tiny muted">${s.count} زيارة</span>
                      </div>
                      <div class="row" style="gap:8px">
                        <span class="chip" style="background:rgba(34,176,75,0.15);color:var(--green-deep);font-weight:700">CR: ${crData.cr}%</span>
                        <b class="num small">${crData.convs} نقرة</b>
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

        <!-- Pages Comparison Table -->
        ${selectedPage === 'all' ? `
        <div class="card" style="margin-bottom:18px">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0;font-size:16px">${ic('grid')} أداء الصفحات الفردية والتحويلات</h3>
            <span class="chip">${pageList.length} صفحات</span>
          </div>
          <div style="overflow-x:auto">
            <table class="table" style="width:100%;text-align:start;font-size:13.5px;border-collapse:collapse">
              <thead>
                <tr style="border-bottom:1px solid var(--line);color:var(--muted)">
                  <th style="padding:8px 10px">الصفحة</th>
                  <th style="padding:8px 10px">الزيارات</th>
                  <th style="padding:8px 10px">الزوار الفريدون</th>
                  <th style="padding:8px 10px">التحويلات</th>
                  <th style="padding:8px 10px">معدل التحويل (CR)</th>
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
                      <td style="padding:10px"><b class="num" style="color:var(--green)">${p.convs}</b></td>
                      <td style="padding:10px"><span class="chip" style="font-weight:700">${p.cr}%</span></td>
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

        <!-- Interactive UTM Campaign Link Generator -->
        <div class="card" style="margin-bottom:18px;background:color-mix(in srgb,var(--surface) 95%,var(--green));border:1px solid color-mix(in srgb,var(--line) 80%,var(--green))">
          <div class="row between" style="margin-bottom:12px">
            <div>
              <h3 style="margin:0 0 2px 0;font-size:16px;display:flex;align-items:center;gap:6px">
                🔗 مولد روابط الحملات الترويجية (UTM Generator)
              </h3>
              <div class="tiny muted">أنشئ روابط مخصصة لوضعها في بايو تيك توك، ستوري إنستغرام، أو إعلانات ممولة لتتبع مبيعاتها بدقة.</div>
            </div>
            <span class="chip pri">أداة تسويق</span>
          </div>

          <div class="grid g4" style="gap:10px;margin-bottom:12px">
            <div class="f">
              <label style="font-size:12px">الصفحة المستهدفة</label>
              <select class="in" id="utm_page_sel" onchange="ofaUpdateUtmGen()">
                <option value="/capcut">صفحة CapCut Pro (/capcut)</option>
                <option value="/">الصفحة الرئيسية (/)</option>
                <option value="/store">المتجر الرقمي (/store)</option>
                <option value="/video-ads">إعلانات الفيديو (/video-ads)</option>
              </select>
            </div>
            <div class="f">
              <label style="font-size:12px">المنصة (Source)</label>
              <select class="in" id="utm_src_sel" onchange="ofaUpdateUtmGen()">
                <option value="tiktok">TikTok (تيك توك)</option>
                <option value="instagram">Instagram (إنستغرام)</option>
                <option value="facebook">Facebook (فيسبوك)</option>
                <option value="whatsapp">WhatsApp (واتساب)</option>
                <option value="youtube">YouTube (يوتيوب)</option>
              </select>
            </div>
            <div class="f">
              <label style="font-size:12px">مكان النشر (Medium)</label>
              <select class="in" id="utm_med_sel" onchange="ofaUpdateUtmGen()">
                <option value="bio">Bio الرابط في البايو</option>
                <option value="story">Story ستوري</option>
                <option value="ad">Paid Ad إعلان ممول</option>
                <option value="dm">DM رسائل خاصة</option>
                <option value="video_desc">وصف الفيديو</option>
              </select>
            </div>
            <div class="f">
              <label style="font-size:12px">اسم الحملة (Campaign)</label>
              <input class="in" id="utm_camp_in" value="november_promo" placeholder="مثال: black_friday" oninput="ofaUpdateUtmGen()">
            </div>
          </div>

          <div class="row" style="gap:10px">
            <input class="in grow" id="utm_result_url" readonly style="direction:ltr;text-align:left;font-family:monospace;font-size:12.5px" value="https://one-for-all-dz.vercel.app/capcut?utm_source=tiktok&utm_medium=bio&utm_campaign=november_promo">
            <button class="btn pri" onclick="ofaCopyUtm(document.getElementById('utm_result_url').value)">نسخ الرابط 📋</button>
          </div>
        </div>

        <!-- Geographic & Realtime Stream -->
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

          <!-- Real-time Conversions & Visitor Stream -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">⚡ آخر التحويلات ونقرات الواتساب الحية</h3>
              <span class="chip pri">مباشر</span>
            </div>
            <div class="list">
              ${convs.slice(0, 8).map(function (c) {
                return `
                  <div class="li" style="cursor:default;align-items:start;padding:8px 0;border-inline-start:3px solid var(--green);padding-inline-start:8px">
                    <span class="av" style="font-size:13px;background:rgba(34,176,75,0.15);color:var(--green-deep)">💬</span>
                    <div class="grow" style="min-width:0">
                      <div class="row between nowrap">
                        <b class="small ell" style="color:var(--green-deep)">${esc(c.plan_name || 'طلب اشتراك')}</b>
                        <span class="tiny faint">${timeAgo(c.created_at)}</span>
                      </div>
                      <div class="tiny muted" style="margin-top:2px">
                        ${c.price ? '<b>' + money(c.price) + '</b> · ' : ''}
                        ${esc(c.city || 'الجزائر')} · <span class="chip" style="font-size:10px;padding:2px 6px">${esc(c.referrer_domain || 'مباشر')}</span> · ${esc(c.browser || '')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
              ${!convs.length ? '<div class="empty">لا توجد تحويلات مسجلة بعد لهذه الفترة</div>' : ''}
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
