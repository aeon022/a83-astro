<?php

/**
 * A83 – Quote Konami Glitch
 * Aktiviert per Konami-Code (↑ ↑ ↓ ↓ ← → ← → B A) einen Glitch-/Neon-Boost
 * für .a83-quote Elemente (Shortcode [a83_quote]).
 */

/* ---- Zusatz-Styles (Neon/Glitch Boost + kleines Toast) ---- */
add_action('wp_head', function () { ?>
  <style id="a83-quote-konami-css">
    /* Grundfarben-Override im Boost */
    .a83-konami .a83-quote{
      --a83-neon:#ff2ef3;          /* magenta neon */
      --a83-fg:#e9e7ff;
      --a83-sub:#c4b8ff;
      box-shadow:0 0 18px rgba(255,46,243,.45), 0 0 42px rgba(0,229,255,.25);
    }
    .a83-konami .a83-quote--card{ border-color: rgba(255,46,243,.5); }

    /* Text: zusätzlicher Glow + Hue-Rotation */
    .a83-konami .a83-quote__text{
      text-shadow:0 0 12px rgba(255,46,243,.55), 0 0 28px rgba(0,229,255,.35);
      animation:a83-hue 2.2s linear infinite;
    }
    @keyframes a83-hue{
      0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)}
    }

    /* Scanline-Overlay auf Card-Variante */
    .a83-konami .a83-quote--card::after{
      content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
      background:repeating-linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.08) 1px, transparent 1px, transparent 3px);
      mix-blend-mode:overlay; animation:a83-scan2 3s linear infinite;
    }
    @keyframes a83-scan2{ 0%{transform:translateY(-15%)} 100%{transform:translateY(15%)} }

    /* Mini-Toast */
    .a83-konami-toast{
      position:fixed; left:50%; bottom:20px; transform:translateX(-50%) translateY(10px);
      background:#0b0f14; color:#e2f7ff; border:1px solid rgba(0,229,255,.5);
      border-radius:12px; padding:.5rem .75rem; opacity:0; transition:all .25s ease;
      z-index:99999; box-shadow:0 0 12px rgba(0,229,255,.35); font:600 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    .a83-konami-toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }
  </style>
<?php }, 20);

add_action('admin_head', function(){ do_action('wp_head'); }, 1); // Styles auch im Builder/iFrame

/* ---- Script: Konami listener + Toggle ---- */
$konami_js = <<<JS
(function(){
  if (window.a83KonamiInit) return; window.a83KonamiInit = true;

  var seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  var i = 0;

  function toast(msg){
    try{
      var t = document.createElement('div');
      t.className = 'a83-konami-toast';
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(function(){ t.classList.add('show'); }, 10);
      setTimeout(function(){ t.classList.remove('show'); t.remove(); }, 2600);
    }catch(e){}
  }

  function toggle(){
    var root = document.documentElement;
    var active = root.classList.toggle('a83-konami');
    // sorge dafür, dass Glitch-Klasse aktiv ist
    document.querySelectorAll('.a83-quote').forEach(function(el){
      el.classList.add('a83-quote--glitch');
    });
    toast(active ? 'GLITCH MODE: ON' : 'GLITCH MODE: OFF');

    // nach 12s automatisch zurückschalten (dezent, kein Lock-in)
    if (active) setTimeout(function(){ root.classList.remove('a83-konami'); }, 12000);
  }

  document.addEventListener('keydown', function(e){
    var k = e.key;
    if (k && k.length === 1) k = k.toLowerCase(); // b/a lowercase
    if (k === seq[i]) {
      i++;
      if (i === seq.length) { i = 0; toggle(); }
    } else {
      i = (k === "ArrowUp") ? 1 : 0; // softer Reset
    }
  }, true);
})();
JS;

add_action('wp_footer', function() use ($konami_js){
  echo '<script id="a83-quote-konami-js">'. $konami_js .'</script>';
}, 99);

add_action('admin_footer', function() use ($konami_js){
  echo '<script id="a83-quote-konami-js">'. $konami_js .'</script>';
}, 99);