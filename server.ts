import express from 'express';
import serveStatic from 'serve-static';
import next from 'next';
import nextEnv from '@next/env';
import errsole from 'errsole';
import ErrsoleSQLite from 'errsole-sqlite';
import path from 'node:path';
import fs from 'node:fs';
const { loadEnvConfig } = nextEnv;

loadEnvConfig('./', process.env.NODE_ENV !== 'production');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();
function normalizeBasePath(p?: string) {
  if (!p) return '';
  let bp = p.trim();
  if (bp === '/' || bp === '') return '';
  if (!bp.startsWith('/')) bp = '/' + bp;
  if (bp.endsWith('/')) bp = bp.slice(0, -1);
  return bp;
}
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const logsDir = path.join(process.cwd(), 'logs');
fs.mkdirSync(logsDir, { recursive: true });
errsole.initialize({
  storage: new ErrsoleSQLite(path.join(logsDir, 'errsole.db')),
  port: port + 5,
});

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASEPATH);
app.prepare().then(() => {
  const server = express();

  server.use(basePath + '/frontend-errsole', errsole.expressProxyMiddleware());
  // Serve static files (e.g. Next.js public/storage)
  server.use('/storage', serveStatic('public/storage', { index: false }));
  // server.use(express.json());
  server.post(basePath + '/api/client-logs', express.json(), (req, res) => {
    const { level, args, url } = req.body as {
      level: string;
      args: unknown[];
      url?: string;
    };
    if (level === 'log') console.log('[browser]', url, ...args);
    else if (level === 'info') console.info('[browser]', url, ...args);
    else if (level === 'warn') console.warn('[browser]', url, ...args);
    else console.error('[browser]', url, ...args);

    res.status(204).end();
  });

  server.use(`${basePath}/api`, (req, res, nextFn) => {
    res.setHeader('Cache-Control', 'no-store');
    nextFn();
  });

  if (basePath) {
    const baseRe = new RegExp(`^${escapeRegex(basePath)}(?:/.*)?$`);
    server.all(baseRe, (req, res) => handle(req, res));
  } else {
    server.all(/.*/, (req, res) => handle(req, res));
  }

  // Start server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port}${basePath || ''} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`,
    );
  });
});
