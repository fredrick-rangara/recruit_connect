/**
 * Main Application Component
 * 
 * Handles core routing logic for both Job Seekers and Employers.
 * Uses nested routes for dashboard management and protected workspaces.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './features/home/Home';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import Applications from './features/dashboard/Applications';
import ProfileSettings from './features/dashboard/ProfileSettings';
import EmployerDashboard from './features/employer/EmployerDashboard';
import EmployerHome from './features/employer/EmployerHome';
import ManageJobs from './features/employer/ManageJobs';
import PostJob from './features/employer/PostJob';
import ATSView from './features/employer/ATSView';
import JobBoard from './features/jobs/JobBoard';
import JobDetails from './features/jobs/JobDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Dashboard Nested Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<div className="settings-card"><h2>Saved Jobs</h2><p>You haven't saved any jobs yet.</p></div>} />
              <Route path="messages" element={<div className="settings-card"><h2>Messages</h2><p>Your inbox is empty.</p></div>} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            {/* Employer Workspace Nested Routes */}
            <Route path="/employer" element={<EmployerDashboard />}>
              <Route index element={<EmployerHome />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="candidates" element={<ATSView />} />
              <Route path="settings" element={<div><h1>Company Settings</h1></div>} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
