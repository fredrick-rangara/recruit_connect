import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Ensure this exists
import JobBoard from './pages/JobBoard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<h1 className="text-center text-2xl font-bold">Home</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobBoard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;