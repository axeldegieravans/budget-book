export function FirebaseSetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-amber-200 bg-white/90 p-8 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
        Configuratie nodig
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Firebase is nog niet gekoppeld</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Voeg een `.env.local` toe met de `NEXT_PUBLIC_FIREBASE_*` variabelen voor API key,
        auth domain, project id, storage bucket, messaging sender id en app id.
      </p>
    </div>
  );
}
