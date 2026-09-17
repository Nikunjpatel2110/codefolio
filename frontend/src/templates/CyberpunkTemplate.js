import '../styles/cyberpunk.css';

export default function CyberpunkTemplate({ profile, projects = [], children }) {
  return (
    <div className="tpl-cyberpunk">
      <header className="cp-header">
        <div className="cp-scanline" />
        {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} />}
        <h1>&gt; {profile.name || 'unknown_dev'}</h1>
        <p className="cp-bio">// {profile.bio || 'no bio compiled yet'}</p>
        <div className="cp-links">
          {profile.socialLinks?.github && <a href={profile.socialLinks.github}>[github]</a>}
          {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin}>[linkedin]</a>}
          {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter}>[twitter]</a>}
          {profile.socialLinks?.website && <a href={profile.socialLinks.website}>[site]</a>}
          {profile.resumeUrl && <a href={profile.resumeUrl}>[resume.pdf]</a>}
        </div>
      </header>

      <section className="cp-section">
        <h2>/// PROJECTS</h2>
        <div className="cp-projects">
          {projects.map((p) => (
            <article key={p._id || p.title} className="cp-project">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="cp-tags">
                {(p.techStack || []).map((t) => <span key={t}>#{t}</span>)}
              </div>
              <div className="cp-project-links">
                {p.repoLink && <a href={p.repoLink}>git clone</a>}
                {p.liveLink && <a href={p.liveLink}>run_live</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cp-section">
        <h2>/// SKILL_TREE</h2>
        <div className="cp-skills">
          {(profile.skills || []).map((s) => (
            <span key={`${s.category}-${s.name}`} className="cp-skill">
              {s.category}::{s.name}
            </span>
          ))}
        </div>
      </section>

      {children}
    </div>
  );
}
