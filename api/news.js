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
    // MODE 2: ARTICLE READER MODE
    // --------------------------------------------------

    const response = await fetch(url);
    const html = await response.text();

    // STEP 1: extract paragraphs only
    const paragraphs = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/gi)];

    let content = paragraphs.map(p => p[1]).join(" ");

    // STEP 2: fallback if no paragraphs
    if (!content || content.length < 100) {
      content = html;
    }

    // STEP 3: remove all HTML tags
    content = content.replace(/<[^>]*>/g, " ");

    // STEP 4: remove known junk text
    content = content
      .replace(/We use cookies[^.]*\./gi, "")
      .replace(/accept our use of cookies[^.]*\./gi, "")
      .replace(/FIND OUT MORE/gi, "")
      .replace(/I AGREE/gi, "")
      .replace(/ADVERTISEMENT/gi, "")
      .replace(/Related Stories/gi, "")
      .replace(/Most Popular/gi, "")
      .replace(/More Videos/gi, "")
      .replace(/Tags:/gi, "")
      .replace(/Skip to main content/gi, "")
      .replace(/Skip to navigation/gi, "")
      .replace(/Make this your preferred source[^.]*\./gi, "")

      // STEP 5: fix CMS/template garbage (YOUR ISSUE)
      .replace(/\{\{[^}]*\}\}/g, "")
      .replace(/gallery\.[^ ]*/gi, "")
      .replace(/this\.[^ ]*/gi, "")

      // STEP 6: decode HTML entities
      .replace(/&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;|&nbsp;|&amp;|&#039;/g, " ")

      // STEP 7: final cleanup
      .replace(/\s+/g, " ")
      .trim();

    // STEP 8: limit size
    content = content.slice(0, 6000);

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
