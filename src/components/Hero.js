import React from "react";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="hero">
      <h1>Find Your Dream Scholarship</h1>
      <p>Search and discover scholarships tailored just for you.</p>
      <SearchBar />
    </section>
  );
};

export default Hero;