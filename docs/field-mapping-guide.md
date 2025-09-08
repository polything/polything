# Themerain Field Mapping Guide

## Overview

This guide documents the complete mapping from WordPress themerain_* fields to clean front-matter schema for the Next.js migration.

## Field Discovery Results

### Polything.co.uk
- **46 themerain_* fields** discovered
- **Key fields**: hero_title, hero_subtitle, hero_video (10681), hero_text_color (#ffffff)

### Mightybooth.com  
- **22 themerain_* fields** discovered
- **Key fields**: hero_image (1844), hero_bg_color (#000000)

## Complete Field Mapping

| Clean Schema | Themerain Source | Content Type | Description |
|-------------|------------------|--------------|-------------|
| `hero.title` | `themerain_hero_title`, `themerain_page_title` | All | Hero section title |
| `hero.subtitle` | `themerain_hero_subtitle`, `themerain_page_subtitle` | All | Hero section subtitle |
| `hero.image` | `themerain_hero_image` | All | Hero background image (media ID) |
| `hero.video` | `themerain_hero_video` | All | Hero background video (media ID) |
| `hero.text_color` | `themerain_hero_text_color`, `themerain_page_text_color` | All | Hero text color |
| `hero.background_color` | `themerain_hero_bg_color`, `themerain_page_bg_color` | All | Hero background color |
| `links.url` | `themerain_project_link_url` | Project | Project external URL |
| `links.image` | `themerain_project_link_image` | Project | Project link image (media ID) |
| `links.video` | `themerain_project_link_video` | Project | Project link video (media ID) |

## Example Transformation

```javascript
// Input: WordPress themerain meta
const themerainMeta = {
  themerain_hero_title: "Blackriver's 297% Sales Surge",
  themerain_hero_subtitle: "Read more about their Christmas strategy success",
  themerain_hero_video: "10681",
  themerain_hero_text_color: "#ffffff"
};

// Output: Clean schema
const cleanSchema = {
  hero: {
    title: "Blackriver's 297% Sales Surge",
    subtitle: "Read more about their Christmas strategy success",
    video: "10681", 
    text_color: "#ffffff",
    background_color: ""
  }
};
```

## Fallback Logic

1. **Primary**: Use `themerain_hero_*` fields
2. **Fallback**: Use `themerain_page_*` fields if hero fields are empty
3. **Default**: Empty string if no fields are found
