import { useState } from 'react';

/**
 * Reusable hook for calling AI endpoints
 * @param {string} endpoint - The AI endpoint to call (e.g., 'generate-description')
 */
export function useAI(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'AI request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error(`AI Error (${endpoint}):`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
}
