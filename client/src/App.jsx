import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* New Dashboard Routes */}
        <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;