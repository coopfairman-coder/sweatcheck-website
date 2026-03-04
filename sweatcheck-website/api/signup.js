// Vercel Serverless Function — SweatCheck Waitlist Signup
// Writes to Notion database: SweatCheck Waitlist Signups

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = '55f99ed20e9f4af1905503a322d2213d';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://sweatcheck.fit');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, source } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const sourceMap = {
    'h-ok': 'Hero',
    'og-ok': 'OG Badge',
    'f-ok': 'Footer',
  };

  const isOGBadge = source === 'og-ok';

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties: {
          Name: {
            title: [{ text: { content: name || email.split('@')[0] } }],
          },
          Email: { email },
          Source: { select: { name: sourceMap[source] || 'Hero' } },
          'Signed Up': { date: { start: new Date().toISOString() } },
          'OG Badge': { checkbox: isOGBadge },
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Notion error:', err);
      return res.status(500).json({ error: 'Failed to save signup' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
