import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockJobs } from "../data/mockJobs";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find((j) => j.id === parseInt(id));

  const [applied, setApplied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setApplied(true);
    setTimeout(() => navigate("/"), 3000); // Send them back home after 3 seconds
  };

  if (!job) return <h2>Job not found!</h2>;

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Jobs
      </button>

      <h1>{job.title}</h1>
      <h3>{job.company}</h3>
      <p>{job.description}</p>

      <hr style={{ margin: "40px 0" }} />

      {applied ? (
        <div
          style={{
            padding: "20px",
            background: "#d4edda",
            color: "#155724",
            borderRadius: "5px",
          }}
        >
          🎉 Success! Your application and resume have been submitted.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Apply for this position</h3>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Upload Resume (PDF only)
            </label>
            <input type="file" accept=".pdf" required />
          </div>
          <button
            type="submit"
            style={{
              background: "#28a745",
              color: "white",
              padding: "12px 25px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

export default JobDetails;
