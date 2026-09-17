import { useState } from "react";
import api from "../../api/api";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Design", "Other"];

export default function SkillsForm({ profile, onSaved }) {
  const [skills, setSkills] = useState(profile.skills || []);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [saving, setSaving] = useState(false);

  const persist = async (next) => {
    setSaving(true);
    const { data } = await api.put("/profile/me", { skills: next });
    setSkills(data.skills);
    onSaved(data);
    setSaving(false);
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const next = [...skills, { category, name: name.trim() }];
    setName("");
    persist(next);
  };

  const removeSkill = (index) => {
    const next = skills.filter((_, i) => i !== index);
    persist(next);
  };

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: skills
      .map((s, i) => ({ ...s, i }))
      .filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0 || g.cat === category);

  return (
    <div className="dashboard-form">
      <h2>Skills</h2>

      <form className="skill-add-row" onSubmit={addSkill}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Docker, Figma"
        />
        <button type="submit" disabled={saving}>
          Add
        </button>
      </form>

      {grouped.map((g) => (
        <div key={g.cat} className="skill-group">
          <h4>{g.cat}</h4>
          <div className="skill-tags">
            {g.items.length === 0 && (
              <span className="muted">No skills yet</span>
            )}
            {g.items.map((s) => (
              <span key={s.i} className="skill-tag">
                {s.name}
                <button type="button" onClick={() => removeSkill(s.i)}>
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
