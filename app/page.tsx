import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_100%)] px-4 py-12">
      <main className="grid w-full max-w-6xl gap-8 rounded-[2.5rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              ADWEB 2425 eindopdracht
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950">
              Een realtime huishoudboekje met heldere budgetten, categorieen en inzichten.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Gebouwd voor React 19, Firebase en een nette presentatie: meerdere boekjes,
              realtime Firestore-updates, drag-and-drop categorisering, grafieken en een
              duidelijke Tailwind UI.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Start met registreren
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Ik heb al een account
            </Link>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[
            ["Realtime", "Firestore listeners houden boekjes, totalen en grafieken live synchroon."],
            ["Overzichtelijk", "Kleine componenten, losse services en duidelijke route-indeling."],
            ["Gebruiksvriendelijk", "Heldere forms, budgetsignalen en fijne flows voor dagelijkse invoer."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
