<?php
/**
 * Stay Child functions and definitions
 *
 */

/**
** activation theme
**/
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
function theme_enqueue_styles() {
 wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );

}
add_filter( 'sanitize_file_name', 'remove_accents' );
?>