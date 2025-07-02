export default async function handler(req, res) {
  const MONDAY_API_KEY = process.env.MONDAY_API_KEY || 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0MDU3ODcwOSwiYWFpIjoxMSwidWlkIjozODQyMzU4MSwiaWFkIjoiMjAyMy0wMi0yOFQyMDo1NTowOC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NzQ2NzYwOSwicmduIjoidXNlMSJ9.jC6TbLUCj2Q3dqXl-obCWgMQxsdpuyrp2oIAjJ2U-vI';
  const BOARD_ID = 5504468905;

  const query = `
    query {
      boards(ids: ${BOARD_ID}) {
        items_page(limit: 300) {
          items {
            id
            name
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

    const clients = items.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients from Monday.com' });
  }
}
