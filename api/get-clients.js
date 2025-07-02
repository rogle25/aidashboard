// File path: /api/get-clients.js

export default async function handler(req, res) {
  const MONDAY_API_KEY = process.env.MONDAY_API_KEY || 'YOUR_API_KEY_HERE';
  const BOARD_ID = 'YOUR_BOARD_ID_HERE';

  const query = `
    query {
      boards(ids: ${BOARD_ID}) {
        items {
          id
          name
          column_values {
            id
            title
            text
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    const items = data?.boards?.[0]?.items || [];

    // Placeholder mapping - update keys to match your board
    const clients = items.map((item) => ({
      id: item.id,
      name: item.name,
      missingDocs: extractValue(item.column_values, 'missing_docs') || 'N/A',
      lastContact: extractValue(item.column_values, 'last_contact') || 'N/A',
      status: extractValue(item.column_values, 'status') || 'Unknown',
    }));

    res.status(200).json(clients);
  } catch (error) {
    console.error('Monday API error:', error);
    res.status(500).json({ error: 'Failed to fetch clients from Monday.com' });
  }
}

function extractValue(columns, idOrTitle) {
  const match = columns.find(
    (col) => col.id === idOrTitle || col.title.toLowerCase() === idOrTitle.toLowerCase()
  );
  return match?.text || null;
}

// 👇 Notes:
// - Replace 'YOUR_API_KEY_HERE' with your actual API key
// - Replace 'YOUR_BOARD_ID_HERE' with your Monday.com board ID
// - Update 'missing_docs', 'last_contact', 'status' with your real column IDs or names
// - Secure your key with Vercel environment variable: MONDAY_API_KEY
