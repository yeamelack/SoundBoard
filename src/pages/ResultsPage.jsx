import '../App.css';
import "../styles/ResultsPage/Results.css";
import Header from "../components/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import Discography from "../components/artist profile/Discography.jsx";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AlbumResults from "../components/Results page/AlbumResults.jsx";




function ResultsPage() {
    const location = useLocation();
    const { query } = location.state || {};
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (query) {
        const fetchResults = async () => {
          try {
            const res = await fetch(`http://localhost:8484/result?q=${query}`);
            const data = await res.json();
            setResults(data);
          } catch (error) {
            console.error("Failed to fetch results:", error);
          } finally {
            setIsLoading(false);
          }
        };
  
        fetchResults();
      }
    }, [query]);
  
    return (
      <div>
        <Header />
        <div className="page-content">
          <div className="popular-tracks">Results for {query}</div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <AlbumResults discography={results} />
          )}
        </div>
      </div>
    );
  }
  
  export default ResultsPage;