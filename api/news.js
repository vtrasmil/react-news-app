export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    // --------------------------------------------------
    // MODE 1: NEWS FEED (NO SCRAPING ANYMORE)
    // --------------------------------------------------
    const baseUrl = q
      ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}`
      : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

    const apiUrl = `${baseUrl}&lang=en&apikey=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // --------------------------------------------------
    // CLEAN ARTICLES SAFELY (NO URL SCRAPING)
    // --------------------------------------------------
    if (data.articles) {
      data.articles = data.articles.map((article) => {
        return {
          ...article,

          // Use ONLY API-provided content (IMPORTANT FIX)
          content: cleanText(article.content),
          description: cleanText(article.description),
        };
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to load news"
    });
  }
}

// --------------------------------------------------
// CLEANER FUNCTION
// --------------------------------------------------
function cleanText(text = "") {
  return text
    .replace(/\[\+\d+\schars\]/g, "") // removes "[+1234 chars]"
    .replace(/&nbsp;|&amp;|&#039;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
