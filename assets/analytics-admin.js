/* analytics-admin.js (v2.0) — 360° Live Radar, Funnel, Geo & Conversion Intelligence */
(function () {
  function patch() {
    var A = window.Admin;
    if (!A) return false;
    if (A._analytics_v2) return true;
    A._analytics_v2 = true;

    // Add Analytics to Nav
    var nav0 = A.nav.bind(A);
    A.nav = function () {
      var n = nav0();
      var idx = n.findIndex(function (x) { return x.k === 'stats' || x.k === 'finance'; });
      n.splice(idx >= 0 ? idx + 1 : n.length, 0, {
        k: 'analytics',
        h: '#/a/analytics',
        i: 'chart',
        l: 'تحليلات 360° والرادار'
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

    // Export CSV Helper
    window.ofaExportConversionsCSV = function (convs) {
      if (!convs || !convs.length) return toast('لا توجد بيانات لتصديرها');
      var headers = ['ID', 'Date', 'Page', 'Plan', 'Price (DZD)', 'Decision Latency (sec)', 'Wilaya', 'Source', 'Device', 'Browser'];
      var rows = convs.map(function (c) {
        return [
          c.id,
          new Date(c.created_at).toLocaleString('ar-DZ'),
          c.page,
          '"' + (c.plan_name || '').replace(/"/g, '""') + '"',
          c.price || 0,
          c.decision_latency_sec || 0,
          '"' + (c.wilaya || c.city || 'الجزائر').replace(/"/g, '""') + '"',
          '"' + (c.referrer_domain || 'مباشر').replace(/"/g, '""') + '"',
          c.device_type,
          '"' + (c.browser || '').replace(/"/g, '""') + '"'
        ].join(',');
      });
      var csvContent = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
      var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'conversions_one_for_all_' + new Date().toISOString().slice(0, 10) + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('تم تحميل ملف التقرير بنجاح! 📥');
    };

    // Analytics View Implementation
    A.analyticsView = async function (filterPage) {
      var timeRange = sessionStorage.getItem('ofa_an_time') || '7d';
      var selectedPage = filterPage || sessionStorage.getItem('ofa_an_page') || 'all';

      var pg = A.sh('analytics', 'تحليلات 360° والرادار اللحظي', '<div class="spin"></div>');

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

      // Live Pulse active threshold (last 25 seconds)
      var activeCutoff = new Date(now - 25000).toISOString();

      // Fetch views and conversions in parallel
      var results = await Promise.all([
        sb.from('page_views').select('*').gte('created_at', cutoff).order('created_at', { ascending: false }).limit(3000),
        sb.from('conversion_events').select('*').gte('created_at', cutoff).order('created_at', { ascending: false }).limit(1000),
        sb.from('page_views').select('*').gte('last_seen_at', activeCutoff).order('last_seen_at', { ascending: false })
      ]);

      var allViews = results[0].data || [];
      var allConvs = results[1].data || [];
      var liveVisitors = results[2].data || [];

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
      var liveForPage = selectedPage === 'all' ? liveVisitors : liveVisitors.filter(function (l) { return l.page === selectedPage; });

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

      // Decision latency average
      var convLatencies = convs.map(function (c) { return c.decision_latency_sec; }).filter(function (n) { return n && n > 0; });
      var avgLatencySec = convLatencies.length ? Math.round(convLatencies.reduce(function (a, b) { return a + b; }, 0) / convLatencies.length) : 0;
      var avgLatencyText = avgLatencySec > 60 ? (Math.floor(avgLatencySec / 60) + ' د و ' + (avgLatencySec % 60) + ' ث') : (avgLatencySec ? (avgLatencySec + ' ث') : '—');

      // Funnel Milestones
      var reachedHero = views.length;
      var reachedOffers = views.filter(function (v) { return (v.scroll_depth || 0) >= 25; }).length;
      var inspectedDetails = views.filter(function (v) { return (v.scroll_depth || 0) >= 50; }).length;
      var clickedCTA = convs.length;

      var f1 = reachedHero ? 100 : 0;
      var f2 = reachedHero ? Math.round((reachedOffers / reachedHero) * 100) : 0;
      var f3 = reachedHero ? Math.round((inspectedDetails / reachedHero) * 100) : 0;
      var f4 = reachedHero ? Math.round((clickedCTA / reachedHero) * 100) : 0;

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
      var devices = aggregate(views, 'device_model');
      var browsers = aggregate(views, 'browser');
      var wilayas = aggregate(views, 'wilaya');
      var isps = aggregate(views, 'isp');
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
        <div class="row between" style="margin-bottom:16px;flex-wrap:wrap;gap:12px">
          <div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
              <h2 style="margin:0;font-size:22px;display:flex;align-items:center;gap:8px">
                ${ic('chart')} تحليلات 360° والرادار اللحظي
              </h2>
              <span class="chip" style="background:#DCFCE7;color:#15843A;font-weight:700;animation:pulse 2s infinite">
                🟢 ${liveForPage.length} متصلين الآن
              </span>
            </div>
            <div class="small muted">تتبع حي ومفصل لرحلة الزائر، قمع التحويل، ولايات الجزائر، وشبكات الاتصال.</div>
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
            <button class="btn sm ghost" onclick="ofaExportConversionsCSV(${esc(JSON.stringify(convs))})" title="تصدير ملف Excel">${ic('download')} تصدير CSV</button>
          </div>
        </div>

        <!-- Real-time Live Radar Strip (If visitors are active now) -->
        ${liveForPage.length ? `
        <div class="card" style="margin-bottom:18px;background:linear-gradient(135deg,#0E1F15,#15843A);color:#fff;border:0;box-shadow:0 12px 30px rgba(21,132,58,0.25)">
          <div class="row between" style="margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#3DC163;box-shadow:0 0 12px #3DC163;animation:pulse 1.5s infinite"></span>
              <b style="font-size:15px">رادار الحضور الحي: ${liveForPage.length} أشخاص يتصفحون الموقع في هذه الثانية!</b>
            </div>
            <span class="chip" style="background:rgba(255,255,255,0.2);color:#fff">مباشر</span>
          </div>
          <div class="row" style="gap:10px;overflow-x:auto;padding-bottom:4px">
            ${liveForPage.map(function (lv) {
              return `
                <div style="background:rgba(255,255,255,0.14);backdrop-filter:blur(10px);border-radius:12px;padding:8px 12px;min-width:210px;flex:1">
                  <div class="row between"><b style="font-size:13px">${esc(pageDisplayName(lv.page))}</b><span class="tiny" style="color:#C9F0D5">${lv.duration_sec || 0} ثانية</span></div>
                  <div class="tiny" style="color:rgba(255,255,255,0.85);margin-top:2px">
                    📍 ${esc(lv.wilaya || lv.city || 'الجزائر')} · 📱 ${esc(lv.device_model || lv.browser || '')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}

        <!-- 6 Main KPI Cards -->
        <div class="grid g6" style="margin-bottom:18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
          <div class="card kpi">
            <span>إجمالي المشاهدات</span>
            <b class="num" style="font-size:24px;color:var(--green)">${totalViews}</b>
            <div class="tiny muted">${selectedPage === 'all' ? 'كامل الموقع' : pageDisplayName(selectedPage)}</div>
          </div>
          <div class="card kpi">
            <span>الزوار الفريدون</span>
            <b class="num" style="font-size:24px">${uniqueVisitors}</b>
            <div class="tiny muted">${uniqueSessions} جلسة نشطة</div>
          </div>
          <div class="card kpi" style="border-inline-start:3px solid #22B04B">
            <span>تحويلات الواتساب</span>
            <b class="num" style="font-size:24px;color:#22B04B">🔥 ${totalConversions}</b>
            <div class="tiny muted">معدل التحويل: <b>${conversionRate}%</b></div>
          </div>
          <div class="card kpi">
            <span>قيمة الطلبات</span>
            <b class="num" style="font-size:22px;color:#0B5E27">${money(pipelineValue)}</b>
            <div class="tiny muted">إجمالي الباقات</div>
          </div>
          <div class="card kpi">
            <span>سرعة اتخاذ القرار</span>
            <b class="num" style="font-size:22px">${avgLatencyText}</b>
            <div class="tiny muted">متوسط زمن الشراء</div>
          </div>
          <div class="card kpi">
            <span>نسبة الهاتف</span>
            <b class="num" style="font-size:22px;color:#1877F2">${mobilePct}%</b>
            <div class="tiny muted">${avgDurationText} متوسط التصفح</div>
          </div>
        </div>

        <!-- Sales & Behavioral Funnel (قمع التحويل وسلوك التصفح) -->
        <div class="card" style="margin-bottom:18px">
          <div class="row between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0 0 2px 0;font-size:16px">📉 قمع التحويل ومراحل الزائر (Conversion Funnel)</h3>
              <div class="tiny muted">معرفة أين يغادر الزائر بالتحديد بين فتح الصفحة والنزول للعروض ونقر الواتساب:</div>
            </div>
            <span class="chip pri">سلوك الزبائن</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px">
            <!-- Stage 1 -->
            <div>
              <div class="row between small" style="margin-bottom:4px">
                <span>1. فتح الصفحة ومشاهدة الهيرو (Pageview)</span>
                <b>${reachedHero} زائر (${f1}%)</b>
              </div>
              <div style="background:var(--surface-2);height:10px;border-radius:99px;overflow:hidden">
                <div style="background:#22B04B;height:100%;width:${f1}%;border-radius:99px"></div>
              </div>
            </div>

            <!-- Stage 2 -->
            <div>
              <div class="row between small" style="margin-bottom:4px">
                <span>2. تجاوز الهيرو والتمرير نحو العروض (Scroll >= 25%)</span>
                <b>${reachedOffers} زائر (${f2}%)</b>
              </div>
              <div style="background:var(--surface-2);height:10px;border-radius:99px;overflow:hidden">
                <div style="background:#3DC163;height:100%;width:${f2}%;border-radius:99px"></div>
              </div>
            </div>

            <!-- Stage 3 -->
            <div>
              <div class="row between small" style="margin-bottom:4px">
                <span>3. قراءة تفاصيل الضمان والذكاء الاصطناعي (Scroll >= 50%)</span>
                <b>${inspectedDetails} زائر (${f3}%)</b>
              </div>
              <div style="background:var(--surface-2);height:10px;border-radius:99px;overflow:hidden">
                <div style="background:#15843A;height:100%;width:${f3}%;border-radius:99px"></div>
              </div>
            </div>

            <!-- Stage 4 -->
            <div>
              <div class="row between small" style="margin-bottom:4px">
                <span style="color:#0B5E27;font-weight:700">4. الضغط على زر الواتساب واختيار الباقة (Conversion Click) 🔥</span>
                <b style="color:#0B5E27">${clickedCTA} تحويل (${f4}%)</b>
              </div>
              <div style="background:var(--surface-2);height:10px;border-radius:99px;overflow:hidden">
                <div style="background:#0FAA60;height:100%;width:${f4}%;border-radius:99px;box-shadow:0 0 8px #0FAA60"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Algerian Wilayas & Telecom Operators -->
        <div class="grid g2" style="margin-bottom:18px;align-items:start">
          
          <!-- Algerian Wilayas Ranking -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">🇩🇿 ترتيب ولايات الجزائر الأكثر زيارة وطلباً</h3>
              <span class="chip">${wilayas.length} ولايات</span>
            </div>
            <div class="list">
              ${wilayas.slice(0, 8).map(function (w, idx) {
                return `
                  <div class="li" style="cursor:default;padding:6px 0">
                    <span class="chip" style="font-size:11px;min-width:24px;text-align:center">${idx + 1}</span>
                    <span class="small"><b>${esc(w.label)}</b></span>
                    <span class="grow"></span>
                    <b class="num small">${w.count}</b>
                    <span class="tiny faint">(${w.pct}%)</span>
                  </div>
                `;
              }).join('')}
              ${!wilayas.length ? '<div class="empty">لا توجد بيانات ولايات كافية بعد</div>' : ''}
            </div>
          </div>

          <!-- Telecom Operators & Device Models -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">📶 شبكات الاتصال ونوع الهواتف في الجزائر</h3>
              <span class="chip">مواصفات الجمهور</span>
            </div>

            <b class="small" style="display:block;margin:6px 0">شبكة الاتصال (المتعامل):</b>
            <div class="row" style="gap:6px;margin-bottom:14px;flex-wrap:wrap">
              ${isps.map(function (isp) {
                var bg = /mobilis/i.test(isp.key) ? 'background:#00A859;color:#fff' : (/djezzy/i.test(isp.key) ? 'background:#E30613;color:#fff' : (/ooredoo/i.test(isp.key) ? 'background:#ED1C24;color:#fff' : 'background:var(--surface-2);color:var(--ink)'));
                return '<span class="chip" style="' + bg + ';font-size:12px;font-weight:600">' + esc(isp.label) + ': ' + isp.count + ' (' + isp.pct + '%)</span>';
              }).join('')}
            </div>

            <b class="small" style="display:block;margin:6px 0">أجهزة وموديلات الزوار:</b>
            <div class="list">
              ${devices.slice(0, 5).map(function (d) {
                return `
                  <div class="li" style="cursor:default;padding:6px 0">
                    <span class="small">${esc(d.label)}</span>
                    <span class="grow"></span>
                    <b class="num small">${d.count}</b>
                    <span class="tiny faint">(${d.pct}%)</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Sources, UTM & Plan Breakdown -->
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

          <!-- Plans Conversion Breakdown -->
          <div class="card">
            <div class="row between" style="margin-bottom:12px">
              <h3 style="margin:0;font-size:15px">🎯 الباقات الأكثر طلباً</h3>
              <span class="chip pri">${totalConversions} تحويل</span>
            </div>
            <div class="list">
              ${planConvs.length ? planConvs.map(function (pl) {
                return `
                  <div class="li" style="cursor:default;flex-direction:column;align-items:stretch;gap:6px">
                    <div class="row between">
                      <b class="small">${esc(pl.label)}</b>
                      <span class="chip pri">${pl.count} طلب (${pl.pct}%)</span>
                    </div>
                    <div style="background:var(--surface-2);height:6px;border-radius:99px;overflow:hidden">
                      <div style="background:var(--green);height:100%;width:${pl.pct}%;border-radius:99px"></div>
                    </div>
                  </div>
                `;
              }).join('') : '<div class="empty">لا توجد طلبات مسجلة بعد</div>'}
            </div>
          </div>

        </div>

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

        <!-- Real-time Conversions Stream -->
        <div class="card">
          <div class="row between" style="margin-bottom:12px">
            <h3 style="margin:0;font-size:15px">⚡ آخر التحويلات ونقرات الواتساب الحية</h3>
            <span class="chip pri">مباشر</span>
          </div>
          <div class="list">
            ${convs.slice(0, 10).map(function (c) {
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
                      📍 ${esc(c.wilaya || c.city || 'الجزائر')} · <span class="chip" style="font-size:10px;padding:2px 6px">${esc(c.referrer_domain || 'مباشر')}</span> · 📱 ${esc(c.browser || '')}
                      ${c.decision_latency_sec ? ' · قرر في: ' + c.decision_latency_sec + ' ث' : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
            ${!convs.length ? '<div class="empty">لا توجد تحويلات مسجلة بعد لهذه الفترة</div>' : ''}
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
