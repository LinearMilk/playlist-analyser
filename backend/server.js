import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5005;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

app.get('/playlist', async (req, res) => {
    const { playlistId, accessToken } = req.query;
    if (!playlistId || !accessToken) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
        const response = await axios.get(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));