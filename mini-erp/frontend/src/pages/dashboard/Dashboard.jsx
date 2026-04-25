import { useState, useEffect } from 'react'
import { getDashboardStats } from '../../api/dashboard'
import { RiFolderLine, RiTaskLine, RiCheckboxCircleLine, RiTimeLine, RiLoader4Line, RiTeamLine } from 'react-icons/ri'

const StatCard = ({ icon, label, value, color }) => (
  <div style={styles.card}>
    <div style={{ ...styles.iconBox, background: color + '15', color }}>
      {icon}
    </div>
    <div>
      <p style={styles.cardLabel}>{label}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Welcome back! Here's what's happening.</p>
      </div>

      <div style={styles.grid}>
        <StatCard
          icon={<RiFolderLine size={22} />}
          label="Total Projects"
          value={stats?.totalProjects || 0}
          color="#4f46e5"
        />
        <StatCard
          icon={<RiTaskLine size={22} />}
          label="Total Tasks"
          value={stats?.totalTasks || 0}
          color="#0ea5e9"
        />
        <StatCard
          icon={<RiCheckboxCircleLine size={22} />}
          label="Completed Tasks"
          value={stats?.completedTasks || 0}
          color="#10b981"
        />
        <StatCard
          icon={<RiTimeLine size={22} />}
          label="Pending Tasks"
          value={stats?.pendingTasks || 0}
          color="#f59e0b"
        />
        <StatCard
          icon={<RiLoader4Line size={22} />}
          label="In Progress"
          value={stats?.inProgressTasks || 0}
          color="#8b5cf6"
        />
        <StatCard
          icon={<RiTeamLine size={22} />}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="#ec4899"
        />
      </div>
    </div>
  )
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#64748b',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
  },
}

export default Dashboard