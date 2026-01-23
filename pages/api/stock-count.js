// Simple in-memory cache for local development & fallback
let memoryCache = {
    data: null,
    timestamp: 0
};

export default async function handler(req, res) {
    // Google Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC8hgXKH7L9JJf2JpFvfDhrjyO00saKSEs3enX1ppC8RzkHn7PZnuBGmkhH7jhFJmwNg/exec';

    try {
        // 1. Set CDN Headers (For Production/Cloudflare)
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

        // 2. Check Memory Cache (For Localhost & Serverless warm reuse)
        const now = Date.now();
        const CACHE_DURATION = 3600 * 1000; // 1 hour locally

        if (memoryCache.data && (now - memoryCache.timestamp < CACHE_DURATION)) {
            return res.status(200).json(memoryCache.data);
        }

        // 3. Fetch Fresh Data
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();

        // Update memory cache
        memoryCache = {
            data,
            timestamp: now
        };

        res.status(200).json(data);
    } catch (error) {
        console.error('Stock Fetch Error:', error);
        // On error, return 500 but try to let client handle fallback
        res.status(500).json({ error: 'Failed to fetch stock count' });
    }
}
