/**
 * Test Data Fixtures
 * 
 * This file contains test data and fixtures that can be used across different test files
 * to provide consistent test data and reduce duplication.
 */

export const testData = {
  // User data
  users: {
    valid: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      message: 'This is a test message for automated testing purposes.'
    },
    invalid: {
      name: '',
      email: 'invalid-email',
      phone: 'invalid-phone',
      company: '',
      message: ''
    }
  },

  // Page URLs
  urls: {
    homepage: '/',
    work: '/work',
    blog: '/blog',
    contact: '/contact',
    about: '/about',
    services: '/services',
    projects: {
      blackriver: '/work/blackriver-case-study',
      testProject: '/work/test-project',
      sampleProject: '/work/sample-project'
    },
    blogPosts: {
      testPost: '/blog/test-post',
      samplePost: '/blog/sample-post',
      examplePost: '/blog/example-post'
    }
  },

  // Expected content
  content: {
    homepage: {
      title: 'Polything',
      heroTitle: 'Marketing Strategy',
      heroSubtitle: 'Transform your business',
      sections: ['about', 'services', 'case-studies', 'testimonials']
    },
    project: {
      title: 'Project Title',
      description: 'Project description',
      technologies: ['React', 'Next.js', 'TypeScript'],
      results: ['Increased conversion', 'Better UX', 'Improved performance']
    },
    blog: {
      title: 'Blog Post Title',
      excerpt: 'Blog post excerpt',
      author: 'Author Name',
      date: '2024-01-01',
      content: 'Blog post content'
    }
  },

  // Performance thresholds
  performance: {
    loadTime: 3000, // 3 seconds
    fcp: 2000, // 2 seconds
    lcp: 4000, // 4 seconds
    cls: 0.1,
    fid: 100, // 100ms
    maxRequests: 50,
    maxTotalSize: 5 * 1024 * 1024 // 5MB
  },

  // SEO requirements
  seo: {
    title: {
      minLength: 10,
      maxLength: 60
    },
    description: {
      minLength: 120,
      maxLength: 160
    },
    requiredMetaTags: [
      'title',
      'description',
      'viewport',
      'canonical'
    ],
    requiredOgTags: [
      'og:title',
      'og:description',
      'og:image',
      'og:type',
      'og:url'
    ],
    requiredTwitterTags: [
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image'
    ]
  },

  // Accessibility requirements
  accessibility: {
    minTouchTargetSize: 44, // 44x44 pixels
    requiredAriaAttributes: [
      'aria-label',
      'aria-labelledby',
      'aria-describedby'
    ],
    requiredRoles: [
      'main',
      'navigation',
      'banner',
      'contentinfo'
    ]
  },

  // Browser configurations
  browsers: {
    desktop: {
      chrome: { width: 1920, height: 1080 },
      firefox: { width: 1920, height: 1080 },
      safari: { width: 1920, height: 1080 }
    },
    mobile: {
      iphone: { width: 375, height: 667 },
      android: { width: 360, height: 640 },
      tablet: { width: 768, height: 1024 }
    }
  },

  // Test timeouts
  timeouts: {
    short: 5000, // 5 seconds
    medium: 10000, // 10 seconds
    long: 30000, // 30 seconds
    veryLong: 60000 // 60 seconds
  },

  // Error messages
  errors: {
    pageNotFound: 'Page not found',
    networkError: 'Network error',
    timeoutError: 'Timeout error',
    validationError: 'Validation error'
  },

  // Success messages
  success: {
    formSubmitted: 'Form submitted successfully',
    pageLoaded: 'Page loaded successfully',
    testPassed: 'Test passed successfully'
  }
}

export const testFixtures = {
  // Common test scenarios
  scenarios: {
    happyPath: {
      name: 'Happy Path',
      description: 'User successfully completes the main user journey',
      steps: [
        'Navigate to homepage',
        'Click on project link',
        'View project details',
        'Navigate to blog',
        'Read blog post',
        'Return to homepage'
      ]
    },
    errorHandling: {
      name: 'Error Handling',
      description: 'Test error scenarios and recovery',
      steps: [
        'Navigate to non-existent page',
        'Verify 404 page',
        'Navigate back to valid page',
        'Verify page loads correctly'
      ]
    },
    performance: {
      name: 'Performance Testing',
      description: 'Test page performance and Core Web Vitals',
      steps: [
        'Measure page load time',
        'Check Core Web Vitals',
        'Verify performance thresholds',
        'Test on different devices'
      ]
    }
  },

  // Mock data for API responses
  mockApiResponses: {
    projects: [
      {
        id: 1,
        title: 'Blackriver Case Study',
        slug: 'blackriver-case-study',
        description: 'A comprehensive case study of the Blackriver project',
        image: '/images/blackriver.jpg',
        technologies: ['React', 'Next.js', 'TypeScript'],
        results: ['Increased conversion by 150%', 'Improved user experience']
      },
      {
        id: 2,
        title: 'Test Project',
        slug: 'test-project',
        description: 'A test project for demonstration purposes',
        image: '/images/test-project.jpg',
        technologies: ['Vue.js', 'Node.js'],
        results: ['Better performance', 'Enhanced security']
      }
    ],
    blogPosts: [
      {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        excerpt: 'This is a test blog post for automated testing',
        content: 'Full content of the test blog post...',
        author: 'Test Author',
        date: '2024-01-01',
        image: '/images/test-post.jpg'
      },
      {
        id: 2,
        title: 'Sample Post',
        slug: 'sample-post',
        excerpt: 'This is a sample blog post for testing purposes',
        content: 'Full content of the sample blog post...',
        author: 'Sample Author',
        date: '2024-01-02',
        image: '/images/sample-post.jpg'
      }
    ]
  },

  // Test environment configurations
  environments: {
    development: {
      baseUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:3000/api',
      timeout: 30000
    },
    staging: {
      baseUrl: 'https://staging.polything.co.uk',
      apiUrl: 'https://staging.polything.co.uk/api',
      timeout: 30000
    },
    production: {
      baseUrl: 'https://polything.co.uk',
      apiUrl: 'https://polything.co.uk/api',
      timeout: 30000
    }
  }
}

export const testSelectors = {
  // Common selectors
  common: {
    navigation: 'nav, [role="navigation"]',
    main: 'main, [role="main"]',
    header: 'header, [role="banner"]',
    footer: 'footer, [role="contentinfo"]',
    logo: '[data-testid="logo"], .logo, img[alt*="logo"]',
    button: 'button, [role="button"]',
    link: 'a[href]',
    input: 'input, textarea, select',
    image: 'img',
    heading: 'h1, h2, h3, h4, h5, h6'
  },

  // Homepage selectors
  homepage: {
    hero: '[data-testid="hero"], .hero, section:first-of-type',
    heroTitle: 'h1',
    heroSubtitle: 'h2, .hero-subtitle',
    heroCTA: '[data-testid="hero-cta"], .hero-cta, a[href*="contact"]',
    about: '[data-testid="about"], .about, section:nth-of-type(2)',
    services: '[data-testid="services"], .services, section:nth-of-type(3)',
    caseStudies: '[data-testid="case-studies"], .case-studies, section:nth-of-type(4)',
    testimonials: '[data-testid="testimonials"], .testimonials, section:nth-of-type(5)'
  },

  // Project page selectors
  project: {
    title: 'h1',
    subtitle: 'h2, .project-subtitle',
    description: '.project-description, p',
    image: '.project-image, img',
    gallery: '.project-gallery, .gallery',
    details: '.project-details, .details',
    technologies: '.project-technologies, .technologies',
    results: '.project-results, .results',
    cta: '.project-cta, a[href*="contact"]',
    breadcrumbs: '.breadcrumbs, nav[aria-label="breadcrumb"]',
    related: '.related-projects, .related'
  },

  // Blog page selectors
  blog: {
    title: 'h1',
    subtitle: 'h2, .blog-subtitle',
    meta: '.blog-meta, .post-meta',
    date: 'time, .date',
    author: '.author, .blog-author',
    image: '.blog-image, img',
    content: '.blog-content, .post-content, article',
    excerpt: '.blog-excerpt, .excerpt',
    breadcrumbs: '.breadcrumbs, nav[aria-label="breadcrumb"]',
    related: '.related-posts, .related',
    socialSharing: '.social-sharing, .share-buttons'
  },

  // Form selectors
  forms: {
    contact: 'form[action*="contact"], .contact-form',
    name: 'input[name="name"], input[placeholder*="name"]',
    email: 'input[name="email"], input[type="email"]',
    phone: 'input[name="phone"], input[type="tel"]',
    company: 'input[name="company"], input[placeholder*="company"]',
    message: 'textarea[name="message"], textarea[placeholder*="message"]',
    submit: 'button[type="submit"], input[type="submit"]'
  }
}

export default {
  testData,
  testFixtures,
  testSelectors
}
