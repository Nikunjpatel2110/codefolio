import { useState } from 'react';
import api from '../../api/api';

export default function ProjectList({ projects, onDeleted, onEdit }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;

    setError('');
    setBusyId(id);
    try {
      await api.delete(`/projects/${id}`);
      onDeleted(id);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete project.');
    } finally {
      setBusyId(null);
    }
  };

  if (!projects.length) {
    return <p className="muted">No projects yet - add your first one above.</p>;
  }

  return (
    <>
      {error && <p className="server-error">{error}</p>}
      <ul className="project-list">
        {projects.map((p) => (
          <li key={p._id}>
            <div className="project-list-content">
              <strong>{p.title}</strong>
              <p>{p.description}</p>
              <span className="muted">{(p.techStack || []).join(' · ')}</span>
            </div>

            <div className="project-actions">
              <button type="button" onClick={() => onEdit(p)} disabled={busyId === p._id}>
                Edit
              </button>
              <button type="button" onClick={() => remove(p._id)} disabled={busyId === p._id}>
                {busyId === p._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
