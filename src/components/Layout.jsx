import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const links = [
  { key: "home", label: "Home", to: "/" },
  { key: "scanner", label: "Scanner", to: "/scanner" },
  { key: "admin", label: "Admin", to: "/admin" },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const { language, setLanguage, strings } = useContext(LanguageContext);

  return (
    <div className="min-h-screen bg-hospital-100 text-slate-900">
      <header className="border-b border-slate-200 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 text-white shadow-sm">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-200">{strings.siteName}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{strings.pageTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-100">{strings.homeSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              {links.map((link) => (
                <Link
                  key={link.key}
                  to={link.to}
                  className={`rounded-full px-4 py-2 transition ${location.pathname === link.to ? "bg-white text-brand-700" : "bg-white/20 text-white hover:bg-white/30"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm text-white shadow-none transition focus:border-white"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      <main className="container py-10">{children}</main>
      <footer className="border-t border-slate-200 bg-white/90 py-4 text-center text-sm text-slate-600">
        © 2026 PSG Hospitals Navigation. Designed for fast, senior-friendly wayfinding.
      </footer>
    </div>
  );
};

export default Layout;
