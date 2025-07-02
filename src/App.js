// Enhanced Missing Document Tracker with:
// - Lucide icons
// - Animated cards
// - Search and filter
// - Live backend hookup ready structure

import React, { useState } from 'react';
import { Search, Mail, Loader } from 'lucide-react';

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
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState('');

  const sendReminder = async (clientId) => {
    setLoadingId(clientId);
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
    setLoadingId(null);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.missingDocs.join(',').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="text-blue-600 w-8 h-8" />
        <h1 className="text-4xl font-bold">Missing Document Tracker</h1>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-white border rounded-lg px-4 py-2 shadow-sm">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or document..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {filteredClients.length === 0 ? (
        <p className="text-gray-500 text-center">No matching clients found.</p>
      ) : (
        filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 transition-transform hover:scale-[1.02]"
          >
            <h2 className="text-xl font-semibold mb-1">{client.name}</h2>
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
              disabled={loadingId === client.id}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loadingId === client.id ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>Send Reminder</>
              )}
            </button>
          </div>
        ))
      )}

      {message && (
        <div className="mt-6 text-center text-blue-600 font-medium animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
}
