// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-black text-blue-600 mb-4">RecruitConnect</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        The modern platform for job seekers and employers to find the perfect match.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
          Get Started
        </Link>
        <Link to="/jobs" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
          Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default Home;