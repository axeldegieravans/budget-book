jest.mock("@/lib/firebase/config", () => ({
  assertFirebaseConfigured: jest.fn(),
}));

jest.mock("@/lib/firebase/mappers", () => ({
  mapSnapshot: jest.fn((item) => item.mappedValue),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(() => "transactions-collection"),
  deleteDoc: jest.fn(),
  doc: jest.fn(() => "transaction-doc"),
  onSnapshot: jest.fn(),
  orderBy: jest.fn((field, direction) => ({ field, direction })),
  query: jest.fn(() => "transactions-query"),
  serverTimestamp: jest.fn(() => "timestamp"),
  updateDoc: jest.fn(),
}));

import {
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import {
  assignCategory,
  createTransaction,
  deleteTransaction,
  subscribeToTransactions,
  updateTransaction,
} from "@/lib/services/transaction-service";

describe("transaction-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (assertFirebaseConfigured as jest.Mock).mockReturnValue({ db: { kind: "db" } });
  });

  it("abonneert zich op transacties en mapped snapshot data", () => {
    const callback = jest.fn();
    const unsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockImplementation((_query, listener) => {
      listener({
        docs: [{ mappedValue: { id: "tx-1", title: "Jumbo" } }],
      });
      return unsubscribe;
    });

    const result = subscribeToTransactions("book-1", callback);

    expect(callback).toHaveBeenCalledWith([{ id: "tx-1", title: "Jumbo" }]);
    expect(result).toBe(unsubscribe);
  });

  it("maakt een transactie aan", async () => {
    await createTransaction("book-1", "user-1", {
      title: "Jumbo",
      amount: 45,
      type: "expense",
      date: "2026-06-27",
      categoryId: "",
      notes: "",
    });

    expect(addDoc).toHaveBeenCalled();
  });

  it("werkt een transactie bij, verwijdert een transactie en koppelt een categorie", async () => {
    await updateTransaction("book-1", "tx-1", {
      title: "Albert Heijn",
      amount: 50,
      type: "expense",
      date: "2026-06-28",
      categoryId: "cat-1",
      notes: "geupdate",
    });
    await deleteTransaction("book-1", "tx-1");
    await assignCategory("book-1", "tx-1", null);

    expect(updateDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });
});
