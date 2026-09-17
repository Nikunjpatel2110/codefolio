import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicPortfolio from "./pages/PublicPortfolio";
import "./styles/app.css";

function Landing() {
  return (
    <div className="landing">
      <h1>CodeFolio</h1>
      <p>
        Linktree on steroids, for engineers. Ship a portfolio, not a
        side-project.
      </p>
      <div className="landing-cta">
        <Link to="/register">Get started</Link>
        <Link to="/login">Log in</Link>
      </div>
      <p className="muted">
        See it in action: <Link to="/demo1">/demo1</Link> (Minimalist) &middot;{" "}
        <Link to="/demo2">/demo2</Link> (Cyberpunk) &middot;{" "}
        <Link to="/demo3">/demo3</Link> (Corporate);
      </p>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Catch-all vanity URL route: codefolio.com/:username */}
            <Route path="/:username" element={<PublicPortfolio />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
