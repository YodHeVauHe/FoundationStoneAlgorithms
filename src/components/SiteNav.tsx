import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Monolith from '@/components/hero/Monolith';
import { Button } from '@/components/ui/button';
import { primaryNavigation } from '@/seo/pages.mjs';
import { cn } from '@/lib/utils';

const mobileMenuId = 'site-nav-mobile-menu';

function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (current) => {
    setScrolled(current > 8);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const condensed = scrolled || menuOpen;

  return (
    <header
      className={
        'sticky top-0 z-40 transition-colors duration-300 ' +
        (condensed
          ? 'border-b border-border bg-background/85 backdrop-blur-md'
          : 'border-b border-transparent')
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Monolith still className="h-8 w-8" />
          <span className="sr-only">Foundation Stone Algorithms</span>
          <span className="text-sm font-semibold tracking-tight">Foundation Stone Algorithms</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
            {primaryNavigation.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActivePath(location.pathname, link.href) ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActivePath(location.pathname, link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link to="/services" className="hidden lg:inline-flex">
            <Button size="sm">Start a project</Button>
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:text-goggles lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id={mobileMenuId}
          aria-label="Primary"
          className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-4">
            {primaryNavigation.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                aria-current={isActivePath(location.pathname, link.href) ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'py-2.5 text-sm font-medium transition-colors',
                  isActivePath(location.pathname, link.href)
                    ? 'text-goggles'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/services" onClick={() => setMenuOpen(false)} className="mt-3">
              <Button size="sm" className="w-full">
                Start a project
              </Button>
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
