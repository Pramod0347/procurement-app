import { Link } from "react-router-dom";

const navCards = [
  {
    title: "Requests for proposals",
    description: "Create, publish, and track active RFPs in one place.",
    href: "/rfps",
    action: "Open RFPs",
    icon: "📑",
  },
  {
    title: "Vendors",
    description: "Keep your supplier directory tidy and invite new vendors.",
    href: "/vendors",
    action: "Open vendors",
    icon: "🤝",
  },
  {
    title: "Proposals",
    description: "Review submissions and shortlist vendors with context.",
    href: "/proposals",
    action: "View proposals",
    icon: "📬",
  },
  {
    title: "Emails",
    description: "See vendor replies that were routed to your inbox.",
    href: "/emails",
    action: "Open emails",
    icon: "✉️",
  },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:gap-6">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-6 text-white shadow-md sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-200">Workspace</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">Keep procurement clear and moving</h1>
            <p className="mt-3 max-w-2xl text-sm text-indigo-100">
              Jump straight into the work that’s live today—RFPs and vendors. Everything else stays out of
              the way until it’s ready.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                to="/rfps"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Open RFPs
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-inset ring-white/30 transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                View vendors
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Quick snapshot</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live
              </span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
                RFPs and vendors are ready to use—start from the links below.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-slate-400" aria-hidden />
                In-flight requests and playbooks will land here when launched.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                Keep approvals and receipts tied to each request for cleaner audits.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2 md:gap-4">
          {navCards.map((card) => (
            <article
              key={card.title}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  {card.icon}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                </div>
              </div>
              <Link
                to={card.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700"
              >
                {card.action}
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
