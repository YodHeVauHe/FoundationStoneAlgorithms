import path from 'path';
import react from '@vitejs/plugin-react';
import { handleQuoteRequest } from './api/generate-quote.mjs';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function quoteApiDevPlugin(): Plugin {
  return {
    name: 'quote-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/generate-quote', async (request, response, next) => {
        if (request.method !== 'POST') {
          next();
          return;
        }

        const maxBodyBytes = 8_192;
        const contentLength = Number(request.headers['content-length'] ?? 0);
        if (contentLength > maxBodyBytes) {
          response.statusCode = 413;
          response.end(JSON.stringify({ error: 'Request is too large.' }));
          return;
        }

        try {
          const chunks: Buffer[] = [];
          let bodySize = 0;
          for await (const chunk of request) {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            bodySize += buffer.length;
            if (bodySize > maxBodyBytes) {
              response.statusCode = 413;
              response.end(JSON.stringify({ error: 'Request is too large.' }));
              return;
            }
            chunks.push(buffer);
          }

          const protocol = request.headers['x-forwarded-proto']?.toString().split(',')[0] ?? 'http';
          const host = request.headers.host ?? 'localhost';
          const headers = new Headers();
          for (const [name, value] of Object.entries(request.headers)) {
            if (value) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
          }

          const webRequest = new Request(`${protocol}://${host}/api/generate-quote`, {
            method: 'POST',
            headers,
            body: Buffer.concat(chunks),
          });
          const result = await handleQuoteRequest(webRequest);
          response.statusCode = result.status;
          result.headers.forEach((value, name) => response.setHeader(name, value));
          response.end(await result.text());
        } catch {
          response.statusCode = 500;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'Could not process the quote request.' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '');
  if (!process.env.OPENROUTER_API_KEY && serverEnv.OPENROUTER_API_KEY) {
    process.env.OPENROUTER_API_KEY = serverEnv.OPENROUTER_API_KEY;
  }

  return {
    plugins: [react(), quoteApiDevPlugin()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
