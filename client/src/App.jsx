import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

// Placeholder components for routing verification
const Home = () => <div className="page-container"><h1>Welcome to RecruitConnect</h1><p>Connecting the best talent with the best opportunities.</p></div>;
const LoginPlaceholder = () => <div className="page-container"><h1>Login Page Coming Soon</h1></div>;
const SignupPlaceholder = () => <div className="page-container"><h1>Signup Page Coming Soon</h1></div>;

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPlaceholder />} />
            <Route path="/signup" element={<SignupPlaceholder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
