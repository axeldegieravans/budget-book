import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import { ProtectedApp } from "@/components/layout/protected-app";

const mockUseAuth = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("@/components/ui/firebase-setup-notice", () => ({
  FirebaseSetupNotice: () => <div>Firebase notice</div>,
}));

jest.mock("@/components/layout/app-shell", () => ({
  AppShell: ({ children, userName }: { children: React.ReactNode; userName?: string | null }) => (
    <div>
      <span>AppShell for {userName}</span>
      {children}
    </div>
  ),
}));

describe("ProtectedApp", () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace });
  });

  it("toont firebase setup notice als firebase niet geconfigureerd is", () => {
    mockUseAuth.mockReturnValue({
      configured: false,
      loading: false,
      user: null,
    });

    render(<ProtectedApp><div>Child</div></ProtectedApp>);

    expect(screen.getByText("Firebase notice")).toBeInTheDocument();
  });

  it("toont laadstatus terwijl sessie nog laadt", () => {
    mockUseAuth.mockReturnValue({
      configured: true,
      loading: true,
      user: null,
    });

    render(<ProtectedApp><div>Child</div></ProtectedApp>);

    expect(screen.getByText("Sessie laden...")).toBeInTheDocument();
  });

  it("redirect naar login wanneer geen gebruiker is ingelogd", () => {
    mockUseAuth.mockReturnValue({
      configured: true,
      loading: false,
      user: null,
    });

    render(<ProtectedApp><div>Child</div></ProtectedApp>);

    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("rendert de app shell voor ingelogde gebruikers", () => {
    mockUseAuth.mockReturnValue({
      configured: true,
      loading: false,
      user: { displayName: "Axel" },
    });

    render(<ProtectedApp><div>Dashboard</div></ProtectedApp>);

    expect(screen.getByText("AppShell for Axel")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
