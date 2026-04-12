import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const url = state?.url;
  const title = state?.title;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top bar */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h3 style={{ margin: "10px 0" }}>{title}</h3>
      </div>

      {/* Article */}
      {url ? (
        <iframe
          src={url}
          title="article"
          style={{ flex: 1, width: "100%", border: "none" }}
        />
      ) : (
        <p style={{ padding: 20 }}>No article found</p>
      )}
    </div>
  );
}

export default Article;
