import prisma from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import WithdrawalActions from "@/components/admin/WithdrawalActions";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawal.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pending = withdrawals.filter(w => w.status === "PENDING");
  const approved = withdrawals.filter(w => w.status === "APPROVED");
  const rejected = withdrawals.filter(w => w.status === "REJECTED");

  const totalAmount = withdrawals.reduce(
    (sum, w) => sum + w.amount,
    0
  );

  return (
    <DashboardLayout>
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-8">
          Withdrawal Requests
        </h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">Pending</p>
            <h2 className="text-3xl font-bold">
              {pending.length}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">Approved</p>
            <h2 className="text-3xl font-bold text-green-400">
              {approved.length}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">Rejected</p>
            <h2 className="text-3xl font-bold text-red-400">
              {rejected.length}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-6">
            <p className="text-gray-400">Total Amount</p>
            <h2 className="text-3xl font-bold text-blue-400">
              {totalAmount.toFixed(2)} USDT
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto bg-slate-900 rounded-xl">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Network</th>
                <th className="text-left p-4">Wallet Address</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-4">
                    <div>{withdrawal.user.name}</div>
                    <div className="text-gray-400 text-sm">
                      {withdrawal.user.email}
                    </div>
                  </td>

                  <td className="p-4">
                    {withdrawal.amount} USDT
                  </td>

                  <td className="p-4">
                    {withdrawal.network}
                  </td>

                  <td className="p-4 font-mono text-xs">
                    {withdrawal.walletAddress}
                  </td>

                  <td className="p-4">
                    {withdrawal.status}
                  </td>

                  <td className="p-4">
                    {withdrawal.createdAt.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <WithdrawalActions
  withdrawalId={withdrawal.id}
  status={withdrawal.status}
/>
                  </td>
                </tr>
              ))}

              {withdrawals.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-400"
                  >
                    No withdrawal requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}