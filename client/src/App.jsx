import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages (Option B: Destination views)
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import JobDetails from './pages/JobDetails'; // Primary Job Details
import Success from './pages/Success';
import Applications from './pages/Applications';

// Features (Logic-heavy components)
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import JobList from './features/jobs/JobList'; // Corrected path from your screenshot

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
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            padding: '12px 20px',
          },
        }} 
      />
      
      <ScrollToTop />
      <Navbar />
      
      <main className="content-wrapper">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Job Search & Details */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetails />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/success" element={<Success />} />

          {/* Employer Routes */}
          <Route path="/employer">
            <Route path="dashboard" element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} />
            <Route path="post-job" element={<ProtectedRoute allowedRole="employer"><PostJob /></ProtectedRoute>} />
            <Route path="edit-job/:id" element={<ProtectedRoute allowedRole="employer"><EditJob /></ProtectedRoute>} />
            <Route path="jobs/:jobId/applicants" element={<ProtectedRoute allowedRole="employer"><JobApplicants /></ProtectedRoute>} />
            <Route path="applications" element={<ProtectedRoute allowedRole="employer"><Applications /></ProtectedRoute>} />
          </Route>

          {/* Seeker Routes */}
          <Route path="/seeker">
            <Route path="dashboard" element={<ProtectedRoute allowedRole="job_seeker"><SeekerDashboard /></ProtectedRoute>} />
            <Route path="applications" element={<ProtectedRoute allowedRole="job_seeker"><Applications /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;