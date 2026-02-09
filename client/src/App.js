import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout & Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard Pages
import SeekerDashboard from './pages/dashboard/SeekerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';

// Higher Order Component for Protected Routes
const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, role } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <main className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected Job Seeker Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRole="seeker">
                  <SeekerDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Employer Routes */}
            <Route 
              path="/recruitment-hub" 
              element={
                <ProtectedRoute allowedRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;