
// api/sendMessage.js
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
        const { token, chat_id, text, parse_mode } = req.method === 'GET' ? req.query : req.body;
        
        if (!token) {
            return res.status(400).json({ 
                ok: false, 
                error: 'Bot token is required' 
            });
        }

        if (!chat_id || !text) {
            return res.status(400).json({ 
                ok: false, 
                error: 'chat_id and text are required' 
            });
        }

        const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const payload = {
            chat_id: chat_id,
            text: text,
            parse_mode: parse_mode || 'HTML'
        };

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
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
        console.error('Error in sendMessage:', error);
        return res.status(500).json({ 
            ok: false, 
            error: 'Internal server error' 
        });
    }
}

