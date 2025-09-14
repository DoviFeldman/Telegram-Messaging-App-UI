// api/getUpdates.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { token, offset, limit = 100 } = req.query;
        
        if (!token) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Bot token is required' 
            });
        }

        const telegramUrl = `https://api.telegram.org/bot${token}/getUpdates`;
        const params = new URLSearchParams({
            offset: offset || '',
            limit: limit.toString()
        });

        const response = await fetch(`${telegramUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({
                ok: false,
                error: data.description || 'Telegram API error'
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Error in getUpdates:', error);
        return res.status(500).json({ 
            ok: false, 
            error: 'Internal server error' 
        });
    }
}

