import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/jobsSlice';
import { fetchTalent } from '../store/usersSlice';
import JobCard from '../components/JobCard';
import TalentCard from '../components/TalentCard';

function Home() {
  const dispatch = useDispatch();
  const jobsState = useSelector((state) => state.jobs) || { list: [], status: 'idle' };
  const usersState = useSelector((state) => state.users) || { talentList: [], status: 'idle' };
  const { list: jobs, status: jobsStatus } = jobsState;
  const { talentList: talent, status: usersStatus } = usersState;

  const [searchType, setSearchType] = React.useState('jobs');
  const [query, setQuery] = React.useState('');
  const [locationQuery, setLocationQuery] = React.useState('');
  const [categoryQuery, setCategoryQuery] = React.useState('');

  const currentList = searchType === 'jobs' ? jobs : talent;
  const currentStatus = searchType === 'jobs' ? jobsStatus : usersStatus;

  useEffect(() => {
    dispatch(fetchJobs()).catch(err => console.error("Initial fetch failed:", err));
  }, [dispatch]);

  const handleSearch = () => {
    if (searchType === 'talent') {
      dispatch(fetchTalent(query));
    } else {
      const filters = {};
      if (query && query.trim()) filters.title = query;
      if (locationQuery && locationQuery.trim()) filters.location = locationQuery;
      if (categoryQuery && categoryQuery !== 'Select Category' && categoryQuery !== 'All Categories') filters.category = categoryQuery;
      
      dispatch(fetchJobs(filters));
    }
  };

  return (
    <div className="home-page">
      <header className="hero">
        <div className="container">
          <h1 style={{ marginBottom: '15px' }}>Find Your Dream Job Today!</h1>
          <p style={{ margin: '0 auto 40px', opacity: 0.9, maxWidth: '700px', fontSize: '1.2rem' }}>
            Connecting Talent with Opportunity: Your Gateway to Career Success.
          </p>
          
          <div className="advanced-search-bar">
            <div className="search-field">
              <span style={{ marginRight: '10px' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Job Title or Company" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="search-field">
              <span style={{ marginRight: '10px' }}>📍</span>
              <input 
                type="text" 
                placeholder="Select Location" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="search-field">
              <span style={{ marginRight: '10px' }}>📁</span>
              <select 
                value={categoryQuery} 
                onChange={(e) => setCategoryQuery(e.target.value)}
              >
                <option>All Categories</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Data Science</option>
                <option>Sales</option>
                <option>Customer Support</option>
              </select>
            </div>
            <button className="btn-search" onClick={handleSearch}>
              Search Job
            </button>
          </div>

          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>25,850</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Jobs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>10,250</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Candidates</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>18,400</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Companies</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="brand-bar">
        <div style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', opacity: 0.9 }}>slack</div>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', opacity: 0.9 }}>Adobe</div>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', opacity: 0.9 }}>asana</div>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '1.5rem', opacity: 0.9 }}>Linear</div>
      </div>

      <main className="container">
        <section style={{ padding: '60px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Recent Job Listings</h2>
              <p style={{ color: '#666', marginTop: '10px' }}>At eu lobortis pretium tincidunt amet lacus ut aenean aliquet...</p>
            </div>
            <span style={{ color: 'var(--primary-color)', fontWeight: '700', cursor: 'pointer', borderBottom: '2px solid' }}>View all</span>
          </div>
          
          {currentStatus === 'failed' && (
            <div style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>
              Oops! We couldn't fetch the results. Please make sure the backend is running.
            </div>
          )}

          <div className="job-list">
            {currentStatus === 'loading' ? (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <div className="spinner" style={{ borderColor: 'var(--primary-color)', borderTopColor: 'transparent', width: '40px', height: '40px', margin: '0 auto' }}></div>
              </div>
            ) : (
              Array.isArray(currentList) && currentList.length > 0 ? (
                currentList.map((item) => (
                  searchType === 'jobs' 
                    ? <JobCard key={item.id} job={item} />
                    : <TalentCard key={item.id} talent={item} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '100px', background: '#f9f9f9', borderRadius: '20px', color: '#666' }}>
                  No jobs found matching your criteria. Try adjusting your search!
                </div>
              )
            )}
          </div>

          <div style={{ marginTop: '80px', background: '#f5f5f5', padding: '40px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '50px' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '15px', fontSize: '2rem' }}>Ready for your next move?</h2>
              <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>Create your profile and let top employers find you. Join thousands of professionals growing their careers on RecruitConnect.</p>
              <button className="btn btn-primary" style={{ padding: '15px 40px', borderRadius: '12px' }}>Get Started Now</button>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img 
                src="/images/hero_purple.png" 
                alt="App Interface" 
                style={{ width: '400px', borderRadius: '10px' }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
