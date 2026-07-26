"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
  ChartNoAxesCombined,
  BarChart3,
} from "lucide-react";

export default function AdminSidebar() {
    const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="border-b border-gray-700 p-6">
        <h1 className="text-2xl font-bold">
          AFRIBIT
        </h1>

        <p className="text-sm text-gray-400">
          Admin Panel
        </p>
      </div>

      <nav className="flex flex-col space-y-2 p-4">
<Link
  href="/admin"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <LayoutDashboard size={20} />
  Dashboard
</Link>

<Link
  href="/admin/users"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin/users"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <Users size={20} />
  Users
</Link>

<Link
  href="/admin/deposits"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin/deposits"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <ArrowDownCircle size={20} />
  Deposits
</Link>

<Link
  href="/admin/withdrawals"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin/withdrawals"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <ArrowUpCircle size={20} />
  Withdrawals
</Link>

<Link
  href="/admin/trades"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin/trades"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <ChartNoAxesCombined size={20} />
  Trades
</Link>

<Link
  href="/admin/analytics"
  className={`flex items-center gap-3 rounded p-3 transition ${
    pathname === "/admin/analytics"
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-800"
  }`}
>
  <BarChart3 size={20} />
  Analytics
</Link>

        <Link
          href="/dashboard"
          className="mt-8 rounded p-3 hover:bg-red-700"
        >
          ← Back to User Dashboard
        </Link>
      </nav>
    </aside>
  );
}