"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import { mapSnapshot } from "@/lib/firebase/mappers";
import type { Category, CategoryFormValues } from "@/types/domain";

export function subscribeToCategories(
  bookId: string,
  callback: (categories: Category[]) => void,
  onError?: (error: Error) => void,
) {
  const { db } = assertFirebaseConfigured();
  const categoriesQuery = query(
    collection(db, "books", bookId, "categories"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    categoriesQuery,
    (snapshot) => {
      callback(snapshot.docs.map((item) => mapSnapshot<Category>(item)));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function createCategory(bookId: string, values: CategoryFormValues) {
  const { db } = assertFirebaseConfigured();
  await addDoc(collection(db, "books", bookId, "categories"), {
    ...values,
    endDate: values.endDate || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(
  bookId: string,
  categoryId: string,
  values: CategoryFormValues,
) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId, "categories", categoryId), {
    ...values,
    endDate: values.endDate || null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(bookId: string, categoryId: string) {
  const { db } = assertFirebaseConfigured();
  const transactionsQuery = query(
    collection(db, "books", bookId, "transactions"),
    where("categoryId", "==", categoryId),
  );
  const transactionsSnapshot = await getDocs(transactionsQuery);
  const batch = writeBatch(db);

  transactionsSnapshot.docs.forEach((transaction) => {
    batch.update(transaction.ref, {
      categoryId: null,
      updatedAt: serverTimestamp(),
    });
  });

  batch.delete(doc(db, "books", bookId, "categories", categoryId));
  await batch.commit();
}
