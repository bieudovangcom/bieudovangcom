
(function(){
  'use strict';

  function $(sel, root){ return (root || document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function show(el){ if(el) el.classList.remove('hidden'); }
  function hide(el){ if(el) el.classList.add('hidden'); }

  // Initialize lucide icons when available
  function initIcons(){
    try { if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons(); } catch(e){}
  }

  document.addEventListener('DOMContentLoaded', function(){
    initIcons();

    // Mobile drawer
    var menuButton = $('#menu-button');
    var mobileMenu = $('#mobileMenu');
    var closeButton = $('#mobileMenuClose');
    var backdrop = $('#backdrop');

    function openMenu(){
      if(mobileMenu) mobileMenu.classList.add('is-open');
      if(backdrop) backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu(){
      if(mobileMenu) mobileMenu.classList.remove('is-open');
      if(backdrop) backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if(menuButton) menuButton.addEventListener('click', openMenu);
    if(closeButton) closeButton.addEventListener('click', closeMenu);
    if(backdrop) backdrop.addEventListener('click', closeMenu);

    // Mobile submenu toggles
    $all('[data-submenu-toggle]').forEach(function(btn){
      btn.addEventListener('click', function(ev){
        // Let direct anchor inside button navigate only when clicking the anchor text
        if(ev.target && ev.target.tagName && ev.target.tagName.toLowerCase() === 'a') return;
        ev.preventDefault();
        var id = btn.getAttribute('data-submenu-toggle');
        var submenu = document.getElementById(id);
        if(!submenu) return;
        btn.classList.toggle('is-open');
        submenu.classList.toggle('hidden');
        submenu.classList.toggle('mobile-submenu-open');
      });
    });

    // Search toggle
    var searchBtn = document.querySelector('button[aria-label="Tìm kiếm"]');
    var searchInput = $('#search-input');
    var closeSearch = $('#close-search');
    if(searchBtn && searchInput){
      searchBtn.addEventListener('click', function(){
        searchInput.classList.toggle('is-open');
        if(closeSearch) closeSearch.classList.toggle('is-open');
        if(searchInput.classList.contains('is-open')) searchInput.focus();
      });
    }
    if(closeSearch){
      closeSearch.addEventListener('click', function(){
        searchInput && searchInput.classList.remove('is-open');
        closeSearch.classList.remove('is-open');
      });
    }
    if(searchInput){
      searchInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
          var q = searchInput.value.trim();
          if(q) window.location.href = 'https://bieudovang.com/tim-kiem/' + encodeURIComponent(q) + '/';
        }
      });
    }

    // Home chart tab dropdown
    var tabBtn = $('#homeChartTabMenuBtn');
    var tabPanel = $('#homeChartTabMenuPanel');
    var tabLabel = $('#homeChartTabLabel');
    var tabChevron = $('#homeChartTabChevron');
    function closeChartMenu(){
      if(tabPanel) tabPanel.classList.add('hidden');
      if(tabBtn) tabBtn.setAttribute('aria-expanded','false');
      if(tabChevron) tabChevron.classList.remove('is-open');
    }
    if(tabBtn && tabPanel){
      tabBtn.addEventListener('click', function(e){
        e.stopPropagation();
        tabPanel.classList.toggle('hidden');
        var expanded = !tabPanel.classList.contains('hidden');
        tabBtn.setAttribute('aria-expanded', expanded ? 'true':'false');
        if(tabChevron) tabChevron.classList.toggle('is-open', expanded);
      });
      document.addEventListener('click', closeChartMenu);
      tabPanel.addEventListener('click', function(e){ e.stopPropagation(); });
    }
    $all('.home-chart-tab-item').forEach(function(item){
      item.addEventListener('click', function(){
        var target = item.getAttribute('data-tab');
        $all('#tab-panels [data-panel]').forEach(function(p){
          p.classList.toggle('hidden', p.getAttribute('data-panel') !== target);
        });
        $all('.home-chart-tab-item').forEach(function(i){
          var active = i === item;
          i.setAttribute('aria-selected', active ? 'true' : 'false');
          var check = i.querySelector('.home-chart-tab-check');
          if(check) check.classList.toggle('hidden', !active);
        });
        if(tabLabel) tabLabel.textContent = item.getAttribute('data-short-label') || item.textContent.trim();
        // range toolbar switch
        var goldRange = $('#home-toolbar-gold-range');
        var silverRange = $('#home-toolbar-silver-range');
        if(goldRange) goldRange.classList.toggle('hidden', target === 'silver-chart');
        if(silverRange) silverRange.classList.toggle('hidden', target !== 'silver-chart');
        closeChartMenu();
        initFallbackCharts();
      });
    });

    // Range buttons styling and mobile range dropdowns
    function wireRange(prefix){
      var trigger = $('.' + prefix + '-time-range-mobile-trigger');
      var panel = $('.' + prefix + '-time-range-mobile-panel');
      var label = $('.' + prefix + '-time-range-mobile-label');
      var chev = $('.' + prefix + '-time-range-mobile-chevron');
      if(trigger && panel){
        trigger.addEventListener('click', function(e){
          e.stopPropagation();
          panel.classList.toggle('hidden');
          var open = !panel.classList.contains('hidden');
          trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
          if(chev) chev.classList.toggle('is-open', open);
        });
        document.addEventListener('click', function(){ panel.classList.add('hidden'); if(chev) chev.classList.remove('is-open'); });
      }
      $all('.' + prefix + '-time-range-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
          var t = btn.getAttribute('data-time');
          if(label) label.textContent = (t || '').toUpperCase();
          $all('.' + prefix + '-time-range-btn').forEach(function(b){
            var active = b.getAttribute('data-time') === t;
            b.setAttribute('aria-pressed', active ? 'true':'false');
            b.classList.toggle('bg-white', active);
            b.classList.toggle('shadow-sm', active);
            b.classList.toggle('text-slate-900', active);
            b.classList.toggle('text-slate-600', !active);
          });
          if(panel) panel.classList.add('hidden');
          if(chev) chev.classList.remove('is-open');
        });
      });
    }
    wireRange('gold');
    wireRange('silver');

    // Market tabs: Vàng/Bạc/Ngoại tệ cards
    $all('.market-tab').forEach(function(btn){
      btn.addEventListener('click', function(){
        var target = btn.getAttribute('data-tab');
        $all('.market-tab').forEach(function(b){
          var active = b === btn;
          b.dataset.active = active ? 'true' : '';
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        $all('.market-panel').forEach(function(panel){
          panel.classList.toggle('hidden', panel.id !== 'panel-' + target);
        });
        var view = $('#view-all-btn');
        if(view && btn.getAttribute('data-href')) view.href = btn.getAttribute('data-href');
      });
    });

    // Province/brand table filter
    var provinceFilter = $('#provinceFilter');
    var brandFilter = $('#brandFilter');
    function applyGoldProvinceFilter(){
      var p = provinceFilter ? provinceFilter.value : 'all';
      var b = brandFilter ? brandFilter.value : 'all';
      var rows = $all('#goldProvincesTableBody tr');
      rows.forEach(function(row){
        var okP = p === 'all' || row.getAttribute('data-province-slug') === p;
        var okB = b === 'all' || row.getAttribute('data-brand') === b;
        row.classList.toggle('github-filter-hidden', !(okP && okB));
      });
      // Avoid rowspan confusion in filtered table by hiding province rowspan cells if filter is not all
      if(p !== 'all' || b !== 'all'){
        rows.forEach(function(row){
          var first = row.querySelector('td[rowspan]');
          if(first) first.setAttribute('rowspan','1');
        });
      }
    }
    if(provinceFilter) provinceFilter.addEventListener('change', applyGoldProvinceFilter);
    if(brandFilter) brandFilter.addEventListener('change', applyGoldProvinceFilter);

    // Make marquee continuous if it is too short
    var marquee = $('#marqueeForex');
    if(marquee && marquee.children.length < 20) marquee.innerHTML += marquee.innerHTML;

    // Fallback charts if external scripts do not render
    setTimeout(initFallbackCharts, 1200);
  });

  function parseSeries(labelsCsv, buyCsv, sellCsv){
    var labels = String(labelsCsv || '').split(',');
    var buy = String(buyCsv || '').split(',').map(function(x){ return Number(x) || null; });
    var sell = String(sellCsv || '').split(',').map(function(x){ return Number(x) || null; });
    var points = [];
    for(var i=0;i<labels.length;i++){
      if(buy[i] || sell[i]) points.push({label:labels[i], buy:buy[i], sell:sell[i]});
    }
    return points.slice(-80);
  }

  function initFallbackCharts(){
    if(!window.Chart) return;
    // if lightweight charts already filled these divs, skip
    renderFallback('goldChartCanvas', window.labelGold, window.buyGold, window.sellGold, ['Mua vào','Bán ra']);
    renderFallback('silverChartCanvas', window.labelSilver, window.buySilver, window.sellSilver, ['Mua vào','Bán ra']);
  }

  function renderFallback(id, labelsCsv, buyCsv, sellCsv, legends){
    var wrap = document.getElementById(id);
    if(!wrap || wrap.dataset.githubFallbackRendered === '1') return;
    if(wrap.querySelector('canvas') || wrap.children.length > 0) return;
    var points = parseSeries(labelsCsv, buyCsv, sellCsv);
    if(points.length < 2){
      wrap.innerHTML = '<div class="github-chart-note">Không đủ dữ liệu để hiển thị biểu đồ trong bản tĩnh.</div>';
      wrap.dataset.githubFallbackRendered = '1';
      return;
    }
    var canvas = document.createElement('canvas');
    canvas.className = 'github-chart-fallback';
    wrap.appendChild(canvas);
    wrap.dataset.githubFallbackRendered = '1';
    try{
      new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: points.map(function(p){return p.label ? p.label.split(' ')[0] : '';}),
          datasets: [
            {label: legends[0], data: points.map(function(p){return p.buy;}), tension:.25, pointRadius:0, borderWidth:2},
            {label: legends[1], data: points.map(function(p){return p.sell;}), tension:.25, pointRadius:0, borderWidth:2}
          ]
        },
        options: {
          responsive:true,
          maintainAspectRatio:false,
          interaction:{mode:'index',intersect:false},
          plugins:{legend:{display:true}},
          scales:{
            x:{ticks:{maxTicksLimit:8}},
            y:{ticks:{callback:function(v){return new Intl.NumberFormat('vi-VN').format(v);}}}
          }
        }
      });
    }catch(e){
      wrap.innerHTML = '<div class="github-chart-note">Biểu đồ đang tải dữ liệu.</div>';
    }
  }
})();
