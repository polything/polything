# QA Checklist: WordPress to Next.js Migration

**Date:** 2025-01-27  
**Status:** In Progress  
**Testing Environment:** Local (http://localhost:3000) vs Live (https://polything.co.uk)

## Overview

This checklist covers the side-by-side visual and functional QA of the migrated site against the live WordPress site. Based on the PRD, we need to validate:

- **Phase 1:** Key static pages in navigation (Homepage, Services, About, Contact, Book a Call)
- **Phase 2:** Projects (Custom Post Type: project) - Case studies and portfolio items  
- **Phase 3:** Secondary pages (Legal pages, Terms, Privacy, etc.)
- **Phase 4:** Posts (Blog articles and insights)

## Content Migration Status

From the task list, we have successfully exported:
- ✅ **Projects**: 5 case studies
- ✅ **Posts**: 45 blog posts  
- ✅ **Pages**: 27 static pages
- ✅ **Total**: 77 content items (31% of 249 total pages)

## QA Testing Checklist

### 1. Homepage & Core Navigation Pages

#### 1.1 Homepage (/)
- [ ] **Visual Comparison**: Hero section, layout, typography
- [ ] **Content Verification**: Title, subtitle, hero image/video
- [ ] **Interactive Elements**: Navigation menu, CTA buttons
- [ ] **Performance**: Page load time, Core Web Vitals
- [ ] **SEO Elements**: Meta title, description, structured data

#### 1.2 Services Pages
- [ ] **Services Overview** (/services)
- [ ] **Individual Service Pages** (if any)

#### 1.3 About Page (/about)
- [ ] **Content Migration**: All text, images, team information
- [ ] **Layout Consistency**: Spacing, typography, visual hierarchy
- [ ] **Interactive Elements**: Contact links, social media links

#### 1.4 Contact Page (/contact)
- [ ] **Contact Form**: Functionality, validation, submission
- [ ] **Contact Information**: Address, phone, email display
- [ ] **Map Integration**: If applicable

#### 1.5 Book a Call (/book-a-call)
- [ ] **Booking System**: Calendar integration, form functionality
- [ ] **User Experience**: Flow, validation, confirmation

### 2. Project/Case Study Pages (/work/[slug])

#### 2.1 Project Listings
- [ ] **Project Grid**: Layout, filtering, pagination
- [ ] **Project Cards**: Images, titles, descriptions, links

#### 2.2 Individual Project Pages
Based on exported projects, test these case studies:
- [ ] **Blackriver** (/work/blackriver)
- [ ] **Bluefort Security** (/work/bluefort-security)  
- [ ] **Other 3 projects** (to be identified from export)

**For each project page:**
- [ ] **Hero Section**: Title, subtitle, background image/video
- [ ] **Project Content**: Description, features, outcomes
- [ ] **Media Assets**: Images, videos, galleries
- [ ] **Project Links**: External links, demo links
- [ ] **Navigation**: Back to work, related projects

### 3. Blog/Posts (/blog/[slug])

#### 3.1 Blog Index
- [ ] **Post Listings**: Grid/list layout, pagination
- [ ] **Post Previews**: Excerpts, featured images, dates
- [ ] **Categories/Tags**: Filtering functionality

#### 3.2 Individual Blog Posts
Test a sample of the 45 exported posts:
- [ ] **Post Content**: Full text, formatting, images
- [ ] **Post Metadata**: Author, date, categories, tags
- [ ] **Post Navigation**: Previous/next, related posts
- [ ] **Social Sharing**: Share buttons functionality

### 4. Static Pages

#### 4.1 Legal & Policy Pages
- [ ] **Privacy Policy** (/privacy-policy)
- [ ] **Terms of Service** (/terms-of-service)
- [ ] **Cookie Policy** (/cookie-policy)

#### 4.2 Other Static Pages
Test the remaining 27 static pages:
- [ ] **Page Content**: Text, images, layout
- [ ] **Page Navigation**: Breadcrumbs, internal links
- [ ] **Page SEO**: Meta tags, structured data

### 5. Technical Validation

#### 5.1 SEO & Metadata
- [ ] **Meta Titles**: Unique, descriptive, proper length
- [ ] **Meta Descriptions**: Compelling, 155-160 characters
- [ ] **Canonical URLs**: Proper canonicalization
- [ ] **Structured Data**: JSON-LD implementation
- [ ] **Open Graph**: Social media sharing tags

#### 5.2 Performance
- [ ] **Page Load Times**: < 3 seconds target
- [ ] **Core Web Vitals**: LCP, FID, CLS scores
- [ ] **Image Optimization**: WebP/AVIF, lazy loading
- [ ] **Code Splitting**: Efficient bundle loading

#### 5.3 Accessibility
- [ ] **WCAG 2.1 Compliance**: Level AA standards
- [ ] **Keyboard Navigation**: Tab order, focus indicators
- [ ] **Screen Reader**: Alt text, semantic HTML
- [ ] **Color Contrast**: Minimum 4.5:1 ratio

#### 5.4 Cross-Browser Testing
- [ ] **Chrome**: Latest version
- [ ] **Firefox**: Latest version  
- [ ] **Safari**: Latest version
- [ ] **Edge**: Latest version

#### 5.5 Mobile Responsiveness
- [ ] **Mobile Layout**: iPhone, Android
- [ ] **Tablet Layout**: iPad, Android tablets
- [ ] **Touch Interactions**: Buttons, forms, navigation
- [ ] **Viewport Scaling**: Proper zoom behavior

### 6. Content Integrity

#### 6.1 Text Content
- [ ] **Copy Accuracy**: All text matches original
- [ ] **Formatting**: Headings, lists, emphasis
- [ ] **Links**: Internal and external link functionality
- [ ] **Special Characters**: Encoding, display

#### 6.2 Media Assets
- [ ] **Image Quality**: Resolution, compression, format
- [ ] **Image Alt Text**: Accessibility compliance
- [ ] **Video Content**: Playback, controls, optimization
- [ ] **File Organization**: Proper /images/ structure

#### 6.3 Interactive Elements
- [ ] **Forms**: Validation, submission, error handling
- [ ] **Buttons**: Hover states, click functionality
- [ ] **Navigation**: Menu behavior, active states
- [ ] **Modals/Popups**: If applicable

## Testing Methodology

### Phase 1: Automated Testing
1. **Screenshot Comparison**: Capture both versions side-by-side
2. **Performance Testing**: Lighthouse audits
3. **Accessibility Testing**: Automated a11y scans
4. **SEO Validation**: Meta tag verification

### Phase 2: Manual Testing
1. **Visual Inspection**: Layout, typography, spacing
2. **Functional Testing**: All interactive elements
3. **Content Review**: Text accuracy, image quality
4. **User Journey Testing**: Complete user flows

### Phase 3: Cross-Device Testing
1. **Desktop**: Multiple screen sizes
2. **Mobile**: iOS and Android devices
3. **Tablet**: iPad and Android tablets

## Issue Tracking

### Critical Issues (Must Fix)
- [ ] Broken functionality
- [ ] Content missing or incorrect
- [ ] Performance degradation
- [ ] Accessibility violations

### High Priority Issues (Should Fix)
- [ ] Visual inconsistencies
- [ ] SEO problems
- [ ] Mobile usability issues
- [ ] Cross-browser compatibility

### Medium Priority Issues (Could Fix)
- [ ] Minor visual tweaks
- [ ] Performance optimizations
- [ ] Enhanced functionality

### Low Priority Issues (Nice to Have)
- [ ] Cosmetic improvements
- [ ] Additional features
- [ ] Future enhancements

## Success Criteria

### Performance Targets
- ✅ Page load time: < 3 seconds
- ✅ Core Web Vitals: All green scores
- ✅ Lighthouse Score: > 90 for all categories

### Content Migration Targets
- ✅ 100% of exported content accessible
- ✅ 0% data loss during migration
- ✅ 100% of media files processed

### SEO Targets
- ✅ All meta tags present and correct
- ✅ Structured data implemented
- ✅ Canonical URLs properly set
- ✅ Sitemap generation working

## Next Steps

1. **Start with Homepage**: Most critical page for user experience
2. **Test Core Navigation**: Services, About, Contact, Book a Call
3. **Validate Project Pages**: Case studies and portfolio items
4. **Check Blog Functionality**: Post listings and individual posts
5. **Verify Static Pages**: Legal pages and other content
6. **Document All Issues**: Create actionable bug reports
7. **Prioritize Fixes**: Based on user impact and business value

---

**Note**: This checklist will be updated as testing progresses and issues are discovered.