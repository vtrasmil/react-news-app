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
    const fetchArticle = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/news?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        setContent(data.html);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchArticle();
  }, [url]);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2 style={{ marginTop: 10 }}>{title}</h2>

      {loading ? (
        <p>Loading article...</p>
      ) : (
        <div
          style={{
            marginTop: 20,
            lineHeight: "1.6",
            fontSize: "16px",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

export default Article;
