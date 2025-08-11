import express from 'express';
import serveStatic from 'serve-static';
import next from 'next';
import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;

loadEnvConfig('./', process.env.NODE_ENV !== 'production');
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const server = express();
  server.use('/storage', serveStatic('public/storage', { index: false }));
  server.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });
  server.all('*', (req, res) => handle(req, res));
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`,
    );
  });
});
