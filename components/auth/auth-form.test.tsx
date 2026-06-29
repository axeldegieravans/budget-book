import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { AuthForm } from "@/components/auth/auth-form";

const push = jest.fn();
const login = jest.fn();
const register = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

jest.mock("@/lib/services/auth-service", () => ({
  login: (...args: unknown[]) => login(...args),
  register: (...args: unknown[]) => register(...args),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logt een gebruiker in en navigeert naar de boekjes", async () => {
    login.mockResolvedValue(undefined);

    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("E-mailadres"), {
      target: { value: "student@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Wachtwoord"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Inloggen" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("student@example.com", "secret123");
      expect(push).toHaveBeenCalledWith("/books");
    });
  });

  it("registreert een gebruiker met displayname", async () => {
    register.mockResolvedValue(undefined);

    render(<AuthForm mode="register" />);

    fireEvent.change(screen.getByLabelText("Naam"), {
      target: { value: "Axel" },
    });
    fireEvent.change(screen.getByLabelText("E-mailadres"), {
      target: { value: "axel@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Wachtwoord"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Account aanmaken" }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("axel@example.com", "secret123", "Axel");
      expect(push).toHaveBeenCalledWith("/books");
    });
  });

  it("toont een foutmelding wanneer authenticatie mislukt", async () => {
    login.mockRejectedValue(new Error("Onjuiste combinatie."));

    render(<AuthForm mode="login" />);

    fireEvent.change(screen.getByLabelText("E-mailadres"), {
      target: { value: "student@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Wachtwoord"), {
      target: { value: "foutwachtwoord" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Inloggen" }));

    expect(await screen.findByText("Onjuiste combinatie.")).toBeInTheDocument();
  });
});
