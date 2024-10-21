'use client';

import { useState } from 'react';

export default function TestPage() {
  const [id, setId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items?id=${id}`);
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        setError(null);
      } else {
        setError(data.message || 'An error occurred');
        setResult(null);
      }
    } catch (err) {
      setError('Failed to fetch item');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Test DynamoDB API</h1>
      <input 
        type="text" 
        value={id} 
        onChange={(e) => setId(e.target.value)} 
        placeholder="Enter item ID"
      />
      <button onClick={fetchItem}>Fetch Item</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}