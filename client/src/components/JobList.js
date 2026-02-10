import { useEffect, useState } from 'react';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/jobs')
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company} - {job.location}</p>
        </div>
      ))}
    </div>
  );
}