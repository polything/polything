# Development Workflow Guide

**Date:** 2025-01-27  
**Status:** Active  
**Project:** WordPress to Next.js Migration

## Overview

This guide outlines the development workflow for the WordPress to Next.js migration project, including TDD methodology, testing practices, and deployment procedures.

## Development Methodology

### Test-Driven Development (TDD)

We follow a strict TDD approach for all development:

1. **Red Phase**: Write failing tests first
2. **Green Phase**: Write minimum code to pass tests
3. **Refactor Phase**: Improve code while maintaining test coverage

### TDD Cycle Example

```typescript
// 1. Red Phase - Write failing test
describe('Hero Component', () => {
  it('should render hero with title', () => {
    const mockHero = { title: 'Test Title' }
    render(<Hero hero={mockHero} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})

// 2. Green Phase - Write minimum code
const Hero = ({ hero }) => {
  return <h1>{hero.title}</h1>
}

// 3. Refactor Phase - Improve while keeping tests green
const Hero = ({ hero }) => {
  return (
    <section className="hero">
      <h1 className="hero-title">{hero.title}</h1>
    </section>
  )
}
```

## Project Structure

### Directory Organization

```
polything-redesign/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── work/[slug]/       # Project pages
│   ├── blog/[slug]/       # Blog pages
│   └── [slug]/            # Static pages
├── components/            # React components
│   ├── hero.tsx          # Hero component
│   └── hero.test.tsx     # Hero tests
├── content/              # MDX content files
│   ├── posts/            # Blog posts
│   ├── pages/            # Static pages
│   └── projects/         # Project case studies
├── docs/                 # Documentation
├── lib/                  # Utility functions
├── scripts/              # Migration scripts
├── tests/                # Test files
└── public/               # Static assets
```

### File Naming Conventions

- **Components**: `kebab-case.tsx` (e.g., `hero-section.tsx`)
- **Tests**: `component-name.test.tsx` (e.g., `hero.test.tsx`)
- **Content**: `index.mdx` in slug directories
- **Scripts**: `kebab-case.mjs` (e.g., `wp-export.mjs`)

## Development Commands

### Setup and Installation

```bash
# Install dependencies
pnpm install

# Generate contentlayer types
pnpm contentlayer build

# Start development server
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test components/hero.test.tsx

# Run tests with coverage
pnpm test --coverage
```

### Building and Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## Git Workflow

### Branch Strategy

- **Main Branch**: `main` - Production-ready code
- **Feature Branches**: `task-X-description` - Individual tasks
- **Development Branch**: `develop` - Integration branch

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add hero component with image support
fix: resolve contentlayer type generation issue
docs: update troubleshooting guide
test: add hero component test coverage
refactor: improve contentlayer configuration
```

### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

### Pull Request Process

1. **Create Feature Branch**: `git checkout -b task-3-hero-component`
2. **Implement with TDD**: Write tests first, then implementation
3. **Run Tests**: Ensure all tests pass
4. **Update Documentation**: Update relevant docs
5. **Create PR**: With descriptive title and description
6. **Code Review**: Address feedback
7. **Merge**: After approval and CI passes

## Testing Strategy

### Unit Tests

**Location**: Alongside component files
**Framework**: Jest + React Testing Library
**Coverage**: Minimum 80% for critical components

```typescript
// Example unit test
describe('Hero Component', () => {
  it('should render with title and subtitle', () => {
    const mockHero = {
      title: 'Test Title',
      subtitle: 'Test Subtitle'
    }
    
    render(<Hero hero={mockHero} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })
})
```

### Integration Tests

**Purpose**: Test component interactions
**Scope**: Page templates with contentlayer integration

```typescript
// Example integration test
describe('Project Detail Page', () => {
  it('should render project with hero and content', async () => {
    const params = { slug: 'test-project' }
    const page = await ProjectDetailPage({ params })
    
    render(page)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

### End-to-End Tests

**Framework**: Playwright (planned)
**Scope**: Critical user journeys
**Examples**: Homepage → Project → Contact flow

## Code Quality Standards

### TypeScript

- **Strict Mode**: Enabled
- **Type Coverage**: 100% for new code
- **Interfaces**: Use interfaces over types for object shapes
- **Type Guards**: Use for runtime type checking

```typescript
// Good: Interface for component props
interface HeroProps {
  hero: HeroData | null
}

// Good: Type guard for runtime checking
function isHeroData(data: unknown): data is HeroData {
  return typeof data === 'object' && data !== null && 'title' in data
}
```

### React Best Practices

- **Functional Components**: Use function declarations
- **Hooks**: Use custom hooks for reusable logic
- **Props**: Destructure props in function parameters
- **Keys**: Use stable keys for list items

```typescript
// Good: Functional component with proper typing
function Hero({ hero }: HeroProps) {
  if (!hero) return null
  
  return (
    <section className="hero">
      <h1>{hero.title}</h1>
    </section>
  )
}
```

### CSS and Styling

- **Tailwind CSS**: Use utility classes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Include proper ARIA attributes
- **Performance**: Optimize for Core Web Vitals

```tsx
// Good: Responsive and accessible
<section 
  className="min-h-screen flex items-center justify-center"
  role="banner"
  aria-label="Hero section"
>
  <h1 className="text-4xl md:text-6xl font-bold">
    {hero.title}
  </h1>
</section>
```

## Content Management

### MDX Content Structure

```yaml
---
title: "Page Title"
slug: "page-slug"
date: "2024-01-01T00:00:00.000Z"
hero:
  title: "Hero Title"
  subtitle: "Hero Subtitle"
  image: "/images/hero.jpg"
seo:
  title: "SEO Title"
  description: "SEO description"
---

# Page Content

This is the page content in MDX format.
```

### Content Validation

- **Front-matter**: Validate required fields
- **MDX Syntax**: Check for valid syntax
- **Images**: Verify image paths exist
- **Links**: Check for broken links

## Performance Guidelines

### Core Web Vitals

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Strategies

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Automatic route-based splitting
3. **Static Generation**: Pre-render all content
4. **Caching**: Appropriate cache headers

### Performance Monitoring

```bash
# Lighthouse CI
npx lighthouse-ci autorun

# Bundle analysis
pnpm build
npx @next/bundle-analyzer
```

## Deployment Process

### Staging Deployment

1. **Build**: `pnpm build`
2. **Test**: Run all tests
3. **Deploy**: Push to staging branch
4. **Validate**: Check staging site
5. **Approve**: Stakeholder approval

### Production Deployment

1. **Merge**: Merge approved changes to main
2. **Build**: Production build
3. **Deploy**: Deploy to production
4. **Monitor**: Check error logs and performance
5. **Verify**: Confirm site functionality

## Troubleshooting

### Common Issues

1. **Contentlayer Types**: Run `pnpm contentlayer build`
2. **Test Failures**: Check Jest configuration
3. **Build Errors**: Verify TypeScript types
4. **Image Issues**: Check public directory structure

### Debug Commands

```bash
# Contentlayer debugging
pnpm contentlayer build --verbose

# Next.js debugging
DEBUG=* pnpm dev

# Test debugging
pnpm test --verbose
```

## Documentation Standards

### Code Documentation

- **JSDoc**: For complex functions
- **Comments**: For non-obvious logic
- **README**: For setup instructions
- **API Docs**: For utility functions

### Documentation Updates

- **Implementation Docs**: Update after major changes
- **Troubleshooting**: Add new issues and solutions
- **Workflow**: Update process changes
- **API Changes**: Document breaking changes

## Quality Assurance

### Pre-commit Checklist

- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Performance impact assessed

### Code Review Checklist

- [ ] TDD methodology followed
- [ ] Tests provide good coverage
- [ ] Code follows project standards
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Documentation updated

---

**Last Updated**: 2025-01-27  
**Next Review**: After Task 1.0 completion  
**Maintained By**: Development Team
