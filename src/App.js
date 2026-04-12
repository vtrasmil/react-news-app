import React from "react";
import { v4 as uuidv4 } from "uuid";
import NavBar from "./components/NavBar/NavBar";
import News from "./components/News/News";
import Search from "./components/Search/Search";
import Article from "./pages/Article"; // ✅ NEW IMPORT

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { router } from "./config/config";

function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        {router.map((path) => (
          <Route
            key={uuidv4()}
            path={path.path}
            element={
              <News
                newscategory={path.category}
                country={path.country}
              />
            }
          />
        ))}

        {/* Search route */}
        <Route path="/search/:query" element={<Search />} />

        {/* Article route (NEW) */}
        <Route path="/article" element={<Article />} />
      </Routes>
    </Router>
  );
}

export default App;
