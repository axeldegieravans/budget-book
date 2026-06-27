import type {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as Timestamp).toDate === "function"
  ) {
    return (value as Timestamp).toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, serializeValue(nestedValue)]),
    );
  }

  return value;
}

export function mapSnapshot<T>(snapshot: QueryDocumentSnapshot): T {
  const data = (serializeValue(snapshot.data()) ?? {}) as Record<string, unknown>;

  return {
    id: snapshot.id,
    ...data,
  } as T;
}

export function mapDocumentSnapshot<T>(snapshot: DocumentSnapshot): T {
  const data = (serializeValue(snapshot.data()) ?? {}) as Record<string, unknown>;

  return {
    id: snapshot.id,
    ...data,
  } as T;
}
