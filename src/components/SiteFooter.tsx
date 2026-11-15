import type { ReactNode } from 'react';
import Monolith from '@/components/hero/Monolith';
import {
  companyLegalName,
  companyRegistrationNumber,
  siteContactLinks,
} from '@/seo/site.mjs';
import { cn } from '@/lib/utils';

type SiteFooterProps = {
  children?: ReactNode;
  showMark?: boolean;
  className?: string;
};

export default function SiteFooter({
  children,
  showMark = true,
  className,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-nosnippet
      className={cn(
        'relative z-10 flex flex-col items-center gap-3 px-6 py-10 text-center text-xs text-muted-foreground',
        className,
      )}
    >
      {children}

      <nav
        aria-label="Contact"
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Contact
        </span>
        {siteContactLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {showMark ? <Monolith still className="h-8 w-8" /> : null}

      <p>
        © {year} {companyLegalName} · Company Registration No.{' '}
        {companyRegistrationNumber}
      </p>
    </footer>
  );
}
