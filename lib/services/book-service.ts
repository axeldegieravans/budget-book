"use client";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import { mapDocumentSnapshot, mapSnapshot } from "@/lib/firebase/mappers";
import type { BookFormValues, HouseholdBook } from "@/types/domain";

type BooksOptions = {
  archived?: boolean;
};

export function subscribeToBooks(
  userId: string,
  callback: (books: HouseholdBook[]) => void,
  onError?: (error: Error) => void,
  options: BooksOptions = {},
) {
  const { db } = assertFirebaseConfigured();
  const archived = options.archived ?? false;
  const ownedBooksQuery = query(
    collection(db, "books"),
    where("ownerId", "==", userId),
    where("isArchived", "==", archived),
    orderBy("updatedAt", "desc"),
  );
  const sharedBooksQuery = query(
    collection(db, "books"),
    where("memberIds", "array-contains", userId),
    where("isArchived", "==", archived),
    orderBy("updatedAt", "desc"),
  );

  let ownedBooks: HouseholdBook[] = [];
  let sharedBooks: HouseholdBook[] = [];

  const emit = () => {
    const merged = [...ownedBooks, ...sharedBooks].reduce<HouseholdBook[]>((result, book) => {
      if (!result.some((item) => item.id === book.id)) {
        result.push(book);
      }

      return result;
    }, []);

    callback(merged);
  };

  const unsubscribeOwned = onSnapshot(
    ownedBooksQuery,
    (snapshot) => {
      ownedBooks = snapshot.docs.map((item) => ({
        ...mapSnapshot<HouseholdBook>(item),
        role: "owner" as const,
      }));
      emit();
    },
    (error) => {
      onError?.(error);
    },
  );

  const unsubscribeShared = onSnapshot(
    sharedBooksQuery,
    (snapshot) => {
      sharedBooks = snapshot.docs
        .map((item) => {
          const book = mapSnapshot<HouseholdBook>(item);
          return {
            ...book,
            role: book.ownerId === userId ? ("owner" as const) : ("member" as const),
          };
        })
        .filter((book) => book.ownerId !== userId);
      emit();
    },
    (error) => {
      onError?.(error);
    },
  );

  return () => {
    unsubscribeOwned();
    unsubscribeShared();
  };
}

export function subscribeToBook(
  bookId: string,
  callback: (book: HouseholdBook | null) => void,
  onError?: (error: Error) => void,
) {
  const { db } = assertFirebaseConfigured();

  return onSnapshot(
    doc(db, "books", bookId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(mapDocumentSnapshot<HouseholdBook>(snapshot));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function createBook(ownerId: string, values: BookFormValues) {
  const { db } = assertFirebaseConfigured();
  const bookRef = await addDoc(collection(db, "books"), {
    ...values,
    ownerId,
    memberIds: [ownerId],
    isArchived: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "books", bookRef.id, "members", ownerId), {
    role: "owner",
    joinedAt: serverTimestamp(),
  });
}

export async function updateBook(bookId: string, values: BookFormValues) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export async function archiveBook(bookId: string) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId), {
    isArchived: true,
    updatedAt: serverTimestamp(),
  });
}

export async function restoreBook(bookId: string) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId), {
    isArchived: false,
    updatedAt: serverTimestamp(),
  });
}

export async function shareBook(bookId: string, email: string) {
  const { db } = assertFirebaseConfigured();
  const usersQuery = query(
    collection(db, "users"),
    where("emailLowercase", "==", email.toLowerCase()),
    limit(1),
  );
  const usersSnapshot = await getDocs(usersQuery);

  if (usersSnapshot.empty) {
    throw new Error("Geen gebruiker gevonden met dit e-mailadres.");
  }

  const userDoc = usersSnapshot.docs[0];
  const memberId = userDoc.id;

  await updateDoc(doc(db, "books", bookId), {
    memberIds: arrayUnion(memberId),
    updatedAt: serverTimestamp(),
  });
  await setDoc(doc(db, "books", bookId, "members", memberId), {
    role: "member",
    joinedAt: serverTimestamp(),
  });
}
