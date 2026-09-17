import '../styles/corporate.css';

export default function CorporateTemplate({ profile, projects = [], children }) {
  return (
    <div className="tpl-corporate">
      <header className="corp-header">
        <div className="corp-header-inner">
          {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} />}
          <div>
            <h1>{profile.name || 'Your Name'}</h1>
            <p>{profile.bio || 'A short professional summary goes here.'}</p>
            <div className="corp-links">
              {profile.socialLinks?.github && <a href={profile.socialLinks.github}>GitHub</a>}
              {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin}>LinkedIn</a>}
              {profile.resumeUrl && <a href={profile.resumeUrl}>Download Resume</a>}
            </div>
          </div>
        </div>
      </header>

      <main className="corp-main">
        <section className="corp-card">
          <h2>Experience Highlights</h2>
          <div className="corp-project-grid">
            {projects.map((p) => (
              <div key={p._id || p.title} className="corp-project-card">
                {p.screenshot && <img src={p.screenshot} alt={p.title} />}
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="corp-tags">
                  {(p.techStack || []).map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="corp-project-links">
                  {p.repoLink && <a href={p.repoLink}>Repository</a>}
                  {p.liveLink && <a href={p.liveLink}>Live Demo</a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="corp-card">
          <h2>Core Competencies</h2>
          <div className="corp-skill-columns">
            {['Frontend', 'Backend', 'DevOps', 'Design', 'Other'].map((cat) => {
              const items = (profile.skills || []).filter((s) => s.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <h4>{cat}</h4>
                  <ul>{items.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {children}
    </div>
  );
}
