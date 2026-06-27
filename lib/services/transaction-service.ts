"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import { mapSnapshot } from "@/lib/firebase/mappers";
import type { Transaction, TransactionFormValues } from "@/types/domain";

export function subscribeToTransactions(
  bookId: string,
  callback: (transactions: Transaction[]) => void,
) {
  const { db } = assertFirebaseConfigured();
  const transactionsQuery = query(
    collection(db, "books", bookId, "transactions"),
    orderBy("date", "desc"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(transactionsQuery, (snapshot) => {
    callback(snapshot.docs.map((item) => mapSnapshot<Transaction>(item)));
  });
}

export async function createTransaction(
  bookId: string,
  createdBy: string,
  values: TransactionFormValues,
) {
  const { db } = assertFirebaseConfigured();
  await addDoc(collection(db, "books", bookId, "transactions"), {
    ...values,
    categoryId: values.categoryId || null,
    notes: values.notes || "",
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTransaction(
  bookId: string,
  transactionId: string,
  values: TransactionFormValues,
) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId, "transactions", transactionId), {
    ...values,
    categoryId: values.categoryId || null,
    notes: values.notes || "",
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTransaction(bookId: string, transactionId: string) {
  const { db } = assertFirebaseConfigured();
  await deleteDoc(doc(db, "books", bookId, "transactions", transactionId));
}

export async function assignCategory(
  bookId: string,
  transactionId: string,
  categoryId: string | null,
) {
  const { db } = assertFirebaseConfigured();
  await updateDoc(doc(db, "books", bookId, "transactions", transactionId), {
    categoryId,
    updatedAt: serverTimestamp(),
  });
}
