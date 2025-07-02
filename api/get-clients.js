export default async function handler(req, res) {
  const MONDAY_API_KEY = process.env.MONDAY_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0MDU3ODcwOSwiYWFpIjoxMSwidWlkIjozODQyMzU4MSwiaWFkIjoiMjAyMy0wMi0yOFQyMDo1NTowOC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NzQ2NzYwOSwicmduIjoidXNlMSJ9.jC6TbLUCj2Q3dqXl-obCWgMQxsdpuyrp2oIAjJ2U-vI';
  const BOARD_ID = 5504468905; // Replace with your board ID

  const query = `
    query {
      boards(ids: ${BOARD_ID}) {
        items_page(limit: 300) {
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
    const items = data?.boards?.[0]?.items_page?.items || [];

    // Replace the column IDs or titles below with the correct ones from your board
    const clients = items.map((item) => ({
      id: item.id,
      name: item.name,
      missingDocs: extractValue(item.column_values, 'status9') || 'N/A',
      lastContact: extractValue(item.column_values, 'date79__1') || 'N/A',
      status: extractValue(item.column_values, 'mirror_11__1') || 'Unknown',
    }));

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients from Monday.com' });
  }
}

function extractValue(columns, idOrTitle) {
  const match = columns.find(
    (col) => col.id === idOrTitle || col.title?.toLowerCase() === idOrTitle.toLowerCase()
  );
  return match?.text || null;
}
