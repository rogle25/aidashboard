// File: /pages/api/get-clients.js

export default async function handler(req, res) {
  const MONDAY_API_KEY = process.env.MONDAY_API_KEY || 'YOUR_API_KEY'; // fallback for local dev
  const BOARD_ID = process.env.MONDAY_BOARD_ID || '5504468905'; // safer fallback

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
        Authorization: MONDAY_API_KEY,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    const items = data?.boards?.[0]?.items || [];

    const clients = items.map((item) => ({
      id: item.id,
      name: item.name,
      missingDocs: getColumnValue(item.column_values, 'status9'),       // 📝 Missing Docs
      lastContact: getColumnValue(item.column_values, 'date79__1'),     // 📅 Last Contact Date
      status: getColumnValue(item.column_values, 'mirror_11__1'),       // 📌 Status
    }));

    res.status(200).json(clients);
  } catch (error) {
    console.error('Monday API error:', error);
    res.status(500).json({ error: 'Failed to fetch clients from Monday.com' });
  }
}

function getColumnValue(columns, id) {
  const column = columns.find((col) => col.id === id);
  return column?.text || 'N/A';
}
