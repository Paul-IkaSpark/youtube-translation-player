const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());

// Serve index.html from root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/proxy-audio', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send('URL parameter is required');
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Set appropriate headers
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Pipe the response
        response.body.pipe(res);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send(`Error fetching audio: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
