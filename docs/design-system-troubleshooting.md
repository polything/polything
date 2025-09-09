# Design System Troubleshooting Guide

**Date:** 2025-01-27  
**Version:** 1.0  
**Scope:** Polything Design System  

## Quick Reference

### Common Error Messages
- `Module not found: Can't resolve '@/components/design-system'`
- `Element type is invalid: expected a string but got: undefined`
- `Syntax error: Unexpected token, expected ","`
- `Glass morphic effects not working`
- `Fonts not loading properly`

## Build and Compilation Issues

### 1. Module Resolution Errors

#### Error: `Module not found: Can't resolve '@/components/design-system'`

**Symptoms:**

```
Module not found: Can't resolve '@/components/design-system'
Import trace for requested module:
./app/design-system-demo/page.tsx
```

**Causes:**

- Missing or incorrect import path
- Design system index file not properly exporting components
- TypeScript path mapping issues

**Solutions:**

1. **Check import path:**

   ```typescript
   // ✅ Correct
   import { Container, Section, Grid } from '@/components/design-system'
   
   // ❌ Incorrect
   import { Container } from '@/components/design-system/container'
   ```

2. **Verify design system exports:**

   ```typescript
   // Check components/design-system/index.ts
   export { default as Container } from './container'
   export { default as Section } from './section'
   // ... other exports
   ```

3. **Check TypeScript configuration:**

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

### 2. Component Import Errors

#### Error: `Element type is invalid: expected a string but got: undefined`

**Symptoms:**

```
Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
```

**Causes:**

- Component not properly exported
- Mixed up default vs named imports
- Circular dependency issues

**Solutions:**

1. **Check component exports:**

   ```typescript
   // ✅ Correct - Default export
   const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
     // component implementation
   }
   export default Container
   
   // ✅ Correct - Named export
   export const Container: React.FC<ContainerProps> = ({ children, ...props }) => {
     // component implementation
   }
   ```

2. **Verify import statements:**

   ```typescript
   // ✅ Correct - Default import
   import Container from './container'
   
   // ✅ Correct - Named import
   import { Container } from './container'
   ```

3. **Check for circular dependencies:**

   ```bash
   # Install dependency checker
   npm install --save-dev madge
   
   # Check for circular dependencies
   npx madge --circular --extensions ts,tsx components/design-system/
   ```

### 3. TypeScript Syntax Errors

#### Error: `Syntax error: Unexpected token, expected ","`

**Symptoms:**

```
Syntax error: Unexpected token, expected ","
  3 | import { cva, type VariantProps } from "class-variance-authority"
    |                    ^
```

**Causes:**

- Babel configuration conflicts with TypeScript
- Missing TypeScript preset in Babel
- SWC/Babel configuration issues

**Solutions:**

1. **Remove conflicting Babel configurations:**

   ```bash
   # Remove .babelrc if present
   rm .babelrc
   
   # Remove babel.config.js if present
   rm babel.config.js
   ```

2. **Use Next.js SWC (recommended):**

   ```javascript
   // next.config.mjs
   export default {
     // SWC is enabled by default in Next.js 13+
     // No additional configuration needed
   }
   ```

3. **If Babel is required, add TypeScript preset:**

   ```json
   // .babelrc
   {
     "presets": [
       ["@babel/preset-env", { "targets": { "node": "current" } }],
       ["@babel/preset-react", { "runtime": "automatic" }],
       "@babel/preset-typescript"
     ]
   }
   ```

## Runtime Issues

### 4. Glass Morphic Effects Not Working

#### Problem: Glass containers appear solid without blur effect

**Symptoms:**
- Glass containers have solid backgrounds
- No backdrop blur effect visible
- Decorative elements not showing

**Causes:**

- Browser doesn't support `backdrop-filter`
- CSS classes not properly applied
- Missing Tailwind CSS configuration

**Solutions:**

1. **Check browser support:**

   ```javascript
   // Check if backdrop-filter is supported
   if (CSS.supports('backdrop-filter', 'blur(10px)')) {
     console.log('Backdrop filter supported')
   } else {
     console.log('Backdrop filter not supported')
   }
   ```

2. **Verify CSS classes:**

   ```css
   /* Check if these classes are applied */
   .glass {
     @apply bg-white/20 backdrop-blur-md border border-white/30 shadow-lg;
   }
   ```

3. **Test with manual CSS:**

   ```css
   .test-glass {
     background: rgba(255, 255, 255, 0.2);
     backdrop-filter: blur(10px);
     border: 1px solid rgba(255, 255, 255, 0.3);
     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
   }
   ```

### 5. Font Loading Issues

#### Problem: Raleway/Inter fonts not displaying

**Symptoms:**
- Fallback fonts showing instead of custom fonts
- Fonts loading but not applying
- Console errors about font loading

**Causes:**

- `next/font` configuration issues
- Network connectivity problems
- Font file corruption

**Solutions:**

1. **Check font configuration:**

   ```typescript
   // app/layout.tsx
   import { Inter, Raleway } from 'next/font/google'
   
   const inter = Inter({
     subsets: ['latin'],
     display: 'swap',
     variable: '--font-inter'
   })
   
   const raleway = Raleway({
     subsets: ['latin'],
     display: 'swap',
     variable: '--font-raleway'
   })
   ```

2. **Verify CSS variables:**

   ```css
   /* Check if font variables are defined */
   :root {
     --font-inter: 'Inter', sans-serif;
     --font-raleway: 'Raleway', sans-serif;
   }
   ```

3. **Test font loading:**

   ```javascript
   // Check if fonts are loaded
   document.fonts.ready.then(() => {
     console.log('All fonts loaded')
   })
   ```

### 6. Responsive Design Issues

#### Problem: Mobile styles not working

**Symptoms:**
- Desktop styles showing on mobile
- Breakpoints not triggering
- Responsive classes not applied

**Causes:**

- Missing viewport meta tag
- Incorrect Tailwind breakpoint configuration
- CSS specificity issues

**Solutions:**

1. **Check viewport meta tag:**

   ```html
   <!-- app/layout.tsx -->
   <head>
     <meta name="viewport" content="width=device-width, initial-scale=1" />
   </head>
   ```

2. **Verify Tailwind configuration:**

   ```javascript
   // tailwind.config.ts
   module.exports = {
     theme: {
       screens: {
         'sm': '640px',
         'md': '768px',
         'lg': '1024px',
         'xl': '1280px',
         '2xl': '1536px',
       }
     }
   }
   ```

3. **Test responsive classes:**

   ```typescript
   // Test responsive class generation
   import { createResponsiveClasses } from '@/lib/design-system'
   
   const classes = createResponsiveClasses('text-lg', {
     'md': 'text-xl',
     'lg': 'text-2xl'
   })
   console.log(classes) // Should output: "text-lg md:text-xl lg:text-2xl"
   ```

## Component-Specific Issues

### 7. Hero Component Issues

#### Problem: Hero components not rendering correctly

**Symptoms:**
- Hero content not displaying
- Video backgrounds not playing
- Image backgrounds not loading

**Solutions:**

1. **Check hero data structure:**

   ```typescript
   // Verify hero data format
   const heroData = {
     title: "Hero Title",
     subtitle: "Hero Subtitle",
     background_color: "#2A2F67",
     text_color: "#ffffff",
     image: "/images/hero-bg.jpg", // Optional
     video: "/videos/hero-bg.mp4"  // Optional
   }
   ```

2. **Test video autoplay:**

   ```typescript
   // Check if video autoplay is working
   const video = document.querySelector('video')
   if (video) {
     video.play().catch(error => {
       console.log('Autoplay prevented:', error)
     })
   }
   ```

3. **Verify image paths:**

   ```typescript
   // Check if images exist
   const img = new Image()
   img.onload = () => console.log('Image loaded')
   img.onerror = () => console.log('Image failed to load')
   img.src = '/images/hero-bg.jpg'
   ```

### 8. Grid System Issues

#### Problem: Grid layouts not working correctly

**Symptoms:**
- Items not aligning properly
- Responsive columns not working
- Gaps not applied

**Solutions:**

1. **Check grid configuration:**

   ```typescript
   // Verify grid props
   <Grid 
     cols={3} 
     gap="lg" 
     responsive={{ md: 2, lg: 3 }}
   >
     {/* Grid items */}
   </Grid>
   ```

2. **Test CSS Grid support:**

   ```javascript
   // Check if CSS Grid is supported
   if (CSS.supports('display', 'grid')) {
     console.log('CSS Grid supported')
   } else {
     console.log('CSS Grid not supported')
   }
   ```

3. **Verify Tailwind grid classes:**

   ```css
   /* Check if these classes are generated */
   .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
   .gap-lg { gap: 1.5rem; }
   ```

## Performance Issues

### 9. Bundle Size Issues

#### Problem: Large bundle size

**Symptoms:**
- Slow page load times
- Large JavaScript bundles
- Poor Lighthouse scores

**Solutions:**

1. **Analyze bundle size:**

   ```bash
   # Install bundle analyzer
   npm install --save-dev @next/bundle-analyzer
   
   # Analyze bundle
   npm run build
   npm run analyze
   ```

2. **Use dynamic imports:**

   ```typescript
   // Lazy load heavy components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <div>Loading...</div>
   })
   ```

3. **Optimize imports:**

   ```typescript
   // ✅ Import only what you need
   import { Container, Section } from '@/components/design-system'
   
   // ❌ Import everything
   import * as DesignSystem from '@/components/design-system'
   ```

### 10. Memory Leaks

#### Problem: Memory usage increasing over time

**Symptoms:**
- Browser becoming slow
- High memory usage
- Event listeners not cleaned up

**Solutions:**

1. **Clean up event listeners:**

   ```typescript
   useEffect(() => {
     const handleResize = () => {
       // Handle resize
     }
     
     window.addEventListener('resize', handleResize)
     
     return () => {
       window.removeEventListener('resize', handleResize)
     }
   }, [])
   ```

2. **Use React.memo for expensive components:**

   ```typescript
   const ExpensiveComponent = React.memo(({ data }) => {
     // Component implementation
   })
   ```

## Debugging Tools

### 11. Development Tools

#### React Developer Tools

```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

#### Next.js Debug Mode

```bash
# Enable Next.js debug mode
DEBUG=* npm run dev

# Or specific debug namespaces
DEBUG=next:* npm run dev
```

#### Tailwind CSS Debug

```bash
# Install Tailwind CSS IntelliSense
# VS Code: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
```

### 12. Testing and Validation

#### Component Testing

```bash
# Run component tests
npm test -- components/design-system/

# Run specific test file
npm test -- components/design-system/container.test.tsx

# Run tests in watch mode
npm test -- --watch components/design-system/
```

#### Visual Regression Testing

```bash
# Install Playwright for visual testing
npm install --save-dev @playwright/test

# Run visual tests
npx playwright test
```

## Getting Help

### 13. Common Resources

#### Documentation
- [Design System Guide](../docs/design-system-guide.md)
- [Implementation Documentation](../docs/design-system-implementation.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

#### Community Support
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [Tailwind CSS GitHub Issues](https://github.com/tailwindlabs/tailwindcss/issues)
- [React GitHub Issues](https://github.com/facebook/react/issues)

#### Debugging Checklist
- [ ] Check browser console for errors
- [ ] Verify component imports and exports
- [ ] Test in different browsers
- [ ] Check responsive breakpoints
- [ ] Validate TypeScript types
- [ ] Run component tests
- [ ] Check network requests
- [ ] Verify CSS class generation

## Conclusion

This troubleshooting guide covers the most common issues encountered when working with the Polything Design System. For issues not covered here, please refer to the main documentation or create an issue in the project repository.

Remember to:
1. **Check the browser console** for error messages
2. **Verify component imports** and exports
3. **Test in multiple browsers** for compatibility issues
4. **Use the development tools** for debugging
5. **Run the test suite** to ensure everything is working correctly
