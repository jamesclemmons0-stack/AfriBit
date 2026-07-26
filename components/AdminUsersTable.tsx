"use client";

import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export default function AdminUsersTable({
  initialUsers,
}: {
  initialUsers: User[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function changeRole(userId: number, role: string) {
    setLoadingId(userId);

    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role,
        }),
      });

      if (!response.ok) {
        alert("Failed to update role.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function changeStatus(userId: number, isActive: boolean) {
    setLoadingId(userId);

    try {
      const response = await fetch("/api/admin/users/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isActive,
        }),
      });

      if (!response.ok) {
        alert("Failed to update user status.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive } : user
        )
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-3 text-left">ID</th>
          <th className="border p-3 text-left">Name</th>
          <th className="border p-3 text-left">Email</th>
          <th className="border p-3 text-left">Role</th>
          <th className="border p-3 text-left">Status</th>
          <th className="border p-3 text-left">Created</th>
          <th className="border p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border p-3">{user.id}</td>
            <td className="border p-3">{user.name}</td>
            <td className="border p-3">{user.email}</td>
            <td className="border p-3">{user.role}</td>

            <td className="border p-3">
              {user.isActive ? (
                <span className="text-green-600 font-semibold">
                  Active
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Suspended
                </span>
              )}
            </td>

            <td className="border p-3">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>

            <td className="border p-3 space-x-2">
              {user.role === "USER" ? (
                <button
                  onClick={() => changeRole(user.id, "ADMIN")}
                  disabled={loadingId === user.id}
                  className="rounded bg-blue-600 px-3 py-1 text-white"
                >
                  Make Admin
                </button>
              ) : (
                <button
                  onClick={() => changeRole(user.id, "USER")}
                  disabled={loadingId === user.id}
                  className="rounded bg-orange-600 px-3 py-1 text-white"
                >
                  Make User
                </button>
              )}

              {user.isActive ? (
                <button
                  onClick={() => changeStatus(user.id, false)}
                  disabled={loadingId === user.id}
                  className="rounded bg-red-600 px-3 py-1 text-white"
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={() => changeStatus(user.id, true)}
                  disabled={loadingId === user.id}
                  className="rounded bg-green-600 px-3 py-1 text-white"
                >
                  Activate
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}