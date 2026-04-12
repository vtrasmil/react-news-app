export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    const baseUrl = q
      ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}`
      : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

    const apiUrl = `${baseUrl}&lang=en&apikey=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // --------------------------------------------------
    // NORMALIZE ARTICLES (CRITICAL FIX)
    // --------------------------------------------------
    if (data.articles) {
      data.articles = data.articles.map((article) => {
        const safeText =
          article.description ||
          article.content ||
          article.title ||
          "No preview available";

        return {
          ...article,

          description: cleanText(safeText),

          content: cleanText(article.content || article.description || ""),
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
    .replace(/\[\+\d+\schars\]/g, "")
    .replace(/&nbsp;|&amp;|&#039;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
