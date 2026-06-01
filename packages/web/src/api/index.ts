import { Hono } from 'hono';
import { cors } from "hono/cors"

function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isInCidr(ip: string, cidr: string): boolean {
  try {
    const [base, bits] = cidr.split('/');
    const mask = ~((1 << (32 - parseInt(bits))) - 1) >>> 0;
    return (ipToNumber(ip) & mask) === (ipToNumber(base) & mask);
  } catch {
    return false;
  }
}

const CLIENT_SUBNETS = [
  '93.177.105.0/24', // Konnekteam clients
  '10.0.0.0/8',      // private class A
  '172.16.0.0/12',   // private class B
  '192.168.0.0/16',  // private class C
  '127.0.0.0/8',     // loopback
];

function isClientIp(ip: string): boolean {
  // strip IPv6-mapped IPv4 prefix
  const cleanIp = ip.replace(/^::ffff:/, '');
  return CLIENT_SUBNETS.some(cidr => isInCidr(cleanIp, cidr));
}

const app = new Hono()
  .basePath('api')
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true, exposeHeaders: ["set-auth-token"] }))
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200))
  .get('/check-client-ip', (c) => {
    const forwarded = c.req.header('x-forwarded-for');
    const realIp = c.req.header('x-real-ip');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : realIp) ?? '0.0.0.0';
    const client = isClientIp(ip);
    return c.json({ client, ip });
  });

export type AppType = typeof app;
export default app;
