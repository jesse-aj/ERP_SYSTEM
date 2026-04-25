import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../../api/tasks'
import { getProjects } from '../../api/projects'
import { useAuth } from '../../context/AuthContext'
import { RiAddLine, RiDeleteBinLine, RiTaskLine } from 'react-icons/ri'

const statusColors = {
  'Todo': { bg: '#f1f5f9', color: '#64748b' },
  'In Progress': { bg: '#fff7ed', color: '#f59e0b' },
  'Done': { bg: '#f0fdf4', color: '#10b981' },
}

const priorityColors = {
  'Low': { bg: '#f0fdf4', color: '#10b981' },
  'Medium': { bg: '#eff6ff', color: '#3b82f6' },
  'High': { bg: '#fef2f2', color: '#dc2626' },
}

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'Medium',
    dueDate: ''
  })
  const { user } = useAuth()

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        getTasks(),
        getProjects()
      ])
      setTasks(tasksRes.data)
      setProjects(projectsRes.data)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createTask(form)
      setForm({ title: '', description: '', project: '', priority: 'Medium', dueDate: '' })
      setShowForm(false)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status })
      fetchData()
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      fetchData()
    } catch (err) {
      console.error('Failed to delete task', err)
    }
  }

  const canCreate = ['Admin', 'Manager'].includes(user?.role)

  if (loading) return <div style={styles.loading}>Loading tasks...</div>

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>
          <p style={styles.subtitle}>{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
        </div>
        {canCreate && (
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>
            <RiAddLine size={16} />
            New Task
          </button>
        )}
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Create New Task</h3>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Task Title</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Project</label>
                <select
                  style={styles.input}
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, height: '70px', resize: 'vertical' }}
                placeholder="Task description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Priority</label>
                <select
                  style={styles.input}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Due Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div style={styles.formButtons}>
              <button type="submit" style={styles.button}>Create Task</button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowForm(false)}
              >Cancel</button>
            </div>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div style={styles.empty}>
          <RiTaskLine size={48} color="#cbd5e1" />
          <p>No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Task</th>
                <th style={styles.th}>Project</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} style={styles.tr}>
                  <td style={styles.td}>
                    <p style={styles.taskTitle}>{task.title}</p>
                    <p style={styles.taskDesc}>{task.description}</p>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.projectName}>
                      {task.project?.name || 'N/A'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: priorityColors[task.priority]?.bg,
                      color: priorityColors[task.priority]?.color,
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <select
                      style={{
                        ...styles.statusSelect,
                        background: statusColors[task.status]?.bg,
                        color: statusColors[task.status]?.color,
                      }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.dueDate}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {(user?.role === 'Admin' || user?.role === 'Manager') && (
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(task._id)}
                      >
                        <RiDeleteBinLine size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
  tableCard: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: '#f8f9fa',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #f1f5f9',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#1e293b',
    verticalAlign: 'middle',
  },
  taskTitle: {
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '2px',
  },
  taskDesc: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  projectName: {
    fontSize: '12px',
    color: '#64748b',
    background: '#f1f5f9',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  statusSelect: {
    border: 'none',
    borderRadius: '20px',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  dueDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  deleteBtn: {
    background: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  }
}

export default Tasks