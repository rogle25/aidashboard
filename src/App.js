import React, { useState } from 'react';
import './index.css';

const mockClients = [
  {
    id: 'client_001',
    name: 'Patricia Wilson',
    missingDocs: 'W-2',
    lastContact: '2025-06-25',
    status: 'Notified',
  },
  {
    id: 'client_002',
    name: 'James Lee',
    missingDocs: '1099-NEC, Bank Statement',
    lastContact: '2025-06-22',
    status: 'Pending',
  },
];

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function sendReminder(clientId) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('https://your-backend-api.com/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      setMessage(data.message || 'Reminder sent!');
    } catch (err) {
      setMessage('Failed to send reminder');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📧 Missing Document Tracker
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          {message}
        </div>
      )}

      {mockClients.map((client) => (
        <div key={client.id} className="bg-white shadow-md rounded p-4 mb-4 border">
          <h2 className="text-xl font-semibold">{client.name}</h2>
          <p><strong>Missing:</strong> {client.missingDocs}</p>
          <p><strong>Last Contact:</strong> {client.lastContact}</p>
          <p><strong>Status:</strong> {client.status}</p>
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => sendReminder(client.id)}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
