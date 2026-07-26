import AdminTopbar from "@/components/AdminTopbar";
import AdminSidebar from "@/components/AdminSidebar";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 overflow-auto bg-gray-100 p-8">
        <AdminTopbar />

        {children}
      </main>
    </div>
  );
}