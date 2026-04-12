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

    if (data.articles) {
      data.articles = data.articles.map((article) => {
        return {
          ...article,

          title: cleanText(article.title),
          description: cleanText(article.description || ""),
          content: cleanText(article.content || ""),

          url: article.url,
          image: article.image,
          publishedAt: article.publishedAt,
          source: article.source,
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

// ---------------- CLEANER ----------------
function cleanText(text = "") {
  return text
    .replace(/\[\+\d+\schars\]/g, "")
    .replace(/&nbsp;|&amp;|&#039;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;|&#39;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
