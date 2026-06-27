import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Category, Transaction } from "@/types/domain";

export function TransactionTable({
  categories,
  transactions,
  onDelete,
}: {
  categories: Category[];
  transactions: Transaction[];
  onDelete: (transactionId: string) => Promise<void>;
}) {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 shadow-sm">
      <table className="min-w-full divide-y divide-slate-100 text-left">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr>
            <th className="px-5 py-4">Titel</th>
            <th className="px-5 py-4">Datum</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Categorie</th>
            <th className="px-5 py-4">Bedrag</th>
            <th className="px-5 py-4">Actie</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">{transaction.title}</p>
                  {transaction.notes ? <p className="text-xs text-slate-500">{transaction.notes}</p> : null}
                </div>
              </td>
              <td className="px-5 py-4">{formatDate(transaction.date)}</td>
              <td className="px-5 py-4">
                {transaction.type === "expense" ? "Uitgave" : "Inkomst"}
              </td>
              <td className="px-5 py-4">
                {transaction.categoryId ? categoryMap.get(transaction.categoryId) || "Onbekend" : "Niet gekoppeld"}
              </td>
              <td className="px-5 py-4 font-semibold">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => void onDelete(transaction.id)}
                  className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Verwijder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
