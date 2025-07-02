// File path: /api/get-clients.js

export default async function handler(req, res) {
  const MONDAY_API_KEY = process.env.MONDAY_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0MDU3ODcwOSwiYWFpIjoxMSwidWlkIjozODQyMzU4MSwiaWFkIjoiMjAyMy0wMi0yOFQyMDo1NTowOC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NzQ2NzYwOSwicmduIjoidXNlMSJ9.jC6TbLUCj2Q3dqXl-obCWgMQxsdpuyrp2oIAjJ2U-vI';
  const BOARD_ID = 'YOUR_BOARD_ID_HERE';

  const query = `
    query {
      boards(ids: ${5504468905}) {
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
      missingDocs: extractValue(item.column_values, 'status9') || 'N/A',
      lastContact: extractValue(item.column_values, 'date79__1') || 'N/A',
      status: extractValue(item.column_values, 'mirror_11__1') || 'Unknown',
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
