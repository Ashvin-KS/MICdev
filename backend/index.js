const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// A simple endpoint to check if the server is up
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// The main endpoint for generating playlists
app.post('/api/playlist', (req, res) => {
  const { mood } = req.body;
  console.log('Received mood:', mood);

  // For now, return a dummy playlist
  const dummyPlaylist = [
    { id: 1, title: 'Dummy Track 1', artist: 'Artist A' },
    { id: 2, title: 'Dummy Track 2', artist: 'Artist B' },
    { id: 3, title: 'Dummy Track 3', artist: 'Artist C' },
  ];

  res.json({ playlist: dummyPlaylist });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});