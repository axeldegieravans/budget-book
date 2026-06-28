import Link from "next/link";

export function ArchivedBookNotice() {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-2xl font-semibold text-amber-950">Dit boekje is gearchiveerd</h1>
      <p className="text-sm text-amber-900">
        Herstel het boekje eerst vanuit het archief om het weer te gebruiken.
      </p>
      <Link href="/books/archived" className="text-sm font-semibold text-amber-900 underline">
        Ga naar archief
      </Link>
    </div>
  );
}
