import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import JobDetails from "./JobDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import PostJob from './components/PostJob';
import SeekerDashboard from './components/SeekerDashboard';
import EmployerDashboard from './components/EmployerDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        {/* OPEN TO EVERYONE */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* PROTECTED ROUTES (Requires Login) */}
        <Route element={<ProtectedRoute />}>
          {/* Seeker Path */}
          <Route path="/applications" element={<SeekerDashboard />} />
          
          {/* Employer Paths */}
          <Route path="/dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;