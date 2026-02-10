import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import Dashboard from './pages/Dashboard';
import JobDetails from './pages/JobDetails';

// Temporary placeholder for the seeker's application list
const MyApplications = () => (
  <div className="text-center py-20">
    <h2 className="text-3xl font-bold text-gray-800">My Applications</h2>
    <p className="text-gray-500 mt-4">You haven't applied to any jobs yet. Start browsing!</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar /> 
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Added this to fix the "No routes matched" error */}
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;