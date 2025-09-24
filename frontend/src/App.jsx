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
        const errData = await response.json();
        throw new Error(errData.error || 'Something went wrong on the server.');
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
      <div className="container">
        <h1>AI Mood Playlist Generator</h1>
        <p className="description">Describe a mood, a vibe, or a scenario, and let AI curate a playlist for you.</p>
        <textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="e.g., 'Breakup up like me rn .😥'"
          rows="3"
        />
        <button onClick={getPlaylist} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Playlist'}
        </button>
        {error && <div className="error">Error: {error}</div>}
        {isLoading && <div className="loading">Creating your playlist...</div>}
        {playlist && (
          <div className="playlist">
            <h2>Your Playlist</h2>
            <div className="track-list">
              {playlist.map((track) => (
                <a key={track.id} href={track.spotifyUrl} target="_blank" rel="noopener noreferrer" className="track">
                  <img src={track.albumArt} alt={`Album art for ${track.title}`} />
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">{track.artist}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
