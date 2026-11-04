const maxBodyBytes = 8_192;

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function readText(value, maxLength) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function readQuoteContent(content) {
  if (typeof content === 'string') return content.trim() || null;
  if (!Array.isArray(content)) return null;

  const text = content
    .filter((part) => part?.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join('\n');

  return text || null;
}

function validateRequest(body) {
  const country = body?.country;
  const details = typeof body?.details === 'string' ? body.details.trim() : null;
  const request = {
    service: readText(body?.service, 100),
    scope: readText(body?.scope, 500),
    details: details !== null && details.length <= 2_000 ? details : null,
    country: {
      label: readText(country?.label, 100),
      currency: readText(country?.currency, 8),
      symbol: readText(country?.symbol, 12),
    },
  };

  if (
    !request.service ||
    !request.scope ||
    request.details === null ||
    !request.country.label ||
    !request.country.currency ||
    !request.country.symbol
  ) {
    return null;
  }

  return request;
}

export async function handleQuoteRequest(request) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const origin = request.headers.get('origin');
  let originUrl;
  try {
    originUrl = origin ? new URL(origin) : null;
  } catch {
    originUrl = null;
  }
  if (!originUrl || originUrl.origin !== new URL(request.url).origin) {
    return jsonResponse(403, { error: 'Request origin is not allowed.' });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxBodyBytes) {
    return jsonResponse(413, { error: 'Request is too large.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: 'Request body must be valid JSON.' });
  }

  const quoteRequest = validateRequest(body);
  if (!quoteRequest) {
    return jsonResponse(400, { error: 'Project details are missing or invalid.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse(503, { error: 'Quote service is not configured.' });
  }

  const systemPrompt = `You are a software development pricing expert. Provide a concise price estimate in the local currency of ${quoteRequest.country.label}. If a specific currency was requested (${quoteRequest.country.currency} ${quoteRequest.country.symbol}), use that.\n\nFormat:\n- Price: [Local Currency Symbol][Amount]\n- Simple breakdown in 1-2 lines\n- Keep it brief and professional`;
  const userContent = `Project Type: ${quoteRequest.service}\nScope: ${quoteRequest.scope}\nDetails: ${quoteRequest.details}\nCountry: ${quoteRequest.country.label}\n\nProvide a concise quote in the local currency of ${quoteRequest.country.label}.`;

  let response;
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': new URL(request.url).origin,
        'X-Title': 'Foundation Stone - Quote Generator',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.3,
        // Free auto-routed models vary; allow enough room for a short quote
        // and its breakdown, including models with a reasoning phase.
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return jsonResponse(502, { error: 'Could not reach OpenRouter. Please try again.' });
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const message = result?.error?.message;
    return jsonResponse(response.status, {
      error: typeof message === 'string' ? message : `OpenRouter request failed (${response.status}).`,
    });
  }

  const choice = result?.choices?.[0];
  const quote = readQuoteContent(choice?.message?.content);
  if (!quote) {
    console.warn('OpenRouter returned no quote text.', {
      model: result?.model,
      finishReason: choice?.finish_reason,
      messageFields: Object.keys(choice?.message ?? {}),
    });
    return jsonResponse(502, { error: 'OpenRouter returned an empty quote.' });
  }

  return jsonResponse(200, { quote });
}

export default {
  fetch: handleQuoteRequest,
};
