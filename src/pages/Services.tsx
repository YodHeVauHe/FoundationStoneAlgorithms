import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Code2,
  Globe,
  Laptop,
  Layers3,
  MessageSquareText,
  MonitorSmartphone,
  PackageCheck,
  Smartphone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { cn } from '@/lib/utils';

type ProductId = 'mobile' | 'web' | 'system';
type MobilePlatform = 'android' | 'ios' | 'both';
type SystemPlatform = 'linux' | 'macos' | 'windows';

const productCards = [
  {
    id: 'mobile' as const,
    title: 'Mobile App',
    description: 'Native applications for iOS and Android devices.',
    icon: Smartphone,
  },
  {
    id: 'web' as const,
    title: 'Web Application',
    description: 'Responsive, browser-based software solutions.',
    icon: Globe,
  },
  {
    id: 'system' as const,
    title: 'Desktop Software',
    description: 'Powerful applications for Windows, macOS, and Linux.',
    icon: Laptop,
  },
];

const mobileOptions = [
  { id: 'android' as const, label: 'Android', icon: Smartphone },
  { id: 'ios' as const, label: 'iOS', icon: MonitorSmartphone },
  { id: 'both' as const, label: 'Both', icon: Layers3 },
];

const systemOptions = [
  { id: 'linux' as const, label: 'Linux', icon: Code2 },
  { id: 'macos' as const, label: 'macOS', icon: Laptop },
  { id: 'windows' as const, label: 'Windows', icon: MonitorSmartphone },
];

export default function Services() {
  const [selectedProducts, setSelectedProducts] = useState<ProductId[]>([]);
  const [mobilePlatform, setMobilePlatform] = useState<MobilePlatform | null>(null);
  const [systemPlatforms, setSystemPlatforms] = useState<SystemPlatform[]>([]);
  const [description, setDescription] = useState('');

  const toggleProduct = (product: ProductId) => {
    setSelectedProducts((prev) => {
      const next = prev.includes(product)
        ? prev.filter((item) => item !== product)
        : [...prev, product];

      if (!next.includes('mobile')) {
        setMobilePlatform(null);
      }

      if (!next.includes('system')) {
        setSystemPlatforms([]);
      }

      return next;
    });
  };

  const toggleSystemPlatform = (platform: SystemPlatform) => {
    setSystemPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const canSubmit = useMemo(() => {
    if (!selectedProducts.length || !description.trim()) {
      return false;
    }

    if (selectedProducts.includes('mobile') && !mobilePlatform) {
      return false;
    }

    if (selectedProducts.includes('system') && !systemPlatforms.length) {
      return false;
    }

    return true;
  }, [description, mobilePlatform, selectedProducts, systemPlatforms]);

  const selectionSummary = useMemo(() => {
    const lines: string[] = [];

    selectedProducts.forEach((product) => {
      if (product === 'mobile') {
        const mobileLabel =
          mobileOptions.find((option) => option.id === mobilePlatform)?.label || 'Not selected';
        lines.push(`Mobile app: ${mobileLabel}`);
        return;
      }

      if (product === 'system') {
        const labels = systemOptions
          .filter((option) => systemPlatforms.includes(option.id))
          .map((option) => option.label)
          .join(', ');
        lines.push(`Desktop app: ${labels || 'Not selected'}`);
        return;
      }

      lines.push('Web app: Selected');
    });

    return lines;
  }, [mobilePlatform, selectedProducts, systemPlatforms]);

  const getQuote = () => {
    const summary = [...selectionSummary, `Project details: ${description.trim()}`].join('\n');
    alert(`Quote Request Summary\n\n${summary}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/10 selection:text-primary">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.02)_100%)] pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] uppercase tracking-widest text-primary font-medium">
            Quote Builder
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid flex-1 gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* Main Content */}
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="font-serif text-lg italic text-primary">Build Scope</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Choose the products<br />you want quoted.
              </h1>
              <p className="max-w-xl font-serif text-xl italic text-muted-foreground">
                Select one or more products to create a custom engagement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {productCards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedProducts.includes(card.id);

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => toggleProduct(card.id)}
                    className={cn(
                      "group relative flex flex-col rounded-xl border p-6 text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(var(--primary),1)]"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/20 text-transparent"
                      )}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <h3 className="mb-2 font-semibold tracking-tight">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    
                    {/* Bottom active border */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-xl bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-options Area */}
            <div className="space-y-6">
              {selectedProducts.includes('mobile') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl border border-border bg-card/50 p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Mobile Platform</h3>
                      <p className="text-sm text-muted-foreground">Target audience devices.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {mobileOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = mobilePlatform === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setMobilePlatform(option.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:border-primary/50"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {selectedProducts.includes('system') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl border border-border bg-card/50 p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Desktop Platforms</h3>
                      <p className="text-sm text-muted-foreground">Supported operating systems.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {systemOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = systemPlatforms.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleSystemPlatform(option.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:border-primary/50"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <MessageSquareText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Project Details</h3>
                    <p className="text-sm text-muted-foreground">Briefly describe your requirements.</p>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g., I need a customer-facing mobile app..."
                  className="min-h-[120px] w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif italic text-lg text-foreground">Selected Scope</h2>
                <p className="text-xs text-muted-foreground">Live summary.</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedProducts.length ? (
                selectionSummary.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground/80">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                  <p className="text-sm text-muted-foreground">No products selected.</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-primary/5 p-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-primary/70 font-semibold">Included Logic</p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                <li>Mobile requires OS selection.</li>
                <li>Desktop allows multiple targets.</li>
              </ul>
            </div>

            <div className="pt-2">
              <ShinyButton
                onClick={getQuote}
                disabled={!canSubmit}
                className={cn(
                  "w-full justify-center text-sm font-medium",
                  !canSubmit && "opacity-50 cursor-not-allowed hover:shadow-none"
                )}
              >
                Request Quote
              </ShinyButton>
            </div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
}
