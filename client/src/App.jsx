import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './features/home/Home';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import Dashboard from './features/dashboard/Dashboard';
import DashboardHome from './features/dashboard/DashboardHome';
import Applications from './features/dashboard/Applications';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboard Nested Routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="applications" element={<Applications />} />
              <Route path="saved" element={<div><h2>Saved Jobs</h2></div>} />
              <Route path="messages" element={<div><h2>Messages</h2></div>} />
              <Route path="settings" element={<div><h2>Settings</h2></div>} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
