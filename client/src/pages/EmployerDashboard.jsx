import React from "react";

/**
 * EmployerDashboard Component
 * This component allows employers to manage job listings and view
 * incoming applications through an Applicant Tracking System (ATS) interface.
 */
const EmployerDashboard = () => {
  // Mock data representing candidates who have applied for jobs
  const applicants = [
    {
      id: 101,
      name: "Alice Blue",
      job: "Frontend Developer",
      date: "2023-10-20",
    },
    {
      id: 102,
      name: "Bob Yellow",
      job: "UI/UX Designer",
      date: "2023-10-21",
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1>Employer Control Panel</h1>

      {/* Section for creating new job opportunities */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Post a Job</h2>
        <button style={{ padding: "10px 20px", cursor: "pointer" }}>
          + Create New Listing
        </button>
      </section>

      {/* Table displaying student/candidate applications */}
      <section>
        <h2>Submitted Applications (ATS)</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#333", color: "white" }}>
              <th style={{ padding: "10px" }}>Candidate Name</th>
              <th style={{ padding: "10px" }}>Role</th>
              <th style={{ padding: "10px" }}>Date Applied</th>
              <th style={{ padding: "10px" }}>Resume</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the applicants array to generate table rows dynamically */}
            {applicants.map((app) => (
              <tr
                key={app.id}
                style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}
              >
                <td style={{ padding: "10px" }}>{app.name}</td>
                <td style={{ padding: "10px" }}>{app.job}</td>
                <td style={{ padding: "10px" }}>{app.date}</td>
                <td style={{ padding: "10px" }}>
                  <button>Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default EmployerDashboard;
