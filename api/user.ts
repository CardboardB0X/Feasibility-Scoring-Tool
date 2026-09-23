// Vercel serverless function for encrypted user profile persistence
interface IncomingMessage {
  method?: string;
  query: Record<string, string | string[]>;
  body: any;
}

interface ServerResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ServerResponse;
  json(body: any): void;
  end(): void;
}

const memoryStore = new Map<string, { key: string; payload: string; updatedAt: string }>();
const KV_BUCKET_ID = '6E3D8w8vW7Y2Z1p4N9qL5m';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const key = req.query.key as string;
    if (!key) {
      res.status(400).json({ error: 'User key required' });
      return;
    }

    // 1. Try KVDB
    try {
      const kvRes = await fetch(`https://kvdb.io/${KV_BUCKET_ID}/${key}`);
      if (kvRes.ok) {
        const text = await kvRes.text();
        if (text && text.trim().startsWith('{')) {
          res.status(200).json({ key, payload: text.trim() });
          return;
        }
      }
    } catch (e) {}

    // 2. Try in-memory store
    const record = memoryStore.get(key);
    if (record) {
      res.status(200).json(record);
      return;
    }

    res.status(404).json({ error: 'User record not found' });
    return;
  }

  if (req.method === 'POST') {
    const { key, payload } = req.body || {};
    if (!key || !payload) {
      res.status(400).json({ error: 'Invalid payload: key and payload required' });
      return;
    }

    const record = { key, payload, updatedAt: new Date().toISOString() };
    memoryStore.set(key, record);

    // Save to KVDB
    try {
      await fetch(`https://kvdb.io/${KV_BUCKET_ID}/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: payload
      });
    } catch (e) {}

    res.status(200).json({ success: true, record });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
