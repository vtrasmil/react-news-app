export default async function handler(req, res) {
  try {
    const { url } = req.query;

    // --------------------------------------------------
    // MODE 1: normal news feed
    // --------------------------------------------------
    if (!url) {
      const { country = "ph", category = "general", q } = req.query;

      const API_KEY = process.env.GNEWS_API_KEY;

      const baseUrl = q
        ? `https://gnews.io/api/v4/search?q=${q}`
        : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

      const apiUrl = `${baseUrl}&lang=en&apikey=${API_KEY}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      return res.status(200).json(data);
    }

    // --------------------------------------------------
    // MODE 2: CLEAN ARTICLE TEXT MODE
    // --------------------------------------------------

    const response = await fetch(url);
    const html = await response.text();

    // Remove scripts/styles quickly (lightweight parsing)
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, " ")
      .replace(/\s\s+/g, " ")
      .trim();

    return res.status(200).json({
      url,
      content: text.slice(0, 8000), // prevent huge payload
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load article" });
  }
}
