import { NavLink, Outlet } from 'react-router-dom';

const SeekerLayout = () => {
  return (
    <div className="dashboard-layout" style={{ backgroundColor: 'white' }}>
      <aside className="sidebar light">
        <h2 style={{ color: 'var(--figma-purple)', fontWeight: 'bold', marginBottom: '2.5rem' }}>RecruitConnect</h2>
        <nav>
          <NavLink to="/seeker/dashboard" className="nav-link">👤 My Profile</NavLink>
          <NavLink to="/" className="nav-item-light" style={{textDecoration:'none', color:'#666', display:'block', padding:'10px'}}>🔍 Search Jobs</NavLink>
          <NavLink to="/seeker/applications" className="nav-link">📂 My Applications</NavLink>
          <NavLink to="/seeker/messages" className="nav-link">💬 Messages</NavLink>
        </nav>
      </aside>
      <main className="main-viewport">
        <Outlet />
      </main>
    </div>
  );
};
export default SeekerLayout;