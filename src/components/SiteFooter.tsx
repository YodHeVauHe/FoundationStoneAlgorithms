import type { ComponentType, ComponentProps, ReactNode } from 'react';
import Monolith from '@/components/hero/Monolith';
import { GitHubIcon, XIcon } from '@/components/icons/SocialIcons';
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

type SocialIconComponent = ComponentType<ComponentProps<'svg'>>;

const contactIcons: Record<string, SocialIconComponent> = {
  github: GitHubIcon,
  x: XIcon,
};

function getContactIcon(label: string): SocialIconComponent | null {
  return contactIcons[label.trim().toLowerCase()] ?? null;
}

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
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Contact
        </span>
        {siteContactLinks.map((link) => {
          const Icon = getContactIcon(link.label);
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {Icon ? (
                <Icon
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80 transition-all duration-200 group-hover:scale-110 group-hover:text-foreground"
                />
              ) : null}
              <span>{link.label}</span>
            </a>
          );
        })}
      </nav>

      {showMark ? <Monolith still className="h-8 w-8" /> : null}

      <p>
        © {year} {companyLegalName} · Company Registration No.{' '}
        {companyRegistrationNumber}
      </p>
    </footer>
  );
}
