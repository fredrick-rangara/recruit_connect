import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import JobDetails from './pages/JobDetails';
import JobList from './pages/Seeker/JobList'; // Added this
import Success from './pages/Success';
import Applications from './pages/Applications';

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
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#7c3aed', 
              secondary: '#fff',
            },
          },
        }} 
      />
      
      <ScrollToTop />
      <Navbar />
      
      <main className="content-wrapper">
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES
          ========================================== */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 1. Added the Job List Page */}
          <Route path="/jobs" element={<JobList />} />

          {/* 2. FIXED: Job Details (Standardized path) */}
          {/* We removed the broken redirect that was sending people to the literal string ":id" */}
          <Route path="/job/:id" element={<JobDetails />} />

          {/* ==========================================
              EMPLOYER ROUTES (Protected)
          ========================================== */}
          <Route path="/employer">
            <Route 
              path="dashboard" 
              element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="applications" 
              element={<ProtectedRoute allowedRole="employer"><Applications /></ProtectedRoute>} 
            />
            <Route 
              path="post-job" 
              element={<ProtectedRoute allowedRole="employer"><PostJob /></ProtectedRoute>} 
            />
            <Route 
              path="edit-job/:id" 
              element={<ProtectedRoute allowedRole="employer"><EditJob /></ProtectedRoute>} 
            />
            <Route 
              path="jobs/:jobId/applicants" 
              element={<ProtectedRoute allowedRole="employer"><JobApplicants /></ProtectedRoute>} 
            />
          </Route>

          {/* ==========================================
              SEEKER ROUTES (Protected)
          ========================================== */}
          <Route path="/seeker">
            <Route 
              path="dashboard" 
              element={<ProtectedRoute allowedRole="job_seeker"><SeekerDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="applications" 
              element={<ProtectedRoute allowedRole="job_seeker"><Applications /></ProtectedRoute>} 
            />
          </Route>

          {/* ==========================================
              FALLBACK & UTILITY
          ========================================== */}
          <Route 
            path="/applications" 
            element={<ProtectedRoute><Applications /></ProtectedRoute>} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;