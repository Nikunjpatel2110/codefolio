import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/api";

export default function ProfileForm({ profile, onSaved, onLiveChange }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
      resumeUrl: profile.resumeUrl || "",
      avatarUrl: profile.avatarUrl || "",
      contactEmail: profile.contactEmail || "",
      github: profile.socialLinks?.github || "",
      linkedin: profile.socialLinks?.linkedin || "",
      twitter: profile.socialLinks?.twitter || "",
      website: profile.socialLinks?.website || "",
    },
  });

  const watched = watch();
  useEffect(() => {
    onLiveChange && onLiveChange(watched);
  }, [JSON.stringify(watched)]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      bio: data.bio,
      resumeUrl: data.resumeUrl,
      avatarUrl: data.avatarUrl,
      contactEmail: data.contactEmail,
      socialLinks: {
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        website: data.website,
      },
    };
    const { data: updated } = await api.put("/profile/me", payload);
    reset(data);
    onSaved(updated);
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Profile</h2>

      <label>Full name</label>
      <input {...register("name")} />

      <label>Bio ({280 - (watched.bio?.length || 0)} chars left)</label>
      <textarea rows={3} maxLength={280} {...register("bio")} />

      <label>Avatar URL</label>
      <input {...register("avatarUrl")} placeholder="https://..." />

      <label>Resume URL</label>
      <input {...register("resumeUrl")} placeholder="https://..." />

      <fieldset>
        <legend>Social links</legend>
        <input {...register("github")} placeholder="GitHub URL" />
        <input {...register("linkedin")} placeholder="LinkedIn URL" />
        <input {...register("twitter")} placeholder="Twitter/X URL" />
        <input {...register("website")} placeholder="Personal site URL" />
      </fieldset>

      <label>Contact form target email (never shown publicly)</label>
      <input {...register("contactEmail")} placeholder="you@realaddress.com" />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
