import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { offerings } from '../src/seo/offerings.mjs';
import { crawlableRoutes, writeCrawlableDocuments } from './render-crawlable-html.mjs';

const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing built homepage: ${indexPath}`);
}

writeCrawlableDocuments(distDir, crawlableRoutes(offerings));
