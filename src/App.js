import { useState } from 'react';

const mockClients = [
  {
    id: 'client_001',
    name: 'Patricia Wilson',
    missingDocs: ['W-2'],
    lastContact: '2025-06-25',
    status: 'Notified',
  },
  {
    id: 'client_002',
    name: 'James Lee',
    missingDocs: ['1099-NEC', 'Bank Statement'],
    lastContact: '2025-06-22',
    status: 'Pending',
  }
];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendReminder = async (clientId) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('https://your-backend-api.com/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });
      await res.json();
      setMessage(`Reminder sent successfully to ${clientId}`);
    } catch (error) {
      console.error(error);
      setMessage('Error sending reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">📨 Missing Document Tracker</h1>
      {mockClients.map(client => (
        <div key={client.id} className="border p-4 rounded-xl shadow mb-4">
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p><strong>Missing:</strong> {client.missingDocs.join(', ')}</p>
          <p><strong>Last Contact:</strong> {client.lastContact}</p>
          <p><strong>Status:</strong> {client.status}</p>
          <button
            onClick={() => sendReminder(client.id)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      ))}
      {message && <div className="mt-4 text-green-700">{message}</div>}
    </div>
  );
}
