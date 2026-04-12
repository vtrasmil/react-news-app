import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import NavBar from "./components/NavBar/NavBar";
import News from "./components/News/News";
import Search from "./components/Search/Search";
import Article from "./pages/Article";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { router } from "./config/config";

function App() {
  // --------------------------------------------------
  // 🌍 USER COUNTRY STATE
  // --------------------------------------------------
  const [country, setCountry] = useState("ph"); // fallback

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const saved = localStorage.getItem("country");

        if (saved) {
          setCountry(saved);
          return;
        }

        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data?.country_code) {
          const code = data.country_code.toLowerCase();
          setCountry(code);
          localStorage.setItem("country", code);
        }
      } catch (err) {
        console.log("Geo detection failed, using PH fallback");
      }
    };

    detectCountry();
  }, []);

  return (
    <Router>
      <NavBar />

      <Routes>
        {/* NEWS ROUTES */}
        {router.map((path) => (
          <Route
            key={uuidv4()}
            path={path.path}
            element={
              <News
                newscategory={path.category}
                country={country}   // ✅ DYNAMIC COUNTRY
              />
            }
          />
        ))}

        {/* SEARCH */}
        <Route path="/search/:query" element={<Search />} />

        {/* ARTICLE PAGE */}
        <Route path="/article" element={<Article />} />
      </Routes>
    </Router>
  );
}

export default App;
