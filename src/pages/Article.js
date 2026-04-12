import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No article found</h2>
        <button onClick={() => navigate(-1)}>Back</button>
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

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* IMAGE FIX */}
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

      <h1>{title}</h1>

      <p style={{ color: "#777" }}>
        {channel} • {published}
      </p>

      <p style={{ marginTop: 20, lineHeight: 1.6 }}>
        {content || description}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-block", marginTop: 20 }}
      >
        Read Full Article →
      </a>
    </div>
  );
}

export default Article;
