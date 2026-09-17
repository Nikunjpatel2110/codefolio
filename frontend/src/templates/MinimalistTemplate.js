import "../styles/minimalist.css";

export default function MinimalistTemplate({
  profile,
  projects = [],
  children,
}) {
  const skillsByCategory = (profile.skills || []).reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s.name);
    return acc;
  }, {});

  return (
    <div className="tpl-minimalist">
      <header className="min-header">
        {profile.avatarUrl && (
          <img src={profile.avatarUrl} alt={profile.name} />
        )}
        <h1>{profile.name || "Your Name"}</h1>
        <p className="min-bio">{profile.bio || "A short bio goes here."}</p>
        <div className="min-links">
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github}>GitHub</a>
          )}
          {profile.socialLinks?.linkedin && (
            <a href={profile.socialLinks.linkedin}>LinkedIn</a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter}>Twitter</a>
          )}
          {profile.socialLinks?.website && (
            <a href={profile.socialLinks.website}>Website</a>
          )}
          {profile.resumeUrl && <a href={profile.resumeUrl}>Resume</a>}
        </div>
      </header>

      <section className="min-section">
        <h2>Projects</h2>
        <div className="min-projects">
          {projects.map((p) => (
            <article key={p._id || p.title} className="min-project">
              {p.screenshot && <img src={p.screenshot} alt={p.title} />}
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="min-tags">
                {(p.techStack || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="min-project-links">
                {p.repoLink && <a href={p.repoLink}>Code</a>}
                {p.liveLink && <a href={p.liveLink}>Live</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="min-section">
        <h2>Skills</h2>
        {Object.entries(skillsByCategory).map(([cat, items]) => (
          <div key={cat} className="min-skill-row">
            <strong>{cat}:</strong> {items.join(", ")}
          </div>
        ))}
      </section>

      {children}
    </div>
  );
}
