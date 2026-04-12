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
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ marginBottom: 10 }}>
        ← Back
      </button>

      {/* Title */}
      <h2>{title}</h2>

      {/* Content */}
      {loading ? (
        <p>Loading article...</p>
      ) : (
        <div
          style={{
            marginTop: 20,
            fontSize: "18px",
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Article;
