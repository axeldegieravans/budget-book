export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string) {
  if (!value) {
    return "Nog niet beschikbaar";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Nog niet beschikbaar";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function currentDateInputValue() {
  return new Date().toISOString().split("T")[0];
}
