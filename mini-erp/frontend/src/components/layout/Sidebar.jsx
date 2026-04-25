import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { RiDashboardLine, RiFolderLine, RiTaskLine, RiLogoutBoxLine } from 'react-icons/ri'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: <RiDashboardLine size={18} />, label: 'Dashboard' },
    { to: '/projects', icon: <RiFolderLine size={18} />, label: 'Projects' },
    { to: '/tasks', icon: <RiTaskLine size={18} />, label: 'Tasks' },
  ]

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>ERP System</h2>
        <p style={styles.logoSub}>Project Management</p>
      </div>

      <div style={styles.userCard}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? '#4f46e5' : 'transparent',
              color: isActive ? '#ffffff' : '#94a3b8',
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button style={styles.logout} onClick={handleLogout}>
        <RiLogoutBoxLine size={18} />
        <span>Logout</span>
      </button>
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'sticky',
    top: 0,
  },
  logo: {
    marginBottom: '32px',
    paddingLeft: '12px',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoSub: {
    color: '#64748b',
    fontSize: '11px',
    marginTop: '2px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#16213e',
    borderRadius: '8px',
    marginBottom: '32px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#4f46e5',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    flexShrink: 0,
  },
  userName: {
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
  },
  userRole: {
    color: '#64748b',
    fontSize: '11px',
    marginTop: '2px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logout: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#94a3b8',
    background: 'transparent',
    width: '100%',
    marginTop: '8px',
  }
}

export default Sidebar