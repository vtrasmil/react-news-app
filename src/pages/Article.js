import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const url = state?.url;
  const title = state?.title;

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/news?url=${encodeURIComponent(url)}`
        );

        const data = await res.json();
        setContent(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) loadArticle();
  }, [url]);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "100px auto" }}>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        marginBottom: 15,
        padding: "8px 12px",
        borderRadius: 6,
        border: "none",
        background: "#333",
        color: "#fff"
      }}>
        ← Back
      </button>

      {/* Title */}
      <h2 style={{ marginBottom: 15, color: "#ffffff" }}>{title}</h2>

      {/* Content */}
      {loading ? (
        <p>Loading article...</p>
      ) : (
        <div style={{
          fontSize: "16px",
          lineHeight: "1.8",
          whiteSpace: "pre-wrap",
          color: "#ddd"
        }}>
          {content}
        </div>
      )}

      {/* FULL ARTICLE BUTTON */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "10px 16px",
            background: "#ff3b3b",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Read Full Article →
        </a>
      )}

    </div>
  );
}

export default Article;
