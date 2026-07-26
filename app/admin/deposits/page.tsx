import DepositActions from "@/components/DepositActions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export default async function DepositsPage() {
  const token = await getAuthCookie();

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);

  if (!payload || payload.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const deposits = await prisma.deposit.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
const pendingDeposits = deposits.filter(
  (deposit) => deposit.status === "PENDING"
).length;

const approvedDeposits = deposits.filter(
  (deposit) => deposit.status === "APPROVED"
).length;

const rejectedDeposits = deposits.filter(
  (deposit) => deposit.status === "REJECTED"
).length;
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Deposit Management
        </h1>

        <p className="mt-2 text-gray-600">
          Review and manage user deposit requests.
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
  <div className="rounded-xl bg-yellow-50 p-6 border border-yellow-200">
    <h3 className="text-sm font-medium text-yellow-700">
      Pending
    </h3>
    <p className="mt-2 text-3xl font-bold text-yellow-900">
      {pendingDeposits}
    </p>
  </div>

  <div className="rounded-xl bg-green-50 p-6 border border-green-200">
    <h3 className="text-sm font-medium text-green-700">
      Approved
    </h3>
    <p className="mt-2 text-3xl font-bold text-green-900">
      {approvedDeposits}
    </p>
  </div>

  <div className="rounded-xl bg-red-50 p-6 border border-red-200">
    <h3 className="text-sm font-medium text-red-700">
      Rejected
    </h3>
    <p className="mt-2 text-3xl font-bold text-red-900">
      {rejectedDeposits}
    </p>
  </div>
</div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deposits.map((deposit) => (
              <tr
                key={deposit.id}
                className="border-t"
              >
                <td className="p-4">
                  {deposit.user.name}
                </td>

                <td className="p-4 font-semibold">
                  ${deposit.amount}
                </td>

                <td className="p-4">
                  {deposit.status}
                </td>

                <td className="p-4">
                  {new Date(
                    deposit.createdAt
                  ).toLocaleDateString()}
                </td>
 <td className="p-4">
  <DepositActions depositId={deposit.id} />
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}