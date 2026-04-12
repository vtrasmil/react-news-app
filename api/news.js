export default async function handler(req, res) {
  try {
    const { country = "ph", category = "general", q, url } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    // --------------------------------------------------
    // MODE 1: NEWS FEED (unchanged)
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
    // MODE 2: CLEAN READER MODE
    // --------------------------------------------------

    const response = await fetch(url);
    let html = await response.text();

    // STEP 1: remove junk tags
    html = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "")
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // STEP 2: isolate body (important improvement)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      html = bodyMatch[1];
    }

    // STEP 3: strip all HTML tags
    let text = html.replace(/<[^>]*>/g, " ");

    // STEP 4: cleanup noise
    text = text
      .replace(/\s+/g, " ")
      .replace(/ADVERTISEMENT/gi, "")
      .replace(/Subscribe/gi, "")
      .replace(/Read More/gi, "")
      .replace(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}/gi, "") // removes JS blocks
      .trim();

    // STEP 5: limit size for performance
    text = text.slice(0, 6000);

    return res.status(200).json({
      url,
      content: text,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load article" });
  }
}
