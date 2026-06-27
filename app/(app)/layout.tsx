import { ProtectedApp } from "@/components/layout/protected-app";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedApp>{children}</ProtectedApp>;
}
