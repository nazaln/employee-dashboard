import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Users, LayoutDashboard, UserRoundPlus, Search, Bell, ChevronDown,
  ArrowUpRight, MapPin, BriefcaseBusiness, Wallet, Mail, Phone,
  Building2, CalendarDays, CircleUserRound, CheckCircle2, AlertCircle
} from 'lucide-react'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')

  useEffect(() => {
    const controller = new AbortController()
    fetch(API_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('The employee service could not be reached.')
        return response.json()
      })
      .then(data => setUsers(data))
      .catch(err => {
        if (err.name !== 'AbortError') setError('Could not load users. Check your internet connection and try again.')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const filteredUsers = useMemo(() => users.filter(user =>
    `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(search.toLowerCase())
  ), [users, search])

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Employee dashboard</h1>
          <p className="muted mb-0">A clear view of your people and their contact details.</p>
        </div>
        <div className="today-pill"><CalendarDays size={16} /> Team directory</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><Users size={21} /></div>
          <div className="stat-label">Directory users</div>
          <div className="stat-value">{loading ? '—' : users.length}</div>
          <div className="stat-foot"><span className="positive">Live data</span> from external API</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Mail size={21} /></div>
          <div className="stat-label">Visible email addresses</div>
          <div className="stat-value">{loading ? '—' : filteredUsers.length}</div>
          <div className="stat-foot">Based on your current search</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Building2 size={21} /></div>
          <div className="stat-label">Data source</div>
          <div className="stat-value source-value">JSONPlaceholder</div>
          <div className="stat-foot">Public demo API</div>
        </div>
      </div>

      <section className="content-panel">
        <div className="panel-header">
          <div>
            <h2>People directory</h2>
            <p className="muted mb-0">Users loaded from the JSONPlaceholder API</p>
          </div>
          <div className="view-switch" aria-label="Choose layout">
            <button className={view === 'table' ? 'selected' : ''} onClick={() => setView('table')}>Table</button>
            <button className={view === 'cards' ? 'selected' : ''} onClick={() => setView('cards')}>Cards</button>
          </div>
        </div>
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or ID..." aria-label="Search employees" />
          </div>
          <span className="result-count">{filteredUsers.length} results</span>
        </div>

        {loading && <div className="empty-state"><div className="spinner-border spinner-border-sm text-primary" role="status" /> <span>Loading directory...</span></div>}
        {error && <div className="alert alert-warning d-flex align-items-center gap-2"><AlertCircle size={18} />{error}</div>}
        {!loading && !error && filteredUsers.length === 0 && <div className="empty-state">No users match your search.</div>}

        {!loading && !error && filteredUsers.length > 0 && view === 'table' && (
          <div className="table-responsive">
            <table className="table people-table align-middle mb-0">
              <thead><tr><th>ID</th><th>EMPLOYEE</th><th>EMAIL ADDRESS</th><th>COMPANY</th><th>LOCATION</th></tr></thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td><span className="id-badge">#{String(user.id).padStart(3, '0')}</span></td>
                    <td><div className="person-cell"><div className={`avatar avatar-${(user.id % 5) + 1}`}>{initials(user.name)}</div><div><div className="person-name">{user.name}</div><div className="person-sub">Employee #{user.id}</div></div></div></td>
                    <td><a className="email-link" href={`mailto:${user.email}`}><Mail size={14} />{user.email}</a></td>
                    <td><span className="company-name">{user.company?.name || '—'}</span></td>
                    <td><span className="location-text"><MapPin size={14} />{user.address?.city || '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredUsers.length > 0 && view === 'cards' && (
          <div className="people-cards">
            {filteredUsers.map(user => (
              <article className="person-card" key={user.id}>
                <div className={`avatar avatar-${(user.id % 5) + 1} avatar-large`}>{initials(user.name)}</div>
                <div className="person-name mt-3">{user.name}</div>
                <div className="person-sub">Employee #{user.id}</div>
                <a className="email-link mt-3" href={`mailto:${user.email}`}><Mail size={14} />{user.email}</a>
                <div className="card-detail"><Building2 size={15} />{user.company?.name || '—'}</div>
                <div className="card-detail"><MapPin size={15} />{user.address?.city || '—'}</div>
              </article>
            ))}
          </div>
        )}
        <div className="panel-footer"><span>Showing {filteredUsers.length} of {users.length} users</span><span className="api-status"><span /> API connected when data loads</span></div>
      </section>
      <div className="note-line">Demo data is provided by JSONPlaceholder. The employee form is a frontend-only form for this assignment.</div>
    </>
  )
}

function EmployeeForm() {
  const [form, setForm] = useState({ name: '', designation: '', location: '', salary: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const update = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSubmitted(false)
    setErrors({ ...errors, [e.target.name]: '' })
  }
  const submit = e => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter the employee name.'
    if (!form.designation.trim()) nextErrors.designation = 'Enter a designation.'
    if (!form.location.trim()) nextErrors.location = 'Enter a location.'
    if (form.salary === '' || Number(form.salary) < 0) nextErrors.salary = 'Enter a valid salary.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <>
      <div className="page-heading">
        <div><div className="eyebrow">PEOPLE MANAGEMENT</div><h1>Employee form</h1><p className="muted mb-0">Enter employee details using the form below.</p></div>
        <div className="today-pill"><UserRoundPlus size={16} /> New employee</div>
      </div>
      <div className="form-layout">
        <section className="content-panel form-panel">
          <div className="panel-header"><div><h2>Employee details</h2><p className="muted mb-0">Fields marked with * are required.</p></div><div className="form-heading-icon"><CircleUserRound size={23} /></div></div>
          {submitted && <div className="alert alert-success d-flex gap-2 align-items-start"><CheckCircle2 size={19} /><div><strong>Form validated successfully.</strong><div>This assignment does not require submitting data to a backend. Your entered details remain on this page.</div></div></div>}
          <form onSubmit={submit} noValidate>
            <div className="row g-4">
              <div className="col-12"><label className="form-label" htmlFor="name">Full name *</label><div className="input-with-icon"><CircleUserRound size={17} /><input id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} name="name" value={form.name} onChange={update} placeholder="e.g. Alex Morgan" />{errors.name && <div className="invalid-feedback">{errors.name}</div>}</div></div>
              <div className="col-md-6"><label className="form-label" htmlFor="designation">Designation *</label><div className="input-with-icon"><BriefcaseBusiness size={17} /><input id="designation" className={`form-control ${errors.designation ? 'is-invalid' : ''}`} name="designation" value={form.designation} onChange={update} placeholder="e.g. Software Engineer" />{errors.designation && <div className="invalid-feedback">{errors.designation}</div>}</div></div>
              <div className="col-md-6"><label className="form-label" htmlFor="location">Location *</label><div className="input-with-icon"><MapPin size={17} /><input id="location" className={`form-control ${errors.location ? 'is-invalid' : ''}`} name="location" value={form.location} onChange={update} placeholder="e.g. Kochi, Kerala" />{errors.location && <div className="invalid-feedback">{errors.location}</div>}</div></div>
              <div className="col-12"><label className="form-label" htmlFor="salary">Salary (₹) *</label><div className="input-with-icon"><Wallet size={17} /><input id="salary" type="number" min="0" className={`form-control ${errors.salary ? 'is-invalid' : ''}`} name="salary" value={form.salary} onChange={update} placeholder="e.g. 45000" />{errors.salary && <div className="invalid-feedback">{errors.salary}</div>}</div><div className="form-text">Enter the salary as a number in Indian rupees.</div></div>
            </div>
            <div className="form-actions"><button type="button" className="btn btn-light border" onClick={() => { setForm({ name: '', designation: '', location: '', salary: '' }); setErrors({}); setSubmitted(false) }}>Clear form</button><button type="submit" className="btn btn-primary px-4">Validate details <ArrowUpRight size={16} /></button></div>
          </form>
        </section>
        <aside className="form-aside">
          <div className="aside-art"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><Users size={42} /></div>
          <h3>Build a stronger team</h3><p>Keep employee information consistent and easy to review. This form validates required fields on the frontend.</p>
          <div className="aside-rule" /><div className="aside-tip"><CheckCircle2 size={17} /><span>All four fields are required.</span></div><div className="aside-tip"><CheckCircle2 size={17} /><span>Salary must be zero or greater.</span></div><div className="aside-tip"><CheckCircle2 size={17} /><span>No backend submission is performed.</span></div>
        </aside>
      </div>
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isForm = location.pathname === '/employee-form'
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand"><div className="brand-mark"><Users size={21} /></div><span>People<span className="brand-accent">Desk</span></span></NavLink>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/" end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><LayoutDashboard size={18} /><span>Dashboard</span></NavLink>
          <NavLink to="/employee-form" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><UserRoundPlus size={18} /><span>Employee form</span><span className="nav-new">NEW</span></NavLink>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">?</div><strong>Need a hand?</strong><p>This demo dashboard uses a public API for its directory.</p><a href="https://jsonplaceholder.typicode.com/users" target="_blank" rel="noreferrer">View API <ArrowUpRight size={14} /></a></div><div className="profile-row"><div className="profile-avatar">PD</div><div className="profile-info"><strong>Admin User</strong><span>Workspace admin</span></div><ChevronDown size={16} /></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{isForm ? 'Employee form' : 'Dashboard'}</strong></div><div className="topbar-right"><span className="topbar-date"><CalendarDays size={15} /> Employee workspace</span><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><div className="topbar-user">PD</div></div></header>
        <div className="page-content"><Routes><Route path="/" element={<Dashboard />} /><Route path="/employee-form" element={<EmployeeForm />} /><Route path="*" element={<Dashboard />} /></Routes></div>
        <footer className="footer"><span>© 2026 PeopleDesk</span><span>Built with React · Bootstrap · React Router</span></footer>
      </main>
    </div>
  )
}