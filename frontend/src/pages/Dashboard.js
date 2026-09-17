import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import ProfileForm from '../components/dashboard/ProfileForm';
import SkillsForm from '../components/dashboard/SkillsForm';
import ProjectForm from '../components/dashboard/ProjectForm';
import ProjectList from '../components/dashboard/ProjectList';
import TemplateSelector from '../components/dashboard/TemplateSelector';
import LivePreview from '../components/dashboard/LivePreview';

const TABS = ['Profile', 'Projects', 'Skills', 'Theme'];

export default function Dashboard() {
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Profile');
  const [projects, setProjects] = useState([]);
  const [liveFields, setLiveFields] = useState({});
  const [editingProject, setEditingProject] = useState(null);
  const [projectError, setProjectError] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      api.get('/projects')
        .then(({ data }) => setProjects(data))
        .catch((err) => setProjectError(err?.response?.data?.message || 'Could not load projects.'));
    }
  }, [user]);

  if (loading || !user) return <div className="page-loading">Loading...</div>;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <h1>CodeFolio Dashboard</h1>
          <p className="muted">
            Your public URL: <code>/{user.username}</code>{' '}
            <a href={`/${user.username}`} target="_blank" rel="noreferrer">view live &rarr;</a>
          </p>
        </div>
        <button type="button" onClick={() => { logout(); navigate('/'); }}>Log out</button>
      </header>

      <nav className="dashboard-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="dashboard-columns">
        <div className="dashboard-main">
          {tab === 'Profile' && (
            <ProfileForm
              profile={user}
              onSaved={refreshUser}
              onLiveChange={setLiveFields}
            />
          )}

          {tab === 'Projects' && (
            <>
              {projectError && <p className="server-error">{projectError}</p>}
              <ProjectForm
                project={editingProject}
                onSaved={(saved) => {
                  setProjects((prev) =>
                    editingProject
                      ? prev.map((p) => (p._id === saved._id ? saved : p))
                      : [...prev, saved]
                  );
                  setEditingProject(null);
                  setProjectError('');
                }}
                onCancel={() => setEditingProject(null)}
              />
              <ProjectList
                projects={projects}
                onEdit={(project) => setEditingProject(project)}
                onDeleted={(id) => setProjects((prev) => prev.filter((p) => p._id !== id))}
              />
            </>
          )}

          {tab === 'Skills' && <SkillsForm profile={user} onSaved={refreshUser} />}

          {tab === 'Theme' && <TemplateSelector profile={user} onSaved={refreshUser} />}
        </div>

        <aside className="dashboard-preview">
          <h3>Live preview</h3>
          <LivePreview profile={user} projects={projects} liveFields={liveFields} />
        </aside>
      </div>
    </div>
  );
}
