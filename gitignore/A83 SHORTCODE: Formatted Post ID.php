<?php

/* A83 SHORTCODE: Formatted Post ID */
add_shortcode('a83_id_formatted', function() {
    // Gibt "[ID: 123]" zurück
    return '[ID: ' . get_the_ID() . ']';
});


/* A83 SHORTCODE: Universal Custom Field Reader */
add_shortcode('a83_meta', function($atts) {
    // Standard-Werte
    $a = shortcode_atts(array(
        'key' => '',      // Der Feld-Name (z.B. 'status')
        'default' => ''   // Fallback, falls leer
    ), $atts);

    // Wenn kein Key angegeben ist, Abbruch
    if (empty($a['key'])) return '';

    // Wert aus der Datenbank holen
    $value = get_post_meta(get_the_ID(), $a['key'], true);

    // Wenn leer, Standard zurückgeben
    if (!$value) return $a['default'];

    // Rückgabe (Escaped für Sicherheit)
    return esc_html($value);
});