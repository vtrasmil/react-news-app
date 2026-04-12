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
    // MODE 2: ARTICLE CLEAN READER MODE
    // --------------------------------------------------
    const response = await fetch(url);
    let html = await response.text();

    // STEP 1: Remove heavy unwanted blocks
    html = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // STEP 2: Try isolate main body
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];

    // STEP 3: Convert to text
    let content = html.replace(/<[^>]*>/g, " ");

    // STEP 4: Remove known junk phrases (your issue fix)
    content = content
      .replace(/ADVERTISEMENT/gi, "")
      .replace(/LOAD MORE ARTICLES/gi, "")
      .replace(/LOADING CONTENT/gi, "")
      .replace(/RETRY LOADING/gi, "")
      .replace(/LOAD MORE/gi, "")
      .replace(/CLICK HERE/gi, "")
      .replace(/READ MORE/gi, "")
      .replace(/SUBSCRIBE/gi, "")
      .replace(/NEXT ARTICLE/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // STEP 5: Limit size for performance
    content = content.slice(0, 5000);

    return res.status(200).json({
      url,
      content,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to load article"
    });
  }
}
