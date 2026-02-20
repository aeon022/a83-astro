<?php
/**
 * Shortcode: [a83_quote cat="any|tech|cyberpunk|devhumor" variant="card|inline" align="left|center|right" neon="1|0" glitch="0|1" author="1|0" seed="post|<string>" class="..."]
 * Beispiele: [a83_quote] / [a83_quote cat="cyberpunk" variant="card" neon="1" glitch="1" align="center"]
 */

add_action('wp_head', function () {
  if (did_action('a83_quote_css')) return;
  do_action('a83_quote_css');
  ?>
  <style id="a83-quote-css">
    .a83-quote{--a83-neon:#00e5ff;--a83-bg:#0b0f14;--a83-fg:#d8e4ff;--a83-sub:#8aa1c3;--a83-br:16px;--a83-pad:1rem;--a83-gap:.5rem;--a83-shadow:0 0 12px rgba(0,229,255,.35);}
    .a83-quote{display:block;color:var(--a83-fg);font-size:clamp(0.95rem,1.1vw,1.05rem);line-height:1.6}
    .a83-quote--inline{padding:0;border:none;background:transparent;box-shadow:none}
    .a83-quote--card{position:relative;background:linear-gradient(180deg,rgba(11,15,20,.9),rgba(11,15,20,.75));border:1px solid rgba(0,229,255,.3);border-radius:var(--a83-br);padding:var(--a83-pad);box-shadow:var(--a83-shadow)}
    .a83-quote__row{display:flex;align-items:flex-start;gap:var(--a83-gap)}
    .a83-quote__icon{flex:none;display:inline-grid;place-items:center;translate:0 .05em}
    .a83-quote__icon svg{width:1.1em;height:1.1em;opacity:.9}
    .a83-quote__text{margin:0;font-weight:600}
    .a83-quote__author{margin:.25rem 0 0;color:var(--a83-sub);font-size:.9em}
    .a83-quote[data-align="center"]{text-align:center}
    .a83-quote[data-align="right"]{text-align:right}
    /* Glitch (dezent) */
    .a83-quote--glitch .a83-quote__text{
      position:relative; text-shadow:0 0 6px rgba(0,229,255,.35), 0 0 18px rgba(0,229,255,.15);
    }
    .a83-quote--glitch .a83-quote__text::after{
      content:attr(data-text);
      position:absolute; left:0; top:0; right:0; clip-path:inset(0 0 65% 0);
      transform:translateX(.5px); opacity:.55; mix-blend-mode:screen; color:#f0f;
      animation:a83-scan 2.2s infinite linear;
    }
    @keyframes a83-scan{
      0%{clip-path:inset(0 0 90% 0)} 50%{clip-path:inset(80% 0 0 0)} 100%{clip-path:inset(0 0 90% 0)}
    }
  </style>
  <?php
});
add_action('admin_head', function(){ do_action('a83_quote_css'); });

function a83_quote_list(){
  $quotes = [
    // --- TECH ---
    ['t'=>"Ship early. Learn faster.", 'a'=>"A83", 'c'=>'tech'],
    ['t'=>"Cache it, or regret it.", 'a'=>"A83", 'c'=>'tech'],
    ['t'=>"Make it work, then make it fast.", 'a'=>"A83", 'c'=>'tech'],
    ['t'=>"Feature flags save weekends.", 'a'=>"A83", 'c'=>'tech'],
    ['t'=>"Automation beats motivation.", 'a'=>"A83", 'c'=>'tech'],
    // --- CYBERPUNK ---
    ['t'=>"Jack in. Push packets. Leave no logs.", 'a'=>"A83", 'c'=>'cyberpunk'],
    ['t'=>"Neon is just light with an attitude.", 'a'=>"A83", 'c'=>'cyberpunk'],
    ['t'=>"Low latency, high stakes.", 'a'=>"A83", 'c'=>'cyberpunk'],
    ['t'=>"Trust no UI without a dark mode.", 'a'=>"A83", 'c'=>'cyberpunk'],
    ['t'=>"Cities breathe; networks pulse.", 'a'=>"A83", 'c'=>'cyberpunk'],
    // --- DEV HUMOR ---
    ['t'=>"It’s not a bug—it's an unplanned API.", 'a'=>"A83", 'c'=>'devhumor'],
    ['t'=>"Works on my machine is not a test.", 'a'=>"A83", 'c'=>'devhumor'],
    ['t'=>"Semicolons: small marks, big feelings.", 'a'=>"A83", 'c'=>'devhumor'],
    ['t'=>"Naming things > fixing bugs (sadly).", 'a'=>"A83", 'c'=>'devhumor'],
    ['t'=>"If it compiles, ship it. (Kidding. Kinda.)", 'a'=>"A83", 'c'=>'devhumor'],
  ];
  /**
   * Filter zum Ergänzen eigener Zitate:
   * add_filter('a83_random_quotes', function($list){ $list[]=['t'=>'…','a'=>'Du','c'=>'tech']; return $list; });
   */
  return apply_filters('a83_random_quotes', $quotes);
}

function a83_pick_random($list, $seed=null){
  if (!$list) return null;
  if ($seed){
    $idx = crc32((string)$seed) % count($list);
  } else {
    $idx = random_int(0, count($list)-1);
  }
  return $list[$idx];
}

function a83_icon_svg($cat){
  $svg = [
    'tech'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h3v6H4zm13 0h3v6h-3zM9 4h6v3H9zM9 17h6v3H9zM7 11h10v2H7z"/></svg>',
    'cyberpunk'  => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 3-3 3-3-3 3-3zm7 7l3 3-3 3-3-3 3-3zM5 9l3 3-3 3-3-3 3-3zm7 7l3 3-3 3-3-3 3-3z"/></svg>',
    'devhumor'   => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8l-5 4 5 4v-3h6v3l5-4-5-4v3H7V8z"/></svg>',
    'any'        => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M12 4v16" /></svg>',
  ];
  return $svg[$cat] ?? $svg['any'];
}

function a83_quote_shortcode($atts){
  $a = shortcode_atts([
    'cat'     => 'any',          // any|tech|cyberpunk|devhumor oder CSV
    'variant' => 'card',         // card|inline
    'align'   => 'left',         // left|center|right
    'neon'    => '1',            // 1|0
    'glitch'  => '0',            // 1|0
    'author'  => '1',            // 1|0
    'seed'    => '',             // leer = echtes Random; 'post' = pro Post deterministisch
    'class'   => '',             // zusätzliche Klassen
  ], $atts, 'a83_quote');

  $list = a83_quote_list();
  $cats = array_filter(array_map('trim', explode(',', strtolower($a['cat']))));
  if ($cats && !in_array('any', $cats, true)) {
    $list = array_values(array_filter($list, fn($q)=> in_array($q['c'], $cats, true)));
  }

  if (!$list) return '';

  $seed = null;
  if ($a['seed'] === 'post' && function_exists('get_the_ID')) $seed = get_the_ID();
  elseif (!empty($a['seed'])) $seed = $a['seed'];

  $q = a83_pick_random($list, $seed);
  if (!$q) return '';

  $cat    = esc_attr($q['c']);
  $text   = esc_html($q['t']);
  $author = isset($q['a']) && $q['a'] !== '' ? esc_html($q['a']) : '';

  $variant = in_array($a['variant'], ['card','inline'], true) ? $a['variant'] : 'card';
  $align   = in_array($a['align'], ['left','center','right'], true) ? $a['align'] : 'left';
  $classes = trim('a83-quote a83-quote--'.$variant.' '.($a['glitch']==='1'?'a83-quote--glitch':'').' '.sanitize_html_class($a['class']));
  $icon    = a83_icon_svg($cat);

  ob_start(); ?>
    <figure class="<?php echo esc_attr($classes); ?>" data-cat="<?php echo $cat; ?>" data-align="<?php echo esc_attr($align); ?>">
      <div class="a83-quote__row">
        <?php if ($a['neon']==='1'): ?>
          <span class="a83-quote__icon" aria-hidden="true"><?php echo $icon; ?></span>
        <?php endif; ?>
        <blockquote class="a83-quote__text" data-text="<?php echo $text; ?>"><?php echo $text; ?></blockquote>
      </div>
      <?php if ($a['author']==='1' && $author): ?>
        <figcaption class="a83-quote__author">— <?php echo $author; ?> · <span><?php echo strtoupper($cat); ?></span></figcaption>
      <?php endif; ?>
    </figure>
  <?php
  return ob_get_clean();
}
add_shortcode('a83_quote', 'a83_quote_shortcode');