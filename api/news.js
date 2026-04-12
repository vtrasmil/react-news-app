export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q, page = 1 } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    // Build GNews URL
    const baseUrl = q
      ? `https://gnews.io/api/v4/search?q=${q}`
      : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

    const url = `${baseUrl}&lang=en&page=${page}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // IMPORTANT: always return JSON
    res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);

    res.status(500).json({
      error: "Failed to fetch news",
    });
  }
}
