import api from "../../api/api";

const TEMPLATES = [
  {
    id: "minimalist",
    label: "Minimalist",
    blurb: "Clean, whitespace-driven, resume-like.",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    blurb: "Neon, dark-mode, terminal-inspired.",
  },
  {
    id: "corporate",
    label: "Corporate",
    blurb: "Polished, card-based, recruiter-friendly.",
  },
];

export default function TemplateSelector({ profile, onSaved }) {
  const choose = async (id) => {
    const { data } = await api.put("/profile/me", { templateId: id });
    onSaved(data);
  };

  return (
    <div className="dashboard-form">
      <h2>Theme</h2>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`template-card ${profile.templateId === t.id ? "active" : ""}`}
            onClick={() => choose(t.id)}
          >
            <strong>{t.label}</strong>
            <span>{t.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
