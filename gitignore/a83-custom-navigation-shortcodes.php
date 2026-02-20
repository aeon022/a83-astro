<?php
/* ============================================================
   A83 NAVIGATION (LINEAR & LOGISCH)
   ============================================================ */

// HILFSFUNKTION: Holt URL ohne Loop
function a83_get_nav_url($direction) {
    global $post;
    if (!$post) return '#';

    // BUTTON "WEITER" (Nach rechts)
    // Wir wollen das NÄCHSTE Projekt im Grid (= Älteres Datum)
    if ($direction === 'next') {
        // true = previous chronological post (älter)
        $older_post = get_adjacent_post(false, '', true); 
        
        if ($older_post) {
            return get_permalink($older_post->ID);
        }
    }

    // BUTTON "ZURÜCK" (Nach links)
    // Wir wollen das VORIGE Projekt im Grid (= Neueres Datum)
    if ($direction === 'prev') {
        // false = next chronological post (neuer)
        $newer_post = get_adjacent_post(false, '', false);
        
        if ($newer_post) {
            return get_permalink($newer_post->ID);
        }
    }
    
    // Wenn nichts da ist (Ende der Liste), gib '#' zurück
    return '#';
}

// SHORTCODE FÜR BUTTON "WEITER" [NEXT_FILE >>]
add_shortcode('a83_nav_next', function() {
    return a83_get_nav_url('next');
});

// SHORTCODE FÜR BUTTON "ZURÜCK" [<< PREV_FILE]
add_shortcode('a83_nav_prev', function() {
    return a83_get_nav_url('prev');
});