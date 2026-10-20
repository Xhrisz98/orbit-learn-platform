import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-serverless-dev',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api/send-email')) {
            try {
              const { default: handler } = await import('./api/send-email.ts');
              let bodyStr = '';
              req.on('data', chunk => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                let body = {};
                try {
                  body = JSON.parse(bodyStr);
                } catch {
                  // ignore
                }
                const vercelRes: any = res;
                vercelRes.status = (statusCode: number) => {
                  res.statusCode = statusCode;
                  return vercelRes;
                };
                vercelRes.json = (data: any) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return vercelRes;
                };
                vercelRes.setHeader = (name: string, val: string) => {
                  res.setHeader(name, val);
                  return vercelRes;
                };
                await handler({ ...req, body }, vercelRes);
              });
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Dev API Error' }));
            }
          } else {
            next();
          }
        });
      },
    },
  ],
})
