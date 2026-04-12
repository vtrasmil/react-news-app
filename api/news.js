export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q, url } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    // --------------------------------------------------
    // MODE 1: NEWS FEED
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
    // MODE 2: ARTICLE PREVIEW (SAFE VERSION)
    // --------------------------------------------------

    const response = await fetch(url);
    const html = await response.text();

    // VERY SAFE CLEANING (NO HEAVY SCRAPING)
    const content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3500); // preview only

    return res.status(200).json({
      url,
      content,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load article" });
  }
}
