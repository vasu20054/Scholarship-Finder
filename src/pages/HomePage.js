// frontend/src/pages/HomePage.js

import React from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero"; // Hero component is now correctly imported and used once
import ScholarshipList from "./ScholarshipList"; // ScholarshipList is in src/pages
import "../App.css"; // Global styles

function HomePage() {
  const [searchParams] = useSearchParams(); // Hook to get search parameters from URL
  const searchTermFromURL = searchParams.get("q") || ""; // Extracts 'q' parameter for search term

  return (
    <>
      {/* The Hero component encapsulates the main title, description, and the search bar */}
      <Hero />

      {/* ScholarshipList is displayed below the hero section, filtering by the search term from the URL */}
      <ScholarshipList searchTerm={searchTermFromURL} />
    </>
  );
}

export default HomePage;