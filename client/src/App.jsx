import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import JobDetails from './pages/JobDetails';

// Auth Components
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';

// Employer Features
import EmployerDashboard from './features/employer/EmployerDashboard';
import PostJob from './features/employer/PostJob';
import EditJob from './features/employer/EditJob';
import JobApplicants from './features/employer/JobApplicants';

// Seeker Features
import SeekerDashboard from './features/seeker/SeekerDashboard';

// --- UTILITY: Scroll To Top on Route Change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- WRAPPER: Protected Routes ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Ensures users start at the top of the Job Details page */}
      <Navbar />
      
      <main className="content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Employer Protected Routes */}
          <Route 
            path="/employer/dashboard" 
            element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/employer/post-job" 
            element={<ProtectedRoute allowedRole="employer"><PostJob /></ProtectedRoute>} 
          />
          <Route 
            path="/employer/edit-job/:id" 
            element={<ProtectedRoute allowedRole="employer"><EditJob /></ProtectedRoute>} 
          />
          <Route 
            path="/employer/jobs/:jobId/applicants" 
            element={<ProtectedRoute allowedRole="employer"><JobApplicants /></ProtectedRoute>} 
          />

          {/* Seeker Protected Routes */}
          <Route 
            path="/seeker/dashboard" 
            element={<ProtectedRoute allowedRole="job_seeker"><SeekerDashboard /></ProtectedRoute>} 
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;