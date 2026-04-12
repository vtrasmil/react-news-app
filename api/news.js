export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q, url } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    // --------------------------------------------------
    // 🧠 MODE 1: normal news feed
    // --------------------------------------------------
    if (!url) {
      const baseUrl = q
        ? `https://gnews.io/api/v4/search?q=${q}`
        : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

      const apiUrl = `${baseUrl}&lang=en&apikey=${API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      return res.status(200).json(data);
    }

    // --------------------------------------------------
    // 🧠 MODE 2: article reader mode
    // --------------------------------------------------
    const articleResponse = await fetch(url);
    const html = await articleResponse.text();

    return res.status(200).json({
      url,
      html,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
}
