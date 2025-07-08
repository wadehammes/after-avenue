# Performance Optimization Guide

This document outlines the performance improvements implemented in the After Avenue website and provides recommendations for further optimization.

## Implemented Optimizations

### 1. Bundle Analysis & Monitoring
- **Bundle Analyzer**: Added `@next/bundle-analyzer` for monitoring bundle size
- **Performance Monitoring**: Implemented Core Web Vitals tracking (FCP, LCP, FID, CLS, TTFB)
- **Resource Timing**: Track slow resources and long tasks
- **Analytics Integration**: Performance metrics sent to Google Analytics

### 2. Webpack Optimizations
- **Code Splitting**: Implemented vendor, React, and Contentful chunk splitting
- **SVG Optimization**: Enhanced SVGR configuration with additional optimizations
- **Compression**: Enabled gzip compression
- **Source Maps**: Disabled in production for smaller bundles

### 3. Component Optimizations
- **React.memo**: Applied to VideoPlayer and WorkCard components
- **Intersection Observer**: Already implemented for lazy loading
- **Debounced Video Controls**: Prevents rapid play/pause operations

### 4. Caching Strategy
- **Static Assets**: 1-year cache for images and fonts
- **Page Caching**: Tiered caching strategy based on content type
- **API Caching**: No-cache for dynamic API endpoints
- **CDN Optimization**: Leveraging Vercel's global CDN

### 5. Image Optimizations
- **Next.js Image**: Automatic optimization and lazy loading
- **Modern Formats**: WebP and AVIF support
- **Responsive Images**: Automatic sizing based on viewport

## Performance Metrics

### Core Web Vitals Targets
- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### Bundle Size Targets
- **Initial Bundle**: < 200KB gzipped
- **Total Bundle**: < 500KB gzipped
- **Vendor Bundle**: < 150KB gzipped

## Usage

### Bundle Analysis
```bash
# Analyze bundle size
pnpm build:analyze
```

### Performance Monitoring
Performance metrics are automatically tracked in production and sent to Google Analytics. Check the browser console for real-time metrics during development.

## Additional Recommendations

### 1. Dynamic Imports
Consider implementing dynamic imports for heavy components:

```typescript
// Example: Lazy load video components
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <VideoSkeleton />,
  ssr: false
});
```

### 2. Service Worker
Implement a service worker for:
- Offline functionality
- Background sync
- Push notifications
- Advanced caching strategies

### 3. Preloading Critical Resources
Add preload links for critical resources:

```html
<link rel="preload" href="/fonts/area.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical-styles.css" as="style">
```

### 4. Database Optimization
- Implement Redis caching for Contentful data
- Use GraphQL for more efficient data fetching
- Implement pagination for large datasets

### 5. Third-party Script Optimization
- Load non-critical third-party scripts asynchronously
- Use `rel="preconnect"` for external domains
- Implement resource hints for faster DNS resolution

### 6. Video Optimization
- Implement video lazy loading with intersection observer
- Use different video qualities based on connection speed
- Consider using WebM format for better compression

### 7. CSS Optimization
- Implement critical CSS inlining
- Remove unused CSS with PurgeCSS
- Use CSS containment for better rendering performance

### 8. JavaScript Optimization
- Implement tree shaking for unused code
- Use web workers for heavy computations
- Implement virtual scrolling for large lists
- Fixed passive event listener warnings for better touch performance

### 9. Touch Event Optimization
- **Passive Event Listeners**: Automatically added `passive: true` for touch events
- **Performance Impact**: Eliminates scroll-blocking touch events
- **Browser Compatibility**: Works across all modern browsers

## Monitoring & Maintenance

### Regular Checks
1. **Weekly**: Review Core Web Vitals in Google Analytics
2. **Monthly**: Run bundle analysis and optimize large dependencies
3. **Quarterly**: Audit third-party scripts and remove unused ones
4. **Annually**: Review and update performance budgets

### Performance Budgets
- **Page Load Time**: < 3 seconds on 3G
- **Time to Interactive**: < 5 seconds
- **Bundle Size**: < 500KB total
- **Image Size**: < 200KB per image

### Tools
- **Lighthouse**: Regular audits for performance scores
- **WebPageTest**: Cross-browser performance testing
- **Bundle Analyzer**: Monitor bundle size changes
- **Google Analytics**: Track real user metrics

## Troubleshooting

### Common Issues
1. **Large Bundle Size**: Use bundle analyzer to identify large dependencies
2. **Slow Images**: Optimize images and use appropriate formats
3. **Third-party Scripts**: Load asynchronously and defer non-critical scripts
4. **Layout Shifts**: Set explicit dimensions for images and videos
5. **Slow API Calls**: Implement caching and optimize database queries
6. **Touch Event Warnings**: Fixed with automatic passive event listener patching

### Performance Debugging
```javascript
// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  trackPerformanceMetrics();
  trackResourceTiming();
  trackLongTasks();
}
```

## Resources
- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer) 