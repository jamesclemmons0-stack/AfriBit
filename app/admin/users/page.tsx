import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";
import AdminUsersTable from "@/components/AdminUsersTable";

export default async function UsersPage() {
  const token = await getAuthCookie();

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-gray-600 mt-2">
          Manage platform users, roles, and account status.
        </p>
      </div>

      <AdminUsersTable initialUsers={users} />
    </>
  );
}