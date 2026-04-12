
export default async function handler(req, res) {
  const { country = "ph", category = "general", q } = req.query;

  const base = q
    ? `https://gnews.io/api/v4/search?q=${q}`
    : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}`;

  const url = `${base}&lang=en&apikey=${process.env.GNEWS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
