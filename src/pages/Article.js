import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    title,
    description,
    content,
    url,
    image,
    channel,
    published,
  } = state || {};

  const text =
    content ||
    description ||
    "No content available for this article.";

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>
        ← Back
      </button>

      {image && (
        <img src={image} alt="article" style={styles.image} />
      )}

      <h1 style={styles.title}>{title}</h1>

      <p style={styles.meta}>
        {channel} • {published}
      </p>

      <p style={styles.content}>
        {text}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        style={styles.link}
      >
        Read Full Article →
      </a>
    </div>
  );
}

export default Article;

// ---------------- STYLES ----------------
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "50px auto",
    color: "#fff",
    background: "#111",
    minHeight: "100vh",
  },
  back: {
    marginBottom: "20px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  meta: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "20px",
  },
  content: {
    fontSize: "16px",
    lineHeight: "1.6",
  },
  link: {
    display: "inline-block",
    marginTop: "20px",
    color: "#4da3ff",
  },
};
