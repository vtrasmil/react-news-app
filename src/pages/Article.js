import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No article found</h2>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const {
    title,
    description,
    content,
    imageUrl,
    url,
    channel,
    published,
  } = state;

  // -----------------------------
  // CLEAN GNEWS TEXT
  // -----------------------------
  const cleanText = (text) => {
    if (!text) return "";

    return text
      // removes [1868 chars], [+1868 chars], etc.
      .replace(/\[\+?\d+\s*chars\]/gi, "")
      
      // removes "... 1868 chars" style endings
      .replace(/\.\.\.\s*\d+\s*chars/gi, "")
      
      // removes accidental CTA text
      .replace(/read full article\s*→?/gi, "")
      
      // normalize whitespace
      .replace(/\s+/g, " ")
      .trim();
  };

  // Prefer description (more stable than content)
  const getArticleText = () => {
    const raw = description || content || "";
    return cleanText(raw);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "100px auto" }}>
      {/* BACK BUTTON */}
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* IMAGE */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: "100%",
            borderRadius: 10,
            marginTop: 15,
            marginBottom: 15,
          }}
        />
      )}

      {/* TITLE */}
      <h1 style={{ marginTop: 10, color: "#ffffff" }}>{title}</h1>
      {/* META */}
      <p style={{ color: "#777", fontSize: 14 }}>
        {channel} • {published}
      </p>

      {/* CONTENT */}
      <p style={{ marginTop: 20, lineHeight: 1.6, color: "#777"}}>
        {getArticleText()}
      </p>

      {/* LINK */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: 20,
          color: "#0066cc",
        }}
      >
        Read Full Article →
      </a>
    </div>
  );
}

export default Article;
