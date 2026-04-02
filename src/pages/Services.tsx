import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Laptop,
  MessageSquareText,
  PackageCheck,
  Smartphone,
} from 'lucide-react';
import { FaAndroid, FaApple, FaLinux, FaWindows } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { cn } from '@/lib/utils';
import { generateQuote } from '@/lib/openrouter';

type ProductId = 'mobile' | 'web' | 'system';
type MobilePlatform = 'android' | 'ios' | 'both';
type WebFocus = 'dashboard' | 'portal' | 'website';
type SystemPlatform = 'linux' | 'macos' | 'windows';
type Currency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'BRL';

interface CountryOption {
  id: string;
  label: string;
  currency: Currency;
  symbol: string;
  timezone: string;
}

const steps = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Scope' },
  { id: 3, label: 'Details' },
  { id: 4, label: 'Review' },
] as const;

const countryOptions: CountryOption[] = [
  { id: 'us', label: 'United States', currency: 'USD', symbol: '$', timezone: 'America/New_York' },
  { id: 'uk', label: 'United Kingdom', currency: 'GBP', symbol: '£', timezone: 'Europe/London' },
  { id: 'eu', label: 'European Union', currency: 'EUR', symbol: '€', timezone: 'Europe/Paris' },
  { id: 'ca', label: 'Canada', currency: 'CAD', symbol: 'C$', timezone: 'America/Toronto' },
  { id: 'au', label: 'Australia', currency: 'AUD', symbol: 'A$', timezone: 'Australia/Sydney' },
  { id: 'jp', label: 'Japan', currency: 'JPY', symbol: '¥', timezone: 'Asia/Tokyo' },
  { id: 'in', label: 'India', currency: 'INR', symbol: '₹', timezone: 'Asia/Kolkata' },
  { id: 'br', label: 'Brazil', currency: 'BRL', symbol: 'R$', timezone: 'America/Sao_Paulo' },
];

const getUserLocation = (): CountryOption => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matched = countryOptions.find((c) => c.timezone === timezone);
    if (matched) return matched;
  } catch {}
  return countryOptions[0];
};

const productCards = [
  {
    id: 'mobile' as const,
    title: 'Mobile App',
    description: 'Native or cross-platform experiences for phones and tablets.',
    icon: Smartphone,
  },
  {
    id: 'web' as const,
    title: 'Web Application',
    description: 'Client portals, dashboards, and customer-facing browser products.',
    icon: Globe,
  },
  {
    id: 'system' as const,
    title: 'Desktop Software',
    description: 'Focused software for operational teams on desktop environments.',
    icon: Laptop,
  },
];

const mobileOptions = [
  { id: 'android' as const, label: 'Android', icon: FaAndroid },
  { id: 'ios' as const, label: 'iOS', icon: FaApple },
  { id: 'both' as const, label: 'Both', icon: Smartphone },
];

const webOptions = [
  { id: 'dashboard' as const, label: 'Dashboard', description: 'Internal tools and analytics views.' },
  { id: 'portal' as const, label: 'Client Portal', description: 'Accounts, onboarding, and user workflows.' },
  { id: 'website' as const, label: 'Business Website', description: 'Marketing pages with lighter interactions.' },
];

const systemOptions = [
  { id: 'linux' as const, label: 'Linux', icon: FaLinux },
  { id: 'macos' as const, label: 'macOS', icon: FaApple },
  { id: 'windows' as const, label: 'Windows', icon: FaWindows },
];

export default function Services() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductId | null>(null);
  const [mobilePlatform, setMobilePlatform] = useState<MobilePlatform | null>(null);
  const [webFocus, setWebFocus] = useState<WebFocus | null>(null);
  const [systemPlatforms, setSystemPlatforms] = useState<SystemPlatform[]>([]);
  const [description, setDescription] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteResult, setQuoteResult] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry(getUserLocation());
    }
  }, [selectedCountry]);

  const selectedProductCard = productCards.find((card) => card.id === selectedProduct) ?? null;

  const stepTwoValid = useMemo(() => {
    if (!selectedProduct) return false;
    if (selectedProduct === 'mobile') return mobilePlatform !== null;
    if (selectedProduct === 'web') return webFocus !== null;
    return systemPlatforms.length > 0;
  }, [mobilePlatform, selectedProduct, systemPlatforms, webFocus]);

  const canMoveForward =
    currentStep === 1
      ? selectedProduct !== null
      : currentStep === 2
        ? stepTwoValid
        : currentStep === 3
          ? description.trim().length > 0
          : true;

  const selectionSummary = useMemo(() => {
    if (!selectedProductCard) return [];

    const lines = [`Service: ${selectedProductCard.title}`];

    if (selectedProduct === 'mobile') {
      const mobileLabel =
        mobileOptions.find((option) => option.id === mobilePlatform)?.label ?? 'Not selected';
      lines.push(`Platform: ${mobileLabel}`);
    }

    if (selectedProduct === 'web') {
      const webLabel = webOptions.find((option) => option.id === webFocus)?.label ?? 'Not selected';
      lines.push(`Focus: ${webLabel}`);
    }

    if (selectedProduct === 'system') {
      const labels = systemOptions
        .filter((option) => systemPlatforms.includes(option.id))
        .map((option) => option.label)
        .join(', ');
      lines.push(`Target OS: ${labels || 'Not selected'}`);
    }

    return lines;
  }, [mobilePlatform, selectedProduct, selectedProductCard, systemPlatforms, webFocus]);

  const getQuote = async () => {
    if (!selectedCountry) {
      alert('Location not detected. Please refresh the page.');
      return;
    }

    setIsLoadingQuote(true);
    setQuoteResult(null);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        alert('API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
        setIsLoadingQuote(false);
        return;
      }

      const serviceText = selectedProductCard?.title || '';
      const scopeText = selectionSummary.slice(1).join(', ') || 'Not specified';

      const result = await generateQuote({
        service: serviceText,
        scope: scopeText,
        details: description.trim(),
        country: selectedCountry,
      });

      setQuoteResult(result);
    } catch (error) {
      console.error('Quote generation failed:', error);
      alert(`Failed to generate quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const chooseProduct = (product: ProductId) => {
    setSelectedProduct(product);
    setMobilePlatform(null);
    setWebFocus(null);
    setSystemPlatforms([]);
  };

  const toggleSystemPlatform = (platform: SystemPlatform) => {
    setSystemPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  };

  const goNext = () => {
    if (!canMoveForward || currentStep === 4) return;
    setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const goBack = () => {
    if (currentStep === 1) return;
    setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_60%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-primary">
            Services Wizard
          </div>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[28px] border border-border/80 bg-card/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-7">
            <div className="mb-8 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary/80">Get a Quote</p>
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  Tell us what needs to be built.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                  This flow keeps the request focused. Choose one service, define the scope, describe
                  the work, then review the request before sending it.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/70 p-4">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  <span>Progress</span>
                  <span>Step {currentStep} of {steps.length}</span>
                </div>
                <div className="mb-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isComplete = step.id < currentStep;

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-left transition-colors',
                          isActive
                            ? 'border-primary/60 bg-primary/10'
                            : isComplete
                              ? 'border-primary/20 bg-primary/5'
                              : 'border-border bg-card'
                        )}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                              isActive || isComplete
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {isComplete ? <Check className="h-3.5 w-3.5" /> : step.id}
                          </div>
                          <span className="text-sm font-medium text-foreground">{step.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Choose one service</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Start with the primary product you want quoted. You can keep the request focused
                      and specific.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {productCards.map((card) => {
                      const Icon = card.icon;
                      const isSelected = selectedProduct === card.id;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => chooseProduct(card.id)}
                          className={cn(
                            'relative flex min-h-[220px] flex-col rounded-2xl border p-5 text-left transition-all duration-200',
                            isSelected
                              ? 'border-primary/60 bg-primary/10 shadow-[0_18px_40px_rgba(14,165,233,0.12)]'
                              : 'border-border bg-background/70 hover:border-primary/35 hover:bg-background'
                          )}
                        >
                          <div className="mb-6 flex items-start justify-between">
                            <div
                              className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-xl border',
                                isSelected
                                  ? 'border-primary/30 bg-primary text-primary-foreground'
                                  : 'border-border bg-card text-primary'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full border',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border text-transparent'
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                          <h3 className="mb-2 text-lg font-semibold">{card.title}</h3>
                          <p className="text-sm leading-6 text-muted-foreground">{card.description}</p>
                          <div className="mt-auto pt-6 text-xs uppercase tracking-[0.22em] text-primary/75">
                            Select service
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedProduct === 'mobile' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Choose a mobile platform</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Pick the device target for the app quote.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {mobileOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = mobilePlatform === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setMobilePlatform(option.id)}
                          className={cn(
                            'flex min-h-[160px] flex-col rounded-2xl border p-5 text-left transition-all',
                            isSelected
                              ? 'border-primary/60 bg-primary/10'
                              : 'border-border bg-background/70 hover:border-primary/35'
                          )}
                        >
                          <div
                            className={cn(
                              'mb-5 flex h-11 w-11 items-center justify-center rounded-xl border',
                              isSelected
                                ? 'border-primary/30 bg-primary text-primary-foreground'
                                : 'border-border bg-card text-primary'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold">{option.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {option.id === 'both'
                              ? 'Reach both ecosystems with one scoped quote.'
                              : `Target ${option.label} users first.`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedProduct === 'web' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Define the web product</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Choose the closest shape for the browser experience you want built.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {webOptions.map((option) => {
                      const isSelected = webFocus === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setWebFocus(option.id)}
                          className={cn(
                            'flex w-full items-start justify-between rounded-2xl border p-5 text-left transition-all',
                            isSelected
                              ? 'border-primary/60 bg-primary/10'
                              : 'border-border bg-background/70 hover:border-primary/35'
                          )}
                        >
                          <div className="pr-4">
                            <h3 className="text-lg font-semibold">{option.label}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                          <div
                            className={cn(
                              'mt-1 flex h-7 w-7 items-center justify-center rounded-full border',
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border text-transparent'
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedProduct === 'system' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Choose desktop targets</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Select one or more operating systems for the software quote.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {systemOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = systemPlatforms.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleSystemPlatform(option.id)}
                          className={cn(
                            'flex min-h-[160px] flex-col rounded-2xl border p-5 text-left transition-all',
                            isSelected
                              ? 'border-primary/60 bg-primary/10'
                              : 'border-border bg-background/70 hover:border-primary/35'
                          )}
                        >
                          <div className="mb-5 flex items-start justify-between">
                            <div
                              className={cn(
                                'flex h-11 w-11 items-center justify-center rounded-xl border',
                                isSelected
                                  ? 'border-primary/30 bg-primary text-primary-foreground'
                                  : 'border-border bg-card text-primary'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-full border',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border text-transparent'
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold">{option.label}</h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Include {option.label} in the delivery scope.
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Describe the project</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Share the core problem, intended users, and the most important outcomes.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/70 p-5">
                    <div className="grid gap-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:items-start">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary">
                        <MessageSquareText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 space-y-3 text-left">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">Project brief</h3>
                          <p className="text-sm text-muted-foreground">
                            Example: customer onboarding app, internal dashboard, or field operations desktop tool.
                          </p>
                        </div>

                        <textarea
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Describe what should be built, who will use it, and any must-have workflows."
                          className="min-h-[220px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-4 text-sm leading-7 outline-none transition-all placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Review your request</h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Check the service scope before sending the quote request.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      Your Location (Auto-detected)
                    </p>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                      <Globe className="h-4 w-4 text-primary" />
                      {selectedCountry?.label} ({selectedCountry?.currency})
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary">
                          {selectedProduct === 'mobile' && <Smartphone className="h-5 w-5" />}
                          {selectedProduct === 'web' && <Globe className="h-5 w-5" />}
                          {selectedProduct === 'system' && <Laptop className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedProductCard?.title}</h3>
                          <p className="text-sm text-muted-foreground">Selected service</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectionSummary.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground/85"
                          >
                            <Check className="h-4 w-4 text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/70 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary">
                          <PackageCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Project details</h3>
                          <p className="text-sm text-muted-foreground">Request summary</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-foreground/85">
                        {description.trim()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="mt-8 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 1}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors',
                  currentStep === 1 && 'cursor-not-allowed opacity-45'
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex items-center gap-3">
                {currentStep < 4 ? (
                  <ShinyButton
                    onClick={goNext}
                    disabled={!canMoveForward}
                    className={cn(
                      'px-5 py-3 text-sm',
                      !canMoveForward && 'cursor-not-allowed opacity-45 hover:shadow-none'
                    )}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </ShinyButton>
                ) : (
                  <div className="space-y-3">
                    <ShinyButton
                      onClick={getQuote}
                      disabled={isLoadingQuote || !selectedCountry}
                      className={cn(
                        'w-full justify-center px-5 py-3 text-sm',
                        (!selectedCountry || isLoadingQuote) && 'cursor-not-allowed opacity-45 hover:shadow-none'
                      )}
                    >
                      {isLoadingQuote ? (
                        <>
                          <span className="animate-pulse">Generating...</span>
                        </>
                      ) : (
                        <>
                          Get Quote
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </ShinyButton>
                  </div>
                )}
              </div>
            </div>

            {quoteResult && currentStep === 4 && (
              <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/10 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                  Your Quote
                </p>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {quoteResult}
                </div>
              </div>
            )}
          </section>

          <aside className="h-fit space-y-4 rounded-[28px] border border-border/80 bg-card/88 p-5 lg:sticky lg:top-8">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">Current Step</p>
              <h2 className="text-2xl font-semibold tracking-tight">{steps[currentStep - 1].label}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                A guided quote request with one service per submission.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                What you have so far
              </p>
              <div className="space-y-2.5">
                {selectionSummary.length ? (
                  selectionSummary.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground/85"
                    >
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border px-3 py-5 text-sm text-muted-foreground">
                    No selection yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Step guidance
              </p>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                <li>Choose one service to keep the quote focused.</li>
                <li>Step two adapts to the selected service type.</li>
                <li>Write the key requirements before submitting.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
