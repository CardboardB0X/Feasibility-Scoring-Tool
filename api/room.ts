// Minimal type interface for Vercel serverless functions without requiring external packages
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

// In-memory store for serverless execution
const memoryStore = new Map<string, { code: string; encryptedPayload: string; updatedAt: string }>();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).json({ error: 'Room code required' });
      return;
    }
    const normalized = code.trim().toUpperCase();
    const record = memoryStore.get(normalized);
    if (!record) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    res.status(200).json(record);
    return;
  }

  if (req.method === 'POST') {
    const { code, encryptedPayload } = req.body || {};
    if (!code || !encryptedPayload) {
      res.status(400).json({ error: 'Invalid payload: code and encryptedPayload required' });
      return;
    }
    const normalized = code.trim().toUpperCase();
    const record = {
      code: normalized,
      encryptedPayload,
      updatedAt: new Date().toISOString()
    };
    memoryStore.set(normalized, record);
    res.status(200).json({ success: true, record });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
