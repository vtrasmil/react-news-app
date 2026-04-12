import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Article.css";

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
    <div className="article-container">
      <div className="article-wrapper">

        <button
          className="article-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="article-title">{title}</div>

        {loading ? (
          <div className="article-loading">Loading article...</div>
        ) : (
          <div className="article-content">{content}</div>
        )}

      </div>
    </div>
  );
}

export default Article;
