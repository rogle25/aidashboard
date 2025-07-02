import React, { useState } from 'react';

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
  },
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
        body: JSON.stringify({ clientId }),
      });
      const result = await res.json();
      setMessage(result.message || 'Reminder sent!');
    } catch (error) {
      setMessage('Error sending reminder.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        📩 Missing Document Tracker
      </h1>

      {mockClients.map((client) => (
        <div
          key={client.id}
          className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
          <p>
            <strong>Missing:</strong> {client.missingDocs.join(', ')}
          </p>
          <p>
            <strong>Last Contact:</strong> {client.lastContact}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                client.status === 'Notified'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {client.status}
            </span>
          </p>

          <button
            onClick={() => sendReminder(client.id)}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reminder'}
          </button>
        </div>
      ))}

      {message && (
        <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>
      )}
    </div>
  );
}
