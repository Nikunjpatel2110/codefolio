import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../api/api";
import templateMap, { DefaultLayout } from "../templates/templateMap";
import ContactForm from "../components/ContactForm";

export default function PublicPortfolio() {
  const { username } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: null,
    profile: null,
    projects: [],
  });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, profile: null, projects: [] });

    api
      .get(`/public/${username}`)
      .then(({ data }) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            profile: data.profile,
            projects: data.projects,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: err?.response?.data?.message || "Portfolio not found.",
            profile: null,
            projects: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (state.loading)
    return <div className="page-loading">Loading portfolio...</div>;

  if (state.error) {
    return (
      <div className="page-loading">
        <Helmet>
          <title>Portfolio not found - CodeFolio</title>
        </Helmet>
        <p>{state.error}</p>
      </div>
    );
  }

  const { profile, projects } = state;
  const PortfolioLayout = templateMap[profile.templateId] || DefaultLayout;
  const seoTitle = `${profile.name || username} \u2013 Developer Portfolio`;
  const seoDescription =
    profile.bio ||
    `${profile.name || username}'s developer portfolio, built with CodeFolio.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {profile.avatarUrl && (
          <meta property="og:image" content={profile.avatarUrl} />
        )}
      </Helmet>

      <PortfolioLayout profile={profile} projects={projects}>
        {profile.contactEnabled && <ContactForm username={username} />}
        {profile.isPro && <div className="pro-badge">PRO</div>}
      </PortfolioLayout>
    </>
  );
}
