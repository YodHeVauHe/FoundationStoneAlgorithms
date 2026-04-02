# AI Quote Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Request Quote" button with an AI-powered instant price estimate that analyzes user input and returns a quotation in the user's local currency.

**Architecture:** Client-side React component that sends project details to OpenRouter API and displays the AI-generated price estimate. User selects country/currency manually from a predefined dropdown list.

**Tech Stack:** React, OpenRouter API (free models), Vite environment variables

---

### Task 1: Create .env.example file

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create .env.example with placeholder**

```bash
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

- [ ] **Step 2: Commit**

```bash
git add .env.example && git commit -m "feat: add .env.example template"
```

---

### Task 2: Add country/currency data and types

**Files:**
- Modify: `src/pages/Services.tsx`

- [ ] **Step 1: Add country/currency mapping and type definitions**

After the existing type definitions (around line 21), add:

```typescript
type Currency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'BRL';

interface CountryOption {
  id: string;
  label: string;
  currency: Currency;
  symbol: string;
}

const countryOptions: CountryOption[] = [
  { id: 'us', label: 'United States', currency: 'USD', symbol: '$' },
  { id: 'uk', label: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { id: 'eu', label: 'European Union', currency: 'EUR', symbol: '€' },
  { id: 'ca', label: 'Canada', currency: 'CAD', symbol: 'C$' },
  { id: 'au', label: 'Australia', currency: 'AUD', symbol: 'A$' },
  { id: 'jp', label: 'Japan', currency: 'JPY', symbol: '¥' },
  { id: 'in', label: 'India', currency: 'INR', symbol: '₹' },
  { id: 'br', label: 'Brazil', currency: 'BRL', symbol: 'R$' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Services.tsx && git commit -m "feat: add country/currency types and data"
```

---

### Task 3: Add state for country selection and quote

**Files:**
- Modify: `src/pages/Services.tsx:69-76`

- [ ] **Step 1: Add new state variables**

After existing useState declarations, add:

```typescript
const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
const [isLoadingQuote, setIsLoadingQuote] = useState(false);
const [quoteResult, setQuoteResult] = useState<string | null>(null);
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Services.tsx && git commit -m "feat: add state for country selection and quote"
```

---

### Task 4: Create OpenRouter API service

**Files:**
- Create: `src/lib/openrouter.ts`

- [ ] **Step 1: Create API service**

```typescript
interface QuoteRequest {
  service: string;
  scope: string;
  details: string;
  country: CountryOption;
}

export async function generateQuote(request: QuoteRequest): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const systemPrompt = `You are a software development pricing expert. Analyze the project description and provide a realistic price estimate in ${request.country.currency} (${request.country.symbol}). 
  
Provide only the price estimate with brief reasoning. Format: "Price: {symbol}{amount}" followed by 1-2 sentences explanation.`;

  const userContent = `Project Type: ${request.service}
Scope: ${request.scope}
Details: ${request.details}

Generate a price estimate in ${request.country.currency}.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Foundation Stone - Quote Generator',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-7b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 256,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from AI');
  }

  return content;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/openrouter.ts && git commit -m "feat: add OpenRouter API service"
```

---

### Task 5: Implement getQuote function with API call

**Files:**
- Modify: `src/pages/Services.tsx:122-125`

- [ ] **Step 1: Replace getQuote function**

Replace the existing getQuote function with:

```typescript
const getQuote = async () => {
  if (!selectedCountry) {
    alert('Please select your country first');
    return;
  }

  setIsLoadingQuote(true);
  setQuoteResult(null);

  try {
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
    alert('Failed to generate quote. Please try again.');
  } finally {
    setIsLoadingQuote(false);
  }
};
```

- [ ] **Step 2: Import the generateQuote function**

Add to imports at top of file:

```typescript
import { generateQuote } from '@/lib/openrouter';
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Services.tsx && git commit -m "feat: integrate AI quote generation"
```

---

### Task 6: Add country selector UI to step 4

**Files:**
- Modify: `src/pages/Services.tsx:499-541`

- [ ] **Step 1: Add country selector in Review step**

Find the Review step section and add a country selector above the selection summary. Add this after the title:

```tsx
<div className="mb-6 rounded-2xl border border-border bg-background/70 p-4">
  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
    Your Location
  </label>
  <select
    value={selectedCountry?.id || ''}
    onChange={(e) => {
      const country = countryOptions.find((c) => c.id === e.target.value) || null;
      setSelectedCountry(country);
      setQuoteResult(null);
    }}
    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
  >
    <option value="">Select your country</option>
    {countryOptions.map((country) => (
      <option key={country.id} value={country.id}>
        {country.label} ({country.currency})
      </option>
    ))}
  </select>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Services.tsx && git commit -m "feat: add country selector to review step"
```

---

### Task 7: Add loading state and quote display

**Files:**
- Modify: `src/pages/Services.tsx:560-580`

- [ ] **Step 1: Update button and add quote display**

Replace the button section with loading state and quote result display:

```tsx
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
    {quoteResult && (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
          Your Quote
        </p>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {quoteResult}
        </div>
      </div>
    )}
    
    <ShinyButton
      onClick={getQuote}
      disabled={isLoadingQuote || !selectedCountry}
      className={cn(
        'px-5 py-3 text-sm',
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Services.tsx && git commit -m "feat: add loading state and quote display"
```

---

### Task 8: Test and verify

**Files:**
- Run tests/lint/typecheck

- [ ] **Step 1: Run TypeScript check**

```bash
npm run build
```

Expected: No TypeScript errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors

- [ ] **Step 3: Verify .env setup instructions**

Ensure user knows to:
1. Copy `.env.example` to `.env`
2. Add their OpenRouter API key

- [ ] **Step 4: Final commit**

```bash
git add . && git commit -m "feat: add AI quote generator with currency support"
```
