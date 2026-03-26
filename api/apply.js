// /api/apply.js — Vercel Serverless Function
// Receives ambassador application form submissions and creates Notion database entries.

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_DB_ID = '32f93758-2d9d-81b1-bff2-e92749dc169e';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, instagram, tiktok, email, phone, whyJoin } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) {
    console.error('NOTION_API_KEY environment variable not set');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const body = {
    parent: { database_id: NOTION_DB_ID },
    properties: {
      Name: {
        title: [{ text: { content: name } }]
      },
      Instagram: {
        rich_text: [{ text: { content: instagram || '' } }]
      },
      TikTok: {
        rich_text: [{ text: { content: tiktok || '' } }]
      },
      Email: {
        email: email
      },
      Phone: {
        phone_number: phone || null
      },
      'Why Join': {
        rich_text: [{ text: { content: whyJoin || '' } }]
      },
      'Submitted At': {
        date: { start: new Date().toISOString() }
      }
    }
  };

  try {
    const response = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Notion API error:', err);
      return res.status(500).json({ error: 'Failed to save application.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
