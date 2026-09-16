import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { requestConfirmation } from './server/activation.mjs';

const port = Number(process.env.PORT || 4181);
const publicOrigin = process.env.PUBLIC_ORIGIN || `http://127.0.0.1:${port}`;
const root = fileURLToPath(new URL('.', import.meta.url));
const allowed = new Set(['index.html', 'style.css', 'activation.js', 'i18n.js', 'profile.jpg',
    'app1.jpg', 'app2.jpg', 'app3.jpg', 'apple-touch-icon.png', 'favicon-16.png',
    'favicon-32.png', 'favicon.ico', 'og-image.jpg']);
const types = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8',
    js: 'text/javascript; charset=utf-8', jpg: 'image/jpeg', png: 'image/png', ico: 'image/x-icon' };
const requests = new Map();
const inFlight = new Set();
const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of requests) if (now >= entry.until) requests.delete(ip);
}, 60000);
cleanup.unref();

createServer(async (req, res) => {
    const reply = (status, body) => {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        res.end(JSON.stringify(body));
    };
    let url;
    try { url = new URL(req.url, publicOrigin); }
    catch { return reply(400, { error: 'Dirección no válida.' }); }
    if (url.pathname === '/api/activate') {
        if (req.method !== 'POST') return reply(405, { error: 'Método no permitido.' });
        if (req.headers.origin !== publicOrigin) return reply(403, { error: 'Origen no permitido.' });
        if (!(req.headers['content-type'] || '').startsWith('application/json')) {
            return reply(415, { error: 'Formato no permitido.' });
        }
        const ip = req.socket.remoteAddress;
        const now = Date.now();
        const entry = requests.get(ip);
        if (inFlight.has(ip) || (entry && entry.until > now && entry.count >= 3)) {
            return reply(429, { error: 'Espera un minuto antes de realizar otra solicitud.' });
        }
        requests.set(ip, entry && entry.until > now ? { ...entry, count: entry.count + 1 }
            : { count: 1, until: now + 60000 });
        inFlight.add(ip);
        try {
            const chunks = [];
            let size = 0;
            for await (const chunk of req) {
                size += chunk.length;
                if (size > 2048) return reply(413, { error: 'La solicitud es demasiado grande.' });
                chunks.push(chunk);
            }
            let input;
            try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
            catch { return reply(400, { error: 'La solicitud no es válida.' }); }
            const result = await requestConfirmation(input);
            return reply(result.status, result.body);
        } catch {
            if (!res.headersSent) reply(500, { error: 'No se pudo procesar la solicitud.' });
        } finally {
            inFlight.delete(ip);
        }
        return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return reply(405, { error: 'Método no permitido.' });
    const name = ['/', '/activacion', '/activacion/'].includes(url.pathname)
        ? 'index.html' : url.pathname.slice(1);
    if (!allowed.has(name)) return reply(404, { error: 'No encontrado.' });
    try {
        const content = await readFile(root + name);
        res.writeHead(200, { 'Content-Type': types[name.split('.').pop()], 'X-Content-Type-Options': 'nosniff' });
        res.end(req.method === 'HEAD' ? undefined : content);
    } catch { reply(404, { error: 'No encontrado.' }); }
}).listen(port, process.env.HOST || '127.0.0.1', () => {
    console.log(`Vista previa disponible en ${publicOrigin}/activacion`);
});
