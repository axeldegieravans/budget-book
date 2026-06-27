jest.mock("@/lib/firebase/config", () => ({
  assertFirebaseConfigured: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  serverTimestamp: jest.fn(() => "timestamp"),
  setDoc: jest.fn(),
}));

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { assertFirebaseConfigured } from "@/lib/firebase/config";
import { login, logout, register, subscribeToAuth } from "@/lib/services/auth-service";

describe("auth-service", () => {
  const auth = { kind: "auth" };
  const db = { kind: "db" };

  beforeEach(() => {
    jest.clearAllMocks();
    (assertFirebaseConfigured as jest.Mock).mockReturnValue({ auth, db });
    (doc as jest.Mock).mockReturnValue("user-doc-ref");
  });

  it("registreert gebruiker en maakt profielrecord aan", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "user-1", email: "test@example.com" },
    });

    await register("test@example.com", "secret123", "Test User");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "secret123");
    expect(updateProfile).toHaveBeenCalledWith(
      { uid: "user-1", email: "test@example.com" },
      { displayName: "Test User" },
    );
    expect(setDoc).toHaveBeenCalled();
  });

  it("logt in en uit via firebase auth", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "user-1" },
    });

    await login("test@example.com", "secret123");
    await logout();

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "secret123");
    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it("maakt een auth subscription", () => {
    const callback = jest.fn();
    subscribeToAuth(callback);

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, callback);
  });
});
