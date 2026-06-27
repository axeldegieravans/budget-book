jest.mock("@/lib/firebase/config", () => ({
  assertFirebaseConfigured: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  arrayUnion: jest.fn((value: string) => ({ arrayUnion: value })),
  collection: jest.fn(() => "books-collection"),
  doc: jest.fn(() => "book-doc"),
  getDocs: jest.fn(),
  limit: jest.fn((value: number) => value),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(() => "books-query"),
  serverTimestamp: jest.fn(() => "timestamp"),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
}));

import { addDoc, setDoc, updateDoc } from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import { archiveBook, createBook, restoreBook } from "@/lib/services/book-service";

describe("book-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (assertFirebaseConfigured as jest.Mock).mockReturnValue({ db: { kind: "db" } });
  });

  it("maakt een boekje aan met owner data", async () => {
    (addDoc as jest.Mock).mockResolvedValue({ id: "book-1" });

    await createBook("user-1", {
      name: "Projectpot",
      description: "Beschrijving",
    });

    expect(addDoc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
  });

  it("archiveert en herstelt een boekje", async () => {
    await archiveBook("book-1");
    await restoreBook("book-1");

    expect(updateDoc).toHaveBeenCalledTimes(2);
  });
});
