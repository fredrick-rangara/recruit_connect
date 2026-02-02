import React, { useState } from "react";
import { Link } from "react-router-dom";
import { mockJobs } from "../data/mockJobs";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = mockJobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Explore Opportunities</h1>

      {/* Search Input */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by job title (e.g. 'Frontend')..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "12px",
            width: "80%",
            borderRadius: "25px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
      </div>

      {/* Job List Container */}
      <div style={{ display: "grid", gap: "20px" }}>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #eee",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2>{job.title}</h2>
            <p style={{ color: "#666" }}>
              {job.company} • {job.location}
            </p>
            <p style={{ fontWeight: "bold", color: "#2ecc71" }}>{job.salary}</p>
            <Link to={`/job/${job.id}`}>
              <button
                style={{
                  background: "#007bff",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View & Apply
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
