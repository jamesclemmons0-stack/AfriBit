import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";
import {
  Users,
  UserCheck,
  UserX,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  Wallet,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default async function AdminPage() {
  const token = await getAuthCookie();

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();

  const activeUsers = await prisma.user.count({
    where: {
      isActive: true,
    },
  });

  const suspendedUsers = await prisma.user.count({
    where: {
      isActive: false,
    },
  });

  const totalDeposits = await prisma.deposit.count();
  const totalWithdrawals = await prisma.withdrawal.count();

const openTrades = await prisma.trade.count({
  where: {
    status: "OPEN",
  },
});

const closedTrades = await prisma.trade.count({
  where: {
    status: "CLOSED",
  },
});

const pendingDeposits = await prisma.deposit.count({
  where: {
    status: "PENDING",
  },
});

const pendingWithdrawals = await prisma.withdrawal.count({
  where: {
    status: "PENDING",
  },
});

const wallets = await prisma.wallet.findMany({
  select: {
    balance: true,
  },
});

const totalWalletBalance = wallets.reduce(
  (sum, wallet) => sum + wallet.balance,
  0
);

const tradingVolume = await prisma.trade.aggregate({
  _sum: {
    quantity: true,
  },
});

  const recentUsers = await prisma.user.findMany({
  orderBy: {
    createdAt: "desc",
  },
  take: 5,
});
  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">
        Admin Dashboard
      </h1>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

  {/* Total Users */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Total Users
        </h2>

        <p className="mt-2 text-3xl font-bold text-gray-900">
          {totalUsers}
        </p>
      </div>

      <div className="rounded-full bg-blue-100 p-3">
        <Users className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>

  {/* Active Users */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Active Users
        </h2>

        <p className="mt-2 text-3xl font-bold text-green-600">
          {activeUsers}
        </p>
      </div>

      <div className="rounded-full bg-green-100 p-3">
        <UserCheck className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>

  {/* Suspended Users */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Suspended Users
        </h2>

        <p className="mt-2 text-3xl font-bold text-red-600">
          {suspendedUsers}
        </p>
      </div>

      <div className="rounded-full bg-red-100 p-3">
        <UserX className="h-6 w-6 text-red-600" />
      </div>
    </div>
  </div>

  {/* Deposits */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Deposits
        </h2>

        <p className="mt-2 text-3xl font-bold text-blue-600">
          {totalDeposits}
        </p>
      </div>

      <div className="rounded-full bg-blue-100 p-3">
        <ArrowDownCircle className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>

  {/* Withdrawals */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Withdrawals
        </h2>

        <p className="mt-2 text-3xl font-bold text-orange-600">
          {totalWithdrawals}
        </p>
      </div>

      <div className="rounded-full bg-orange-100 p-3">
        <ArrowUpCircle className="h-6 w-6 text-orange-600" />
      </div>
    </div>
  </div>

  {/* Open Trades */}
  <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Open Trades
        </h2>

        <p className="mt-2 text-3xl font-bold text-green-600">
          {openTrades}
        </p>
      </div>

      <div className="rounded-full bg-green-100 p-3">
        <TrendingUp className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>

</div>
<div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
  <h2 className="text-3xl font-bold">
    Welcome back, {payload.name}! 👋
  </h2>

  <p className="mt-3 max-w-3xl text-blue-100">
    Welcome to the AFRIBIT Administration Dashboard. From here you can
    manage users, review deposits and withdrawals, monitor trading
    activity, and oversee the entire platform from one place.
  </p>
</div>

<div className="mt-8">
  <h2 className="mb-4 text-2xl font-bold text-gray-800">
    Quick Actions
  </h2>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
<a
  href="/admin/users"
  className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
    <ShieldCheck className="h-6 w-6 text-blue-600" />
  </div>

  <h3 className="text-lg font-semibold text-gray-900">
    Manage Users
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    View, activate, suspend and manage user accounts.
  </p>
</a>

<a
  href="/admin/deposits"
  className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
    <ArrowDownCircle className="h-6 w-6 text-green-600" />
  </div>

  <h3 className="text-lg font-semibold text-gray-900">
    Review Deposits
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    Approve or reject pending deposit requests.
  </p>
</a>

<a
  href="/admin/withdrawals"
  className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
    <ArrowUpCircle className="h-6 w-6 text-orange-600" />
  </div>

  <h3 className="text-lg font-semibold text-gray-900">
    Review Withdrawals
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    Process withdrawal requests securely.
  </p>
</a>

<a
  href="/admin/analytics"
  className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
    <BarChart3 className="h-6 w-6 text-purple-600" />
  </div>

  <h3 className="text-lg font-semibold text-gray-900">
    Platform Analytics
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    View reports and platform performance.
  </p>
</a>
  </div>
</div>

<div className="mt-10 rounded-2xl bg-white p-6 shadow">
  <h2 className="mb-6 text-2xl font-bold text-gray-800">
    Recent Users
  </h2>

  <div className="space-y-4">
    {recentUsers.map((user) => (
      <div
        key={user.id}
        className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
      >
        <div>
          <p className="font-semibold text-gray-900">
            {user.name}
          </p>

          <p className="text-sm text-gray-500">
            {user.email}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {user.role}
          </p>

          <p
            className={`text-sm ${
              user.isActive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {user.isActive ? "Active" : "Suspended"}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  );
}