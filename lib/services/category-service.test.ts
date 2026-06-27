jest.mock("@/lib/firebase/config", () => ({
  assertFirebaseConfigured: jest.fn(),
}));

jest.mock("@/lib/firebase/mappers", () => ({
  mapSnapshot: jest.fn((item) => item.mappedValue),
}));

const batchUpdate = jest.fn();
const batchDelete = jest.fn();
const batchCommit = jest.fn();

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(() => "categories-collection"),
  doc: jest.fn(() => "category-doc"),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn((field, direction) => ({ field, direction })),
  query: jest.fn(() => "categories-query"),
  serverTimestamp: jest.fn(() => "timestamp"),
  updateDoc: jest.fn(),
  where: jest.fn((field, operator, value) => ({ field, operator, value })),
  writeBatch: jest.fn(() => ({
    update: batchUpdate,
    delete: batchDelete,
    commit: batchCommit,
  })),
}));

import {
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import {
  createCategory,
  deleteCategory,
  subscribeToCategories,
  updateCategory,
} from "@/lib/services/category-service";

describe("category-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    batchUpdate.mockReset();
    batchDelete.mockReset();
    batchCommit.mockReset();
    (assertFirebaseConfigured as jest.Mock).mockReturnValue({ db: { kind: "db" } });
  });

  it("abonneert zich op categorieen en mapped snapshot data", () => {
    const callback = jest.fn();
    const unsubscribe = jest.fn();
    (onSnapshot as jest.Mock).mockImplementation((_query, listener) => {
      listener({
        docs: [{ mappedValue: { id: "cat-1", name: "Boodschappen" } }],
      });
      return unsubscribe;
    });

    const result = subscribeToCategories("book-1", callback);

    expect(callback).toHaveBeenCalledWith([{ id: "cat-1", name: "Boodschappen" }]);
    expect(result).toBe(unsubscribe);
  });

  it("maakt een categorie aan en werkt die bij", async () => {
    await createCategory("book-1", {
      name: "Boodschappen",
      budget: 200,
      color: "#10b981",
      endDate: "",
    });

    await updateCategory("book-1", "cat-1", {
      name: "Vaste lasten",
      budget: 300,
      color: "#0ea5e9",
      endDate: "2026-06-30",
    });

    expect(addDoc).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalled();
  });

  it("verwijdert een categorie en ontkoppelt gekoppelde transacties", async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ ref: "transaction-ref-1" }, { ref: "transaction-ref-2" }],
    });

    await deleteCategory("book-1", "cat-1");

    expect(batchUpdate).toHaveBeenCalledTimes(2);
    expect(batchDelete).toHaveBeenCalledTimes(1);
    expect(batchCommit).toHaveBeenCalledTimes(1);
  });
});
