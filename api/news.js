const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    // -------------------------
    // CACHE KEY (important)
    // -------------------------
    const cacheKey = q
      ? `search:${q}`
      : `top:${country}:${category}`;

    const cached = cache.get(cacheKey);

    // return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.status(200).json(cached.data);
    }

    // -------------------------
    // BUILD URL SAFELY
    // -------------------------
    const base = "https://gnews.io/api/v4";
    const url = q
      ? `${base}/search?q=${encodeURIComponent(q)}&lang=en&apikey=${API_KEY}`
      : `${base}/top-headlines?country=${country}&category=${category}&lang=en&apikey=${API_KEY}`;

    // -------------------------
    // FETCH WITH TIMEOUT
    // -------------------------
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s max

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`GNews error: ${response.status}`);
    }

    const data = await response.json();

    const result = {
      articles: data.articles || [],
      totalArticles: data.totalArticles || 0,
    };

    // -------------------------
    // SAVE TO CACHE
    // -------------------------
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      articles: [],
      error: "Server error",
    });
  }
}
