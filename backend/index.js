const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = process.env.PORT || 3001;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});


app.use(cors());
app.use(express.json());



const refreshSpotifyToken = async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('The access token has been refreshed!');
    spotifyApi.setAccessToken(data.body['access_token']);
    
    const expiresIn = data.body['expires_in'];
    setTimeout(refreshSpotifyToken, (expiresIn / 2) * 1000);
  } catch (err) {
    console.error('Could not refresh access token', err);
  }
};


app.post('/api/playlist', async (req, res) => {
  const { mood } = req.body;
  if (!mood) {
    return res.status(400).json({ error: 'Mood is required' });
  }

  try {
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Based on the mood "${mood}", generate a Spotify search query. Provide a JSON object with a "query" property. The query should be a short string of keywords, genres, or artists that would fit this mood. For example, for "upbeat and happy", you could return {"query": "happy pop dance"}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const geminiResult = JSON.parse(jsonString);
    const searchQuery = geminiResult.query;

    console.log('Gemini Query:', searchQuery);

    
    const spotifyResult = await spotifyApi.searchTracks(searchQuery, { limit: 20 });
    
    
    const tracks = spotifyResult.body.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      albumArt: track.album.images[0]?.url, 
      spotifyUrl: track.external_urls.spotify,
    }));

    res.json({ playlist: tracks });

  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).json({ error: 'Failed to generate playlist. Check server logs.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  refreshSpotifyToken();
});