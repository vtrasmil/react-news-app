export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing GNEWS_API_KEY"
      });
    }

    // -----------------------------
    // BUILD GNEWS URL
    // -----------------------------
    const baseUrl = q
      ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}`
      : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

    const apiUrl = `${baseUrl}&lang=en&apikey=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // -----------------------------
    // SAFETY CHECK (CRITICAL)
    // -----------------------------
    if (!data || !Array.isArray(data.articles)) {
      return res.status(200).json({
        articles: [],
        totalArticles: 0,
        error: data?.message || "No articles returned"
      });
    }

    // -----------------------------
    // CLEAN BUT DO NOT OVERWRITE STRUCTURE
    // -----------------------------
    const cleanedArticles = data.articles.map((article) => ({
      title: cleanText(article.title),
      description: cleanText(article.description || ""),
      content: cleanText(article.content || ""),
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source
    }));

    return res.status(200).json({
      articles: cleanedArticles,
      totalArticles: data.totalArticles || cleanedArticles.length
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return res.status(500).json({
      articles: [],
      error: "Failed to fetch news"
    });
  }
}

// -----------------------------
// TEXT CLEANER
// -----------------------------
function cleanText(text = "") {
  return text
    .replace(/\[\+\d+\schars\]/g, "")
    .replace(/&nbsp;|&amp;|&#039;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;|&#39;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
