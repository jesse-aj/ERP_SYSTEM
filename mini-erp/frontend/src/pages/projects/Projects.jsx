import { useState, useEffect } from 'react'
import { getProjects, createProject, deleteProject } from '../../api/projects'
import { useAuth } from '../../context/AuthContext'
import { RiFolderAddLine, RiDeleteBinLine, RiFolderLine } from 'react-icons/ri'

const statusColors = {
  'Planning': { bg: '#eff6ff', color: '#3b82f6' },
  'In Progress': { bg: '#fff7ed', color: '#f59e0b' },
  'Completed': { bg: '#f0fdf4', color: '#10b981' },
}

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const { user } = useAuth()

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createProject(form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      fetchProjects()
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  const canCreate = ['Admin', 'Manager'].includes(user?.role)

  if (loading) return <div style={styles.loading}>Loading projects...</div>

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Projects</h1>
          <p style={styles.subtitle}>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {canCreate && (
          <button
            style={styles.button}
            onClick={() => setShowForm(!showForm)}
          >
            <RiFolderAddLine size={16} />
            New Project
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Create New Project</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Project Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                placeholder="Enter project description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div style={styles.formButtons}>
              <button type="submit" style={styles.button}>Create Project</button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div style={styles.empty}>
          <RiFolderLine size={48} color="#cbd5e1" />
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {projects.map((project) => (
            <div key={project._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <RiFolderLine size={20} color="#4f46e5" />
                </div>
                <span style={{
                  ...styles.badge,
                  background: statusColors[project.status]?.bg,
                  color: statusColors[project.status]?.color,
                }}>
                  {project.status}
                </span>
              </div>
              <h3 style={styles.cardTitle}>{project.name}</h3>
              <p style={styles.cardDesc}>{project.description || 'No description'}</p>
              <div style={styles.cardFooter}>
                <div style={styles.manager}>
                  <div style={styles.avatar}>
                    {project.manager?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={styles.managerName}>{project.manager?.name}</span>
                </div>
                <div style={styles.cardActions}>
                  <span style={styles.members}>
                    {project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}
                  </span>
                  {user?.role === 'Admin' && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(project._id)}
                    >
                      <RiDeleteBinLine size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#64748b',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
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
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#4f46e5',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  cancelButton: {
    padding: '10px 16px',
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '13px',
    border: '1px solid #fecaca',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#1e293b',
    background: '#f8f9fa',
    width: '100%',
  },
  formButtons: {
    display: 'flex',
    gap: '8px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px',
    color: '#94a3b8',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.5',
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  manager: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#4f46e5',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
  },
  managerName: {
    fontSize: '12px',
    color: '#64748b',
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  members: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  deleteBtn: {
    background: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  }
}

export default Projects