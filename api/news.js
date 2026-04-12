export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    let url;

    if (q) {
      url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&apikey=${API_KEY}`;
    } else {
      url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&lang=en&apikey=${API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      articles: data.articles || [],
      totalArticles: data.totalArticles || 0,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      articles: [],
      error: "Server error"
    });
  }
}
