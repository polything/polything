<?php
/**
 * Plugin Name: Expose Themerain Meta to REST
 * Description: Exposes selected themerain_* custom fields in the WordPress REST API (read-only).
 * Version: 1.0.1
 * Author: Polything Ltd
 */

// Ensure the plugin is loaded
add_action('init', function () {
    // Limit to the post types that actually use these fields
    $post_types = ['post', 'page', 'project'];

    // Map meta keys to proper data types
    $meta_map = [
        // strings (titles, subtitles, URLs, colours)
        'themerain_hero_title'         => 'string',
        'themerain_hero_subtitle'      => 'string',
        'themerain_project_link_url'   => 'string',
        'themerain_page_title'         => 'string',
        'themerain_page_subtitle'      => 'string',
        'themerain_hero_text_color'    => 'string',
        'themerain_hero_bg_color'      => 'string',
        'themerain_page_text_color'    => 'string',
        'themerain_page_bg_color'      => 'string',

        // integers (WP attachment IDs)
        'themerain_hero_image'         => 'integer',
        'themerain_hero_video'         => 'integer',
        'themerain_project_link_image' => 'integer',
        'themerain_project_link_video' => 'integer',
    ];

    foreach ($post_types as $pt) {
        foreach ($meta_map as $key => $type) {
            register_post_meta($pt, $key, [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => $type,
                'auth_callback' => '__return_true',
                'description'   => "Themerain field: {$key}",
            ]);
        }
    }
}, 20); // Higher priority to ensure it runs after post types are registered

// Debug function to check if meta is registered (remove after testing)
add_action('rest_api_init', function () {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Themerain meta fields registered for REST API');
    }
});
