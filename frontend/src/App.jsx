import { useState } from 'react';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPlaylist = async () => {
    setIsLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const response = await fetch('http://localhost:3001/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong on the server.');
      }

      const data = await response.json();
      setPlaylist(data.playlist);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="App">
      <h1>AI Mood Playlist Generator</h1>
      <textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="How are you feeling? e.g., 'A rainy day, feeling nostalgic and calm'"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={getPlaylist} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Playlist'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</div>}

      {playlist && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Generated Playlist</h2>
          <pre>{JSON.stringify(playlist, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
