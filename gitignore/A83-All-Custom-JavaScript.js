/* Off-Canvas A83 - v13.5 + SCROLL TONE DETECTION
   - FIXED: Scroll detection runs independently from menu
   - Scroll-based data-tone detection for header color changes
   - Wordmark & Burger init glitch animations
   - Custom Burger with Open/Reset-Animation
   - ESC/Close: clean reset (aria-expanded=false, .is-open weg) + recoil
   - Wild Glitch: Card pulses + Slice-Glitches; Link-Bursts
   - Terminal-Hint: fa-terminal + $ command /Title (data-title), HINT ALWAYS SINGLE-LINE
*/

/* === A83 Global Guard: avoid running in wp-admin / builder and prevent duplicates === */
(function A83_GUARD_WRAPPER(){
  var d=document, de=d.documentElement, b=d.body;
  var A83_IS_ADMIN   = location.pathname.indexOf('/wp-admin/')!==-1 || de.classList.contains('wp-admin');
  var A83_IS_BUILDER = !!(de.classList.contains('breakdance-builder-active')
                       || (b && b.classList && b.classList.contains('breakdance-is-frontend-builder'))
                       || window.BreakdanceEditorActive
                       || (window.BreakdanceFrontend && window.BreakdanceFrontend.isEditorActive));
  if(A83_IS_ADMIN || A83_IS_BUILDER){
    console.info('[A83] guard: skip off-canvas/scroll-tone in admin/builder');
    return;
  }
  if(window.__A83_OCV135_INIT__){
    console.info('[A83] already initialized, skipping duplicate');
    return;
  }
  window.__A83_OCV135_INIT__ = true;

// ===== SCROLL TONE DETECTION (INDEPENDENT!) =====
// This runs SEPARATELY and doesn't depend on menu elements
(function(){
  console.log('[SCROLL-TONE] Script loaded');

  // Pause tone updates while the off-canvas overlay is active (blur + body lock)
  const html = document.documentElement;
  let tonePaused = false;

  // Helper to check nav state from the main script (data-nav-state on <html>)
  const getNavState = () => html.getAttribute('data-nav-state') || 'closed';
  
  function updateHeaderTone(){
    const header = document.getElementById('site-header');
    
    if(!header) {
      console.warn('[SCROLL-TONE] ✗ Header #site-header not found');
      return;
    }
    
    // Get all sections with data-tone attribute
    const sections = document.querySelectorAll('[data-tone]');
    if(!sections.length) {
      console.warn('[SCROLL-TONE] ✗ No sections with [data-tone] attribute found');
      header.setAttribute('data-tone', 'light');
      return;
    }
    
    // Get current scroll position
    const scrollTop = window.scrollY || window.pageYOffset;
    const headerHeight = header.offsetHeight || 60;
    const checkPoint = scrollTop + headerHeight + 10;
    
    let currentTone = null;
    let closestSection = null;
    let closestDistance = Infinity;
    
    // Find which section the checkpoint is in
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollTop + rect.top;
      const sectionBottom = sectionTop + rect.height;
      
      // If checkpoint is within this section
      if(checkPoint >= sectionTop && checkPoint <= sectionBottom){
        const tone = section.getAttribute('data-tone');
        if(tone) {
          currentTone = tone;
          closestSection = section;
        }
      }
      
      // Also track closest section in case we're between sections
      const distanceToTop = Math.abs(checkPoint - sectionTop);
      if(distanceToTop < closestDistance){
        closestDistance = distanceToTop;
        if(!currentTone){
          currentTone = section.getAttribute('data-tone');
          closestSection = section;
        }
      }
    });
    
    // Fallback to first section if nothing found
    if(!currentTone){
      currentTone = sections[0].getAttribute('data-tone') || 'light';
    }
    
    // Update header data-tone if changed
    const previousTone = header.getAttribute('data-tone');
    if(previousTone !== currentTone){
      header.setAttribute('data-tone', currentTone);
      document.documentElement.setAttribute('data-tone', currentTone);
      console.log(`[SCROLL-TONE] ✓ Changed: ${previousTone} → ${currentTone} at scroll ${Math.round(scrollTop)}px`);
    }
  }

  // Throttled scroll handler
  let scrollTicking = false;
  function onScroll(){
    if(tonePaused) return; // ignore scroll while nav overlay is open/locking
    if(!scrollTicking){
      window.requestAnimationFrame(()=>{
        if(!tonePaused) updateHeaderTone();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  // Initialize scroll detection with multiple fallbacks
  function initScrollTone(){
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('[data-tone]');
    
    console.log('[SCROLL-TONE] Initializing...', {
      header: header ? '✓ found' : '✗ missing',
      sections: sections.length + ' found',
      tones: [...sections].map(s => s.getAttribute('data-tone')).join(', ')
    });
    
    if(!header){
      console.error('[SCROLL-TONE] ✗ CRITICAL: Header #site-header not found!');
      return false;
    }
    
    if(!sections.length){
      console.error('[SCROLL-TONE] ✗ CRITICAL: No [data-tone] sections found!');
      return false;
    }
    
    // Observe nav overlay state to pause/resume tone detection
    const navObs = new MutationObserver(()=>{
      const s = getNavState();
      if(s === 'opening' || s === 'open'){
        // Freeze tone while the blur overlay covers the page and scrolling is locked
        tonePaused = true;
      }else{
        // Resume and recompute immediately after close
        tonePaused = false;
        updateHeaderTone();
      }
    });
    navObs.observe(html, { attributes:true, attributeFilter:['data-nav-state'] });

    // Refresh tone on custom resume event from nav script
    document.addEventListener('a83:tone-resume', ()=> { if(!tonePaused) updateHeaderTone(); });

    // Set up event listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', ()=> { if(!tonePaused) updateHeaderTone(); }, { passive:true });
    
    // Initial update
    updateHeaderTone();
    console.log('[SCROLL-TONE] ✓ Active! Initial tone:', header.getAttribute('data-tone'));

    // Expose updater for other scripts (read-only)
    window.A83_updateHeaderTone = updateHeaderTone;
    
    return true;
  }

  // Multiple initialization attempts
  let initialized = false;
  
  // Attempt 1: If DOM already ready
  if(document.readyState === 'interactive' || document.readyState === 'complete'){
    console.log('[SCROLL-TONE] DOM already ready');
    initialized = initScrollTone();
  }
  
  // Attempt 2: DOMContentLoaded
  if(!initialized){
    document.addEventListener('DOMContentLoaded', ()=>{
      console.log('[SCROLL-TONE] DOMContentLoaded event');
      initialized = initScrollTone();
    });
  }
  
  // Attempt 3: Delayed fallback (for Breakdance)
  setTimeout(()=>{
    if(!initialized){
      console.log('[SCROLL-TONE] Delayed fallback init');
      initialized = initScrollTone();
    }
  }, 500);
  
  // Attempt 4: Window load
  window.addEventListener('load', ()=>{
    if(!initialized){
      console.log('[SCROLL-TONE] Window load init');
      initialized = initScrollTone();
    }
  });
})();

// ===== OFF-CANVAS NAVIGATION =====
(function(){
  const html = document.documentElement;

  // ===== Refs
  const overlay   = document.getElementById('nav-overlay');
  const card      = overlay?.querySelector('.nav-card');
  const navHead   = overlay?.querySelector('.nav-head');
  const menu      = overlay?.querySelector('.nav-menu');
  const closeSlot = overlay?.querySelector('#nav-close-slot, .nav-close-slot');
  const homeSlot  = document.querySelector('.burger-home-slot, .burger-slot');
  const burger    = homeSlot?.querySelector('#nav-trigger, .a83-burger, .nav-toggle');
  const wordmark  = document.querySelector('.brand-wordmark');
  const header    = document.getElementById('site-header');
  let   hintEl    = overlay?.querySelector('.nav-hint');

  if(!overlay || !card || !navHead || !menu || !closeSlot || !homeSlot || !burger){
    console.warn('[NAV-MENU] Setup incomplete - menu will not work', {overlay, card, navHead, menu, closeSlot, homeSlot, burger});
    console.log('[NAV-MENU] But scroll-tone detection should still work!');
    
    // Still try to init animations for wordmark/burger if they exist
    if(wordmark || burger){
      setTimeout(()=> initAnimations(), 500);
    }
    
    return; // Exit but don't block scroll detection
  }

  console.log('[NAV-MENU] ✓ All menu elements found');

  // === HEADER MINIMAL ANTI-JUMP (capture; no propagation blocking) ===
  (function initHeaderMinimalAntiJump(){
    const headerEl = document.getElementById('site-header');
    if(!headerEl) return;

    // keep last pointer Y for later locking
    let _lastHeaderPointerY = 0;
    const recordY = ()=>{ _lastHeaderPointerY = window.scrollY || window.pageYOffset || 0; };

    // store globally if available
    try { window.__A83_LAST_POINTER_Y__ = 0; } catch(_){}

    headerEl.addEventListener('pointerdown', (e)=>{
      recordY();
      try { window.__A83_LAST_POINTER_Y__ = _lastHeaderPointerY; } catch(_){}
      // double RAF: restore immediately after any theme handler runs
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          const ny = window.scrollY || window.pageYOffset || 0;
          if (Math.abs(ny - _lastHeaderPointerY) > 2){
            window.scrollTo(0, _lastHeaderPointerY);
            console.debug('[NAV] Restored header-induced jump (RAF) to:', _lastHeaderPointerY);
          }
        });
      });
      // late safety restore
      setTimeout(()=>{
        const ny2 = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(ny2 - _lastHeaderPointerY) > 2){
          window.scrollTo(0, _lastHeaderPointerY);
          console.debug('[NAV] Restored header-induced jump (late) to:', _lastHeaderPointerY);
        }
      }, 60);
    }, true);

    // Only swallow placeholder hashes; do not block real links
    const isPlaceholderHref = (href)=>{
      if(!href) return true;
      const h = href.trim();
      if(h === '#' || h === '' || h.toLowerCase()==='javascript:void(0)') return true;
      if(h.startsWith('#')) return true;
      return false;
    };

    // (NEUER Code für Zeile 224 bis 231)
    headerEl.addEventListener('click', (e)=>{
      const a = e.target && e.target.closest ? e.target.closest('a') : null;

      // Fall 1: Ein echter Link wurde geklickt
      // Wir prüfen, ob ein <a> gefunden wurde, es im Header liegt
      // und KEIN Platzhalter-Link ist.
      if(a && headerEl.contains(a) && !isPlaceholderHref(a.getAttribute('href'))){
        // Das ist ein echter Link (z.B. /kontakt). Nichts tun, weiterlaufen lassen.
        return;
      }

      // Fall 2: Alle anderen Klicks
      // (Klick auf leeren Header-Bereich, Klick auf Platzhalter-Link)
      // Hier verhindern wir die Standard-Aktion (das Springen).
      e.preventDefault(); 
      // Wir stoppen nicht die Propagation, falls andere Skripte noch was tun müssen.
    }, true);

    // sanitize placeholders that appear later
    const mo = new MutationObserver(()=>{
      headerEl.querySelectorAll('a[href="#"], a[href=""], a[href^="#"]').forEach(a=>{
        a.removeAttribute('href');
        a.setAttribute('role','button');
        a.setAttribute('tabindex','0');
      });
    });
    mo.observe(headerEl, { subtree:true, attributes:true, childList:true, attributeFilter:['href'] });
  })();

  // Normalize any anchor around/being the burger to prevent page jumps
  let burgerAnchor = null;
  if (burger){
    burgerAnchor = burger.closest('a');

    const swallow = function(e){ e.preventDefault(); e.stopImmediatePropagation(); };

    if (burgerAnchor){
      // stash old href (if any) purely for debugging/reference
      const oldHref = burgerAnchor.getAttribute('href') || '';
      burgerAnchor.setAttribute('data-a83-old-href', oldHref);
      burgerAnchor.removeAttribute('href');
      burgerAnchor.setAttribute('role','button');
      burgerAnchor.setAttribute('tabindex','0');
      // capture-phase to beat theme/BD handlers
      burgerAnchor.addEventListener('pointerdown', swallow, true);
      burgerAnchor.addEventListener('click',      swallow, true);
    } else if (burger.tagName === 'A'){
      const oldHref = burger.getAttribute('href') || '';
      burger.setAttribute('data-a83-old-href', oldHref);
      burger.removeAttribute('href');
      burger.setAttribute('role','button');
      burger.setAttribute('tabindex','0');
      burger.addEventListener('pointerdown', swallow, true);
      burger.addEventListener('click',      swallow, true);
    }

    // Safety net: if markup changes and the clickable is wrapped, swallow on the slot too
    if (homeSlot){
      homeSlot.addEventListener('pointerdown', function(e){
        const a = e.target.closest('a');
        if (!a) return;
        if (a === burgerAnchor || a === burger || a.matches('#nav-trigger, .a83-burger, .nav-toggle')){
          e.preventDefault(); e.stopImmediatePropagation();
        }
      }, true);
      homeSlot.addEventListener('click', function(e){
        const a = e.target.closest('a');
        if (!a) return;
        if (a === burgerAnchor || a === burger || a.matches('#nav-trigger, .a83-burger, .nav-toggle')){
          e.preventDefault(); e.stopImmediatePropagation();
        }
      }, true);
    }
  }

  // Close-Button ensure
  let closeBtn = closeSlot.querySelector('.nav-close-btn');
  if(!closeBtn){
    closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close-btn';
    closeBtn.setAttribute('aria-label','Menu schließen');
    closeBtn.innerHTML = '✕';
    closeSlot.appendChild(closeBtn);
  }

  // Hint-Element ensure
  if(!hintEl){
    hintEl = document.createElement('div');
    hintEl.className = 'nav-hint';
    overlay.appendChild(hintEl);
  }

  // ===== Timings (read from CSS, with fallbacks)
  const cssMs = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if(!v) return fallback;
    if(v.endsWith('ms')) return parseInt(v,10);
    if(v.endsWith('s'))  return Math.round(parseFloat(v)*1000);
    const n = parseInt(v,10); return isNaN(n) ? fallback : n;
  };
  const T_BURGER       = cssMs('--t-burger',       350);
  const T_CARD_IN      = cssMs('--t-card',         680);
  const T_CARD_OUT     = cssMs('--t-card-out',     420);
  const T_BACKDROP_OUT = cssMs('--t-backdrop-out', 320);
  const T_CLOSE_GAP    = cssMs('--t-close-gap',     60);
  const G_CARD         = cssMs('--glitch-card-dur',640);
  const G_LINK         = cssMs('--glitch-link-dur',520);

  // Burger animation times
  const BURGER_OPEN_DUR  = Math.min(360, T_BURGER);
  const BURGER_RESET_DUR = 240;

  // Close-Glitch short wait before "closing" state
  const CLOSE_GLITCH_DELAY = 140;

  // ===== State
  let state='closed', lastFocused=null, scrollY=0, ignoreNext=false;

  // Scroll restoration helpers
  function setScrollRestoration(on){
    try{ if('scrollRestoration' in history){ history.scrollRestoration = on ? 'manual' : 'auto'; } }catch(_){ }
  }
  function restoreScroll(y){
    const target = Math.max(0, y|0);
    requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ try{ window.scrollTo(0, target); console.debug('[NAV] Restored Y (double-RAF):', target); }catch(_){ } }); });
  }

  // guard against theme/BD smooth scroll while menu is active
  function keepYDuringMenu(){
    if(state==='opening' || state==='open' || state==='closing'){
      const y = scrollY || window.__A83_LAST_POINTER_Y__ || window.pageYOffset || 0;
      const cy = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(cy - y) > 2){
        noSmooth(()=> window.scrollTo(0, y));
        // console.debug('[NAV] Guard restored scroll to', y);
      }
    }
  }
  window.addEventListener('scroll', keepYDuringMenu, { passive:true });

  // remember last pointer Y anywhere (fallback for lockBody)
  let lastPointerY = 0;

  // keep a global last pointer position to avoid 0 restores
  document.addEventListener('pointerdown', function(){
    lastPointerY = window.scrollY || window.pageYOffset || 0;
    try{ window.__A83_LAST_POINTER_Y__ = lastPointerY; }catch(_){ }
  }, true);

  function focusNoScroll(el){
    if(!el) return;
    const y = window.scrollY || window.pageYOffset || 0;
    try {
      el.focus({ preventScroll: true });
    } catch(_) {
      el.focus && el.focus();
      // restore if browser scrolled during focus
      setTimeout(()=>{ try{ window.scrollTo(0, y); }catch(_){} }, 0);
    }
  }

  // ===== Helpers
  const isIOS      = ()=>/iP(ad|hone|od)/.test(navigator.userAgent);
  const prefersRM  = ()=> window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setState   = s => { state=s; html.setAttribute('data-nav-state', s); };

  // Burger state
  const setExpanded   = b => burger.setAttribute('aria-expanded', b ? 'true' : 'false');
  const setBurgerOpen = (on) => {
    setExpanded(!!on);
    burger.classList.toggle('is-open', !!on);
    burger.setAttribute('aria-pressed', on ? 'true' : 'false');
  };

  // Burger animations (via CSS classes)
  function playBurgerOpen(){
    burger.classList.add('is-anim');
    void burger.offsetWidth; // reflow
    burger.classList.add('is-open');
    setTimeout(()=> burger.classList.remove('is-anim'), BURGER_OPEN_DUR);
  }
  
  function playBurgerReset(){
    burger.classList.add('is-recoiling');
    burger.classList.remove('is-open');
    setTimeout(()=> burger.classList.remove('is-recoiling'), BURGER_RESET_DUR);
  }

  function setScrollbarComp(on){
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    html.style.setProperty('--sbw', on ? (sbw+'px') : '0px');
  }
  
  // (NEUER Code für Zeile 508 bis 552)
  function lockBody(){
    const currentY = window.scrollY || window.pageYOffset || 0;
    const y = (window.__A83_LAST_POINTER_Y__ || lastPointerY || currentY);
    scrollY = y; // Wir speichern es sicherheitshalber, falls es später gebraucht wird

    setScrollRestoration(true);
    setScrollbarComp(true);
    html.classList.add('nav-lock');

    // ALLES HIER WURDE ENTFERNT:
    // Die 'position: fixed' Logik, die den Sprung verursacht, ist jetzt weg.
    // 'html.nav-lock' (mit overflow: hidden) aus Ihrer CSS-Datei
    // übernimmt die Sperrung, ohne die Scroll-Position zu verlieren.
  }

  function unlockBody(){
    // ALLES HIER WURDE ENTFERNT:
    // Da wir die Scroll-Position nie verloren haben (dank overflow: hidden),
    // müssen wir sie auch nicht wiederherstellen (kein 'restoreScroll').
    // Wir entfernen nur die Sperr-Klasse und die Scrollbar-Kompensation.

    html.classList.remove('nav-lock');

    setScrollbarComp(false);
    setScrollRestoration(false);
    // Kein restoreScroll(y) nötig!
  }

  // Geometry
  const slotRect   = ()=> homeSlot.getBoundingClientRect();
  const burgerRect = ()=> (burger.getBoundingClientRect?.() || slotRect());

  function setCardFromTrigger(){
    const s = slotRect();
    const c = card.getBoundingClientRect();
    card.style.setProperty('--from-x',     (s.right - c.right) + 'px');
    card.style.setProperty('--from-y',     (s.top   - c.top)   + 'px');
    card.style.setProperty('--from-scale', '.94');
  }

  function syncCloseSizeToBurger(){
    const r = burgerRect();
    const w = Math.round(r.width)  + 'px';
    const h = Math.round(r.height) + 'px';
    overlay.style.setProperty('--burger-w', w);
    overlay.style.setProperty('--burger-h', h);
    closeSlot.style.setProperty('min-width', w);
  }

  // ===== Terminal-Hint (single-line enforced)
  const CMD_PREFIX = '$ ';
  const CMD_VARIANTS = [
    t => `open /${t}`,
    t => `lynx /${t}`,
    t => `ssh guest@host:/${t}`,
    t => `cat /${t}/README`,
    t => `curl /${t}`,
    t => `cd /${t} && ls`,
  ];
  const slug = s => (s||'').trim()
     .replace(/[äÄ]/g,'ae').replace(/[öÖ]/g,'oe').replace(/[üÜ]/g,'ue').replace(/ß/g,'ss')
     .replace(/\s+/g,'') || 'page';
  const fmtCmd = t => CMD_PREFIX + CMD_VARIANTS[Math.floor(Math.random()*CMD_VARIANTS.length)](slug(t));

  function enforceSingleLineHint(){
    const hs = hintEl.style;
    hs.setProperty('display','inline-grid','important');
    hs.setProperty('grid-auto-flow','column','important');
    hs.setProperty('grid-template-columns','auto minmax(0,1fr)','important');
    hs.setProperty('white-space','nowrap','important');
    hs.setProperty('overflow','hidden','important');
    hs.setProperty('text-overflow','ellipsis','important');
    hs.setProperty('width','max-content','important');
    hs.setProperty('max-width','calc(100vw - 32px)','important');

    const cmd = hintEl.querySelector('.cmd');
    if(cmd){
      const cs = cmd.style;
      cs.setProperty('min-width','0','important');
      cs.setProperty('overflow','hidden','important');
      cs.setProperty('text-overflow','ellipsis','important');
      cs.setProperty('white-space','nowrap','important');
    }
  }
  
  function setTermHintFrom(el){
    const title = el?.getAttribute('data-title') || el?.dataset?.title || (el?.textContent||'').trim() || '';
    hintEl.innerHTML = `<i class="fa-solid fa-terminal" aria-hidden="true"></i>&nbsp;<span class="cmd">${fmtCmd(title)}</span>`;
    enforceSingleLineHint();
  }
  
  function initHints(){
    const items = [...menu.querySelectorAll('.nav-link, a')];
    if(!items.length) return;
    const show = el => { setTermHintFrom(el); overlay.classList.add('hint-visible'); };
    const hide = () => overlay.classList.remove('hint-visible');
    items.forEach(el=>{
      el.addEventListener('mouseenter', ()=> show(el));
      el.addEventListener('focusin',    ()=> show(el));
    });
    menu.addEventListener('mouseleave', hide);
    menu.addEventListener('focusout', e=>{ if(!menu.contains(e.relatedTarget)) hide(); });
  }

  // Focus-Trap & ESC
  const fsel='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusables = ()=> card.querySelectorAll(fsel);
  
  function onTabTrap(e){
    if(!(state==='opening'||state==='open') || e.key!=='Tab') return;
    const f = focusables(); if(!f.length) return;
    const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  }
  
  function onEsc(e){
    if(e.key==='Escape' && (state==='open'||state==='opening')){
      closeNav('esc');
    }
  }

  const pulse = (el, cls, ms) => { if(!el) return; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), ms); };

  // WILD: Slice-Glitch
  function createSliceGlitch(){
    if(prefersRM()) return null;
    const baseCount = (window.innerWidth < 768) ? 4 : 7;
    const count = baseCount + Math.floor(Math.random()*2);
    const dur = Math.max(420, Math.min(900, Math.round(G_CARD*1.05)));

    const box = document.createElement('div');
    box.className = 'gl-slices';
    box.style.setProperty('--gl-slice-dur', dur + 'ms');
    box.setAttribute('aria-hidden','true');

    const h = card.clientHeight || 400;
    const used = new Set();

    for(let i=0;i<count;i++){
      const slice = document.createElement('div');
      slice.className = 'gl-slice';

      const sh = Math.max(8, Math.round(Math.random() * (h*0.12)));
      let st = Math.round(Math.random() * (h - sh - 4));
      const key = Math.round(st/10)*10;
      if(used.has(key)) st = Math.max(0, Math.min(h-sh-4, st+12));
      used.add(key);

      slice.style.top    = st + 'px';
      slice.style.height = sh + 'px';

      const v = (Math.random() < 0.5) ? 'a83-slice-shift' : 'a83-slice-skew';
      const delay = Math.round(Math.random()*140);
      slice.style.animation = `${v} var(--gl-slice-dur) steps(14) ${delay}ms both`;

      box.appendChild(slice);
    }
    card.appendChild(box);
    setTimeout(()=> { box.remove(); }, dur + 120);
    return box;
  }

  // Stronger Link-Glitch with multiple bursts
  function glitchLinksWild(){
    const items = [...menu.querySelectorAll('.nav-link, a')];
    if(!items.length || prefersRM()) return;
    menu.classList.add('glitch-strong');

    items.forEach((el, i)=>{
      const base = i*90 + Math.round(Math.random()*120);
      setTimeout(()=> el.classList.add('g1'), base);
      setTimeout(()=> el.classList.remove('g1'), base + G_LINK*0.6);

      const b2 = base + 80 + Math.round(Math.random()*140);
      setTimeout(()=> el.classList.add('g2'), b2);
      setTimeout(()=> el.classList.remove('g2'), b2 + G_LINK*0.5);

      const b3 = b2 + 140;
      setTimeout(()=> el.classList.add('g3'), b3);
      setTimeout(()=> el.classList.remove('g3'), b3 + 220);
    });

    setTimeout(()=> menu.classList.remove('glitch-strong'), G_LINK + 720);
  }

  // ===== INIT ANIMATIONS =====
  function initAnimations(){
    if(prefersRM()) return;
    
    // Wordmark init glitch
    if(wordmark){
      // Ensure data-text attribute for glitch effect
      if(!wordmark.hasAttribute('data-text')){
        wordmark.setAttribute('data-text', wordmark.textContent.trim());
      }
      
      setTimeout(()=>{
        wordmark.classList.add('wordmark-init');
        setTimeout(()=>{
          wordmark.classList.remove('wordmark-init');
        }, 720);
      }, 180); // slight delay for page load
    }
    
    // Burger init glitch
    if(burger){
      setTimeout(()=>{
        burger.classList.add('burger-init');
        setTimeout(()=>{
          burger.classList.remove('burger-init');
        }, 780);
      }, 420); // after wordmark
    }
  }

  // Run init animations when DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // ===== OPEN NAV =====
  function openNav(){
    if(state!=='closed') return;
    lastFocused = document.activeElement;

    // Burger visual open + aria
    playBurgerOpen();
    setBurgerOpen(true);

    overlay.setAttribute('aria-hidden','false');
    // Snapshot tone just before we lock scroll (purely informative; actual pause is handled in first IIFE)
    try { if (window.A83_updateHeaderTone) window.A83_updateHeaderTone(); } catch(e){}
    lockBody();

    card.classList.add('card-primed');
    syncCloseSizeToBurger();
    setCardFromTrigger();

    setTimeout(()=>{
      card.offsetHeight; // Reflow
      card.classList.remove('card-primed');
      setState('opening');

      // Card Glitch Pulse
      if(!prefersRM()){
        pulse(card, 'glitch', G_CARD);
        setTimeout(()=> pulse(card, 'glitch-strong', Math.round(G_CARD*0.8)), Math.round(G_CARD*0.35));
        createSliceGlitch();
        setTimeout(()=> createSliceGlitch(), Math.round(G_CARD*0.45));
      }

      document.addEventListener('keydown', onTabTrap, true);
      document.addEventListener('keydown', onEsc,     true);

      setTimeout(()=>{
        setState('open');

        // Links: Standard + Wild Bursts
        if(!prefersRM()){
          pulse(menu, 'glitch-once', Math.max(360, G_LINK*0.8));
          glitchLinksWild();
        }

        // X later glitch in
        setTimeout(()=>{
          closeBtn.classList.remove('x-hidden');
          if(!prefersRM()) pulse(closeBtn, 'x-glitch', 420);
        },  Math.max(140, Math.round(G_LINK*0.45)));

        initHints();
        const f = focusables();
        if (f.length) {
          focusNoScroll(f[0]);
        } else {
          const h1 = navHead.querySelector('h1');
          if (h1) { h1.setAttribute('tabindex','-1'); focusNoScroll(h1); }
        }
      }, T_CARD_IN);
    }, T_BURGER);

    window.addEventListener('resize', syncCloseSizeToBurger);
  }

  // ===== CLOSE NAV =====
  function closeNav(){
    if(state!=='open' && state!=='opening') return;

    // Short visual pulse before out
    if(!prefersRM()){
      pulse(card, 'glitch-strong', 220);
      pulse(menu, 'glitch-once',   200);
    }

    // Burger: Recoil animation start
    playBurgerReset();
    
    // aria/State early back (slightly delayed so recoil stays visible)
    setTimeout(()=> setBurgerOpen(false), Math.min(120, BURGER_RESET_DUR * 0.35));

    // Switch to "closing"; Card-Out + Blur-Out run via CSS
    setTimeout(()=>{
      setState('closing');
      card.style.pointerEvents='none'; // prevent spam clicks

      const TOTAL = T_CARD_OUT + T_CLOSE_GAP + T_BACKDROP_OUT + 40;
      setTimeout(()=>{
        overlay.setAttribute('aria-hidden','true');
        unlockBody();
        try { window.requestAnimationFrame(()=> { document.dispatchEvent(new Event('a83:tone-resume')); }); } catch(e){}
        setState('closed');

        // Safety: Burger state clean
        setBurgerOpen(false);

        // Cleanup
        overlay.classList.remove('hint-visible');
        card.classList.remove('glitch','glitch-strong');
        menu.classList.remove('glitch-once','glitch-strong');
        menu.querySelectorAll('.g1,.g2,.g3').forEach(n=>n.classList.remove('g1','g2','g3'));
        closeBtn.classList.remove('x-glitch');
        card.querySelectorAll('.gl-slices').forEach(n=>n.remove());
        card.style.pointerEvents='';

        window.removeEventListener('resize', syncCloseSizeToBurger);

        // Restore focus without scrolling the page up to the header
        if (!document.body.hasAttribute('tabindex')) document.body.setAttribute('tabindex','-1');
        const focusTarget = (lastFocused && document.contains(lastFocused)) ? lastFocused : document.body;
        focusNoScroll(focusTarget);
        
        document.removeEventListener('keydown', onTabTrap, true);
        document.removeEventListener('keydown', onEsc,     true);
      }, TOTAL);
    }, CLOSE_GLITCH_DELAY);
  }

  // Clicks
  // Capture-phase first to beat theme/BD smooth-scroll handlers
  burger.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    if (ignoreNext){ ignoreNext=false; return; }
    if (state==='closed') openNav(); else if (state==='open') closeNav();
  }, true);

  // Bubbling fallback just in case some handler was attached later
  burger.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();
  }, false);
  
  closeBtn.addEventListener('click', ()=>{
    if(state==='open' || state==='opening'){ closeNav(); }
  });

  // ARIA / Dialog
  burger.setAttribute('aria-controls','nav-overlay');
  burger.setAttribute('aria-expanded','false');
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-hidden','true');

  console.log('[NAV-MENU] ✓ Menu initialized successfully');
})();
})();



/* === A83 Compat Guard: stop 3rd-party scroll/overflow hacks while nav is active === */
(function A83_CompatGuard(){
  const html = document.documentElement;
  const BAD_STYLES = ['overflow', 'scroll-behavior', 'position', 'top', 'left'];
  const isNavActive = () => /^(opening|open|closing)$/.test(html.getAttribute('data-nav-state')||'');

  function sanitize(){
    if(!isNavActive()) return;
    const hs = html.style, bs = document.body && document.body.style;
    // Während Menü aktiv ist → immer „auto“ scroll-behavior erzwingen
    if(getComputedStyle(html).scrollBehavior !== 'auto') hs.setProperty('scroll-behavior','auto','important');
    // Keine fixed-Experimente am <html>/<body>
    ['position','top','left','right','bottom'].forEach(p=>{
      if(hs[p]) hs.removeProperty(p);
      if(bs && bs[p]) bs.removeProperty(p);
    });
  }

  const obs = new MutationObserver(() => sanitize());
  obs.observe(document.documentElement, {attributes:true, attributeFilter:['style','class','data-nav-state']});
  if(document.body){
    obs.observe(document.body, {attributes:true, attributeFilter:['style','class']});
  }
  addEventListener('scroll', () => isNavActive() && requestAnimationFrame(sanitize), {passive:true});
})();





/* HACKER TEXT DECODER EFFECT */
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

document.querySelectorAll(".hacker-text").forEach(target => {
  target.onmouseover = event => {
    let iterations = 0;
    
    const interval = setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
          if(index < iterations) {
            return event.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      
      if(iterations >= event.target.dataset.value.length){ 
        clearInterval(interval);
      }
      
      iterations += 1 / 3;
    }, 30);
  }
});

// Initialisierung: Speichert den Originaltext
document.querySelectorAll(".hacker-text").forEach(el => {
    el.dataset.value = el.innerText;
});






/* TERMINAL FILTER LOGIC (Attribute Based) */
document.addEventListener("DOMContentLoaded", () => {
    
    const buttons = document.querySelectorAll('.tf-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Verhindert Springen
            
            // 1. Active State umschalten
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Wir suchen alle Karten im Grid
            // (Achtung: .project-card muss im Global Block gesetzt sein!)
            const cards = document.querySelectorAll('.project-card');

            cards.forEach(card => {
                // Kategorien der Karte auslesen (kleingeschrieben)
                const cardCats = (card.getAttribute('data-cats') || "").toLowerCase();
                
                // Reset Animation (kurz ausblenden)
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    // Logik: Zeigen wenn "all" ODER wenn der Filter im data-cats String vorkommt
                    // Wir nutzen includes(), da data-cats z.B. "tech corporate" sein kann
                    if (filter === 'all' || cardCats.includes(filter)) {
                        card.parentNode.style.display = 'block'; // Wrapper im Grid zeigen
                        card.style.display = 'flex';
                        
                        // Fade In (kurz verzögert für den Effekt)
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Ausblenden: Wir verstecken den parentNode (den Wrapper vom Post Loop),
                        // damit das Grid keine Lücken hat.
                        card.parentNode.style.display = 'none'; 
                    }
                }, 300); // Wartezeit bis es ausgeblendet ist
            });
        });
    });
});





// ===== GLOBAL • ABTEILUNG83 – CRT Boot für alle .terminal-window[data-crt="on"] =====



(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Alle CRT-Terminals sammeln (opt-in)
  const terms = [...document.querySelectorAll('.terminal-window[data-crt="on"]')];
  if (!terms.length) return;

  terms.forEach(initTerminal);

  function initTerminal(el){
    const text = el.querySelector('.terminal-text');
    if (!text) return;

    // Overlay sicherstellen
    if (!el.querySelector('.crt-overlay')) {
      const ov = document.createElement('div');
      ov.className = 'crt-overlay';
      ov.setAttribute('aria-hidden', 'true');
      el.insertAdjacentElement('afterbegin', ov);
    }

    // Zeilen sammeln (nur blockige Inhalte – <br> bewusst ignorieren)
    const lines = [...text.querySelectorAll('p, li, pre, blockquote, h1, h2, h3, h4, h5, h6')];
    lines.forEach(n => n.classList.add('line-hidden'));

    const bootDelay    = +(el.dataset.bootDelay || 350);
    const lineInterval = +(el.dataset.lineInterval || 120);

    function revealLines(items, interval){
      let i = 0;
      (function tick(){
        if (i >= items.length) return;
        items[i].classList.remove('line-hidden');
        i++;
        setTimeout(tick, interval);
      })();
    }

    function boot(){
      if (reduceMotion){
        el.classList.remove('js-waiting');
        lines.forEach(n => n.classList.remove('line-hidden'));
        return;
      }
      el.classList.remove('js-waiting');
      // kleiner Snap → dann Boot & Zeilen-Reveal
      setTimeout(() => {
        el.classList.add('js-booting');
        setTimeout(() => revealLines(lines, lineInterval), bootDelay);
      }, 20);
    }

    // Initial „waiting“-Zustand aktivieren (für dein globales CSS)
    el.classList.add('js-waiting');

    // Scroll-Trigger (einmalig)
    if ('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        boot();
      }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
      io.observe(el);
    } else {
      // Fallback
      document.addEventListener('DOMContentLoaded', boot);
    }

    // Konami → Replay
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    window.addEventListener('keydown', (e) => {
      idx = (e.key === seq[idx]) ? idx+1 : (e.key === seq[0] ? 1 : 0);
      if (idx === seq.length) { idx = 0; replay(); }
    });

    function replay(){
      el.classList.remove('js-booting');
      lines.forEach(n => n.classList.add('line-hidden'));
      const prev = el.style.filter;
      el.style.filter = 'brightness(1.6)';             // kurzer Flash
      setTimeout(() => { el.style.filter = prev || ''; }, 140);
      setTimeout(boot, 80);
    }
  }
})();






/* A83 VERBOSE MODE – per-Page Default + Scope (page/site) */


(() => {
  const BODY = document.body;
  const SELECTOR = '#a83-verbose-trigger, .verbose-toggle';

  // Per-Page Defaults aus Body-Attributen
  const DEF   = (BODY.dataset.verboseDefault || 'off').toLowerCase(); // 'on' | 'off'
  const SCOPE = (BODY.dataset.verboseScope   || 'site').toLowerCase(); // 'page' | 'site'

  // Storage-Key je nach Scope
  const KEY_BASE = 'a83-verbose';
  const KEY = SCOPE === 'page' ? `${KEY_BASE}:${location.pathname}` : KEY_BASE;

  const getSaved = () => {
    try { return localStorage.getItem(KEY); } catch(_) { return null; }
  };
  const setSaved = (on) => {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch(_) {}
  };

  const setState = (on, persist = true) => {
    BODY.classList.toggle('verbose-mode-on', on);
    document.querySelectorAll(SELECTOR).forEach(t => {
      const box = t.querySelector('.check');
      if (box) box.textContent = on ? '[x]' : '[ ]';
      t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (persist) setSaved(on);
  };

  const toggle = () => setState(!BODY.classList.contains('verbose-mode-on'));

  const init = () => {
    // 1) Initialzustand: gespeicherter Wert, sonst per-Page Default
    const saved = getSaved();                   // '1' | '0' | null
    const initialOn = saved === null ? (DEF === 'on') : saved === '1';
    setState(initialOn, false);

    // 2) Events (Click + Keyboard)
    document.addEventListener('click', (e) => {
      const trg = e.target.closest(SELECTOR);
      if (!trg) return;
      e.preventDefault();
      toggle();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const trg = e.target.closest(SELECTOR);
      if (!trg) return;
      e.preventDefault();
      toggle();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();


// ===== CURSOR-LETTERSPACING FIX FOR SUFFIX ELEMENTS (z.B. im Header) ===== 


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.cursor-suffix, .cursor-suffix_').forEach(el => {
    // trailing spaces sicher entfernen
    const t = el.lastChild;
    if (t && t.nodeType === Node.TEXT_NODE) t.nodeValue = t.nodeValue.replace(/\s+$/, '');

    const ls = parseFloat(getComputedStyle(el).letterSpacing);
    if (!isNaN(ls) && ls) el.style.setProperty('--cursor-fix', (-ls) + 'px');
  });
});



/* A83 PORTFOLIO GLITCH TIMER (FINAL FORCE STOP) */
document.addEventListener("DOMContentLoaded", () => {
    
    // Funktion zum Initialisieren
    const initGlitch = () => {
        // Wähle alle Projekt-Karten
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            // Entferne alte Listener (Clean Slate)
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Neuer Listener
            newCard.addEventListener('mouseenter', () => {
                // Wenn Animation läuft, ignorieren
                if(newCard.classList.contains('glitch-active')) return;

                // 1. START: Klasse setzen
                newCard.classList.add('glitch-active');

                // 2. STOP: Nach exakt 600ms Klasse HART entfernen
                setTimeout(() => {
                    newCard.classList.remove('glitch-active');
                }, 600);
            });
        });
    };

    // Starten & Beobachten (für Filter-Updates)
    initGlitch();
    const observer = new MutationObserver(initGlitch);
    const grid = document.querySelector('.project-grid');
    if(grid) observer.observe(grid, { childList: true, subtree: true });
});





/* A83 IMPRINT EASTER EGG (HARDENED) */
document.addEventListener('click', function(e) {
    // Prüfen, ob das geklickte Element (oder ein Elternteil) unsere ID hat
    const target = e.target.closest('#a83-fake-print');

    if (target) {
        e.preventDefault();
        e.stopPropagation(); // Verhindert, dass andere Skripte dazwischenfunken

        // Der Alert
        alert(">> SYSTEM MESSAGE:\n\nPaper is obsolete.\nProtocol strictly forbids analog data transfer.\n\nPlease memorize this screen instead.");
        
        // Log
        console.log(">> [PRINT_JOB]: Intercepted and canceled.");
    }
});