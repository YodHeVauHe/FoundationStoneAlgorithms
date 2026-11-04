export function handleQuoteRequest(request: Request): Promise<Response>;

declare const handler: {
  fetch: typeof handleQuoteRequest;
};

export default handler;
