import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { RfpsPage } from "./pages/RfpsPage";
import { VendorsPage } from "./pages/VendorsPage";
import { EmailsPage } from "./pages/EmailsPage";
import { ProposalsPage } from "./pages/ProposalsPage";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/rfps", label: "RFPs" },
  { to: "/vendors", label: "Vendors" },
  { to: "/emails", label: "Emails" },
  { to: "/proposals", label: "Proposals" },
];

function App() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            Procurement Hub
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm font-semibold text-slate-700 sm:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={[
                    "rounded-full px-3 py-1 transition",
                    active
                      ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
                      : "hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path='/' element={<DashboardPage />}/>
          <Route path='/rfps' element={<RfpsPage />}/>
          <Route path='/vendors' element={ <VendorsPage/>} />
          <Route path='/emails' element={<EmailsPage /> }/>
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
