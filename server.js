const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('Error: OpenAI API key is not set.');
    process.exit(1);
}

app.post('/generate-image', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: prompt,
                n: 1,
                size: '512x512', // Adjusted size for faster generation
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error('OpenAI API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate image.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
