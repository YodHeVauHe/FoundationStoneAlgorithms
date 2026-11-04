interface CountryOption {
  id: string;
  label: string;
  currency: string;
  symbol: string;
  timezone: string;
}

interface QuoteRequest {
  service: string;
  scope: string;
  details: string;
  country: CountryOption;
}

export async function generateQuote(request: QuoteRequest): Promise<string> {
  const response = await fetch('/api/generate-quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || `Quote request failed: ${response.status}`);
  }

  if (typeof result.quote !== 'string' || !result.quote.trim()) {
    throw new Error('No response from AI');
  }

  return result.quote.trim();
}
