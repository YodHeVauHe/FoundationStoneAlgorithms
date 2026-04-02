interface CountryOption {
  id: string;
  label: string;
  currency: string;
  symbol: string;
}

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
