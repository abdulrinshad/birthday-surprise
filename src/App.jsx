import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingParticles from './components/FloatingParticles';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageThree from './pages/PageThree';
import PageFour from './pages/PageFour';
import Admin from './pages/Admin';
import { trackEvent, AnalyticsEvents } from './analytics/analytics';

/**
 * App:
 * Master controller for the Birthday Surprise website.
 * Orchestrates navigation across the complete flow:
 * - Page 1: Cinematic Intro, Envelope, Letter
 * - Page 2: Mystery Painting interactive experience
 * - Page 3: Memories & Voice Notes (placeholder)
 * - Page 4: Final Birthday Experience & Malayalam message
 * - /admin: Private analytics dashboard (password protected)
 */
function App() {
  const [currentPage, setCurrentPage] = useState('page1');
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#/admin' ||
      window.location.hash.startsWith('#/admin') ||
      window.location.search.includes('admin')
    );
  });

  // Listen to browser navigation (back/forward or hash changes)
  useEffect(() => {
    const checkRoute = () => {
      const isAdmin =
        window.location.pathname === '/admin' ||
        window.location.pathname.startsWith('/admin') ||
        window.location.hash === '#/admin' ||
        window.location.hash.startsWith('#/admin') ||
        window.location.search.includes('admin');
      setIsAdminRoute(isAdmin);
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Track initial link open on surprise site
  useEffect(() => {
    if (!isAdminRoute) {
      trackEvent(AnalyticsEvents.LINK_OPENED, 'page1');
      trackEvent(AnalyticsEvents.PAGE_1_VIEWED, 'page1');
    }
  }, [isAdminRoute]);

  // Track page transitions
  const navigateToPage = (targetPage) => {
    setCurrentPage(targetPage);
    if (targetPage === 'page1') {
      trackEvent(AnalyticsEvents.PAGE_1_VIEWED, 'page1');
    } else if (targetPage === 'page2') {
      trackEvent(AnalyticsEvents.PAGE_2_VIEWED, 'page2');
    } else if (targetPage === 'page3') {
      trackEvent(AnalyticsEvents.PAGE_3_VIEWED, 'page3');
    } else if (targetPage === 'page4') {
      trackEvent(AnalyticsEvents.PAGE_4_VIEWED, 'page4');
    }
  };

  // If navigating to /admin, render private Admin Dashboard
  if (isAdminRoute) {
    return <Admin />;
  }

  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflowX: 'hidden'
      }}
    >
      {/* Persistent Atmospheric Ambient Glows */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="subtle-vignette" />
      </div>

      {/* Subtle Floating Embers / Star Particles */}
      <FloatingParticles />

      {/* Seamless Page Transition */}
      <AnimatePresence mode="wait">
        {currentPage === 'page1' && (
          <PageOne
            key="page-one"
            onContinueToPageTwo={() => navigateToPage('page2')}
          />
        )}

        {currentPage === 'page2' && (
          <PageTwo
            key="page-two"
            onBack={() => navigateToPage('page1')}
            onContinue={() => navigateToPage('page3')}
          />
        )}

        {currentPage === 'page3' && (
          <PageThree
            key="page-three"
            onBack={() => navigateToPage('page2')}
            onContinue={() => navigateToPage('page4')}
          />
        )}

        {currentPage === 'page4' && (
          <PageFour
            key="page-four"
            onBack={() => navigateToPage('page3')}
            onRestart={() => navigateToPage('page1')}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;
