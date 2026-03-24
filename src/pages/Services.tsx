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
import { Ripple } from '@/components/magicui/ripple';
import LetterGlitch from '@/components/ui/letter-glitch';
import { ShinyButton } from '@/components/magicui/shiny-button';

type ProductId = 'mobile' | 'web' | 'system';
type MobilePlatform = 'android' | 'ios' | 'both';
type SystemPlatform = 'linux' | 'macos' | 'windows';

const productCards = [
  {
    id: 'mobile' as const,
    title: 'Mobile app',
    description: 'Apps for phones and tablets with Android, iOS, or both.',
    icon: Smartphone,
  },
  {
    id: 'web' as const,
    title: 'Web app',
    description: 'Browser-based products with no extra platform choice needed.',
    icon: Globe,
  },
  {
    id: 'system' as const,
    title: 'Operating system app',
    description: 'Desktop software for Linux, macOS, or Windows.',
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

const productLabels: Record<ProductId, string> = {
  mobile: 'Mobile app',
  web: 'Web app',
  system: 'Operating system app',
};

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
        lines.push(`Operating system app: ${labels || 'Not selected'}`);
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
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="fixed inset-0 z-0">
        <LetterGlitch
          glitchColors={['#0ea5e9', '#06b6d4', '#3b82f6', '#0c4a6e', '#164e63']}
          glitchSpeed={20}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
          theme="dark"
        />
      </div>
      <Ripple className="fixed inset-0 z-0" mainCircleSize={250} mainCircleOpacity={0.35} numCircles={10} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-3 py-4 sm:px-5 lg:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-2.5 py-1.5 text-xs text-white/80 transition hover:border-primary/60 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <div className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
            Quote Builder
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid flex-1 gap-4 lg:grid-cols-[1.28fr_0.72fr]"
        >
          <section className="rounded-[1.5rem] border border-white/10 bg-black/45 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
            <div className="mb-6 max-w-xl">
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">Build Scope</p>
              <h1 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
                Choose the products you want quoted.
              </h1>
              <p className="text-xs leading-5 text-white/70 sm:text-sm">
                Pick one product, multiple products, or all of them. Extra options only appear when they are relevant.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {productCards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedProducts.includes(card.id);

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => toggleProduct(card.id)}
                    className={`group relative rounded-[1.2rem] border p-4 text-left transition duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/15 shadow-lg shadow-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-cyan-300/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                          isSelected ? 'bg-primary text-white' : 'bg-white/10 text-cyan-200'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-white/15 text-transparent'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <h2 className="mb-1.5 text-base font-semibold text-white">{card.title}</h2>
                    <p className="text-xs leading-5 text-white/65">{card.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-4">
              {selectedProducts.includes('mobile') && (
                <div className="rounded-[1.2rem] border border-cyan-400/25 bg-cyan-400/10 p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <Smartphone className="h-4.5 w-4.5 text-cyan-200" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Mobile platform</h3>
                      <p className="text-xs text-white/65">Choose Android, iOS, or both.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {mobileOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = mobilePlatform === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setMobilePlatform(option.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-white/15 bg-black/20 text-white/80 hover:border-primary/50'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedProducts.includes('system') && (
                <div className="rounded-[1.2rem] border border-emerald-400/25 bg-emerald-400/10 p-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <Laptop className="h-4.5 w-4.5 text-emerald-200" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">Operating system targets</h3>
                      <p className="text-xs text-white/65">Choose one or more desktop platforms.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {systemOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = systemPlatforms.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleSystemPlatform(option.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-white'
                              : 'border-white/15 bg-black/20 text-white/80 hover:border-emerald-400/50'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <MessageSquareText className="h-4.5 w-4.5 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Project details</h3>
                    <p className="text-xs text-white/65">Describe what you want built.</p>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Example: I need a customer-facing mobile app with a matching web dashboard and admin tools."
                  className="h-28 w-full resize-none rounded-[1rem] border border-white/10 bg-black/25 px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-white/35 focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-white/10 bg-black/45 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <PackageCheck className="h-4.5 w-4.5 text-primary" />
              <div>
                <h2 className="text-base font-semibold text-white">Selected scope</h2>
                <p className="text-xs text-white/65">Your quote request summary updates live.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {selectedProducts.length ? (
                selectionSummary.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/80">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-5 text-xs text-white/50">
                  Select at least one product to start building the quote request.
                </div>
              )}
            </div>

            <div className="mt-5 rounded-[1.2rem] border border-primary/20 bg-primary/10 p-3.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70">Included Logic</p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-white/75">
                <li>Mobile app requires one platform choice.</li>
                <li>Web app has no sub-option layer.</li>
                <li>Operating system app supports multiple OS targets.</li>
              </ul>
            </div>

            <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/5 p-3.5">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-white/45">Description</p>
              <p className="text-xs leading-5 text-white/70">
                {description.trim() || 'No project details added yet.'}
              </p>
            </div>

            <div className="mt-5">
              <ShinyButton
                onClick={getQuote}
                disabled={!canSubmit}
                className={`w-full justify-center px-3 py-1.5 text-xs ${
                  !canSubmit ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Get Quote
              </ShinyButton>
            </div>

            {!canSubmit && (
              <p className="mt-2.5 text-[11px] leading-4 text-white/50">
                Add at least one product, complete any required platform choices, and describe the project to enable the quote action.
              </p>
            )}

            <div className="mt-5 border-t border-white/10 pt-3 text-[10px] text-white/40">
              Categories available: {productCards.map((card) => productLabels[card.id]).join(' • ')}
            </div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
}
