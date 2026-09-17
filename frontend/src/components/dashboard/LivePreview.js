import templateMap, { DefaultLayout } from "../../templates/templateMap";

export default function LivePreview({ profile, projects, liveFields }) {
  const merged = {
    ...profile,
    ...liveFields,
    socialLinks: {
      github: liveFields?.github ?? profile.socialLinks?.github,
      linkedin: liveFields?.linkedin ?? profile.socialLinks?.linkedin,
      twitter: liveFields?.twitter ?? profile.socialLinks?.twitter,
      website: liveFields?.website ?? profile.socialLinks?.website,
    },
  };

  const PortfolioLayout = templateMap[profile.templateId] || DefaultLayout;

  return (
    <div className="live-preview-frame">
      <div className="live-preview-scale">
        <PortfolioLayout profile={merged} projects={projects} isPreview />
      </div>
    </div>
  );
}
