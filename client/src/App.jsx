import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";

function App() {
  return (
    <div className="App">
      {/* This Routes component manages which page shows up based on the URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
