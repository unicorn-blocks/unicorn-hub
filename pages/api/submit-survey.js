import { submitSurveyResponse } from '../../lib/googleSheets';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const data = JSON.parse(req.body);
        const result = await submitSurveyResponse(data);

        if (result.ok) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: result.text || 'Unknown error' });
        }
    } catch (error) {
        console.error('Survey API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
