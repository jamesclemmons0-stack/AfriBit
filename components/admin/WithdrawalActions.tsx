"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WithdrawalActions({
  withdrawalId,
  status,
}: {
  withdrawalId: number;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function approveWithdrawal() {
    if (!confirm("Approve this withdrawal request?")) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/withdrawals/${withdrawalId}/approve`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to approve withdrawal.");
        return;
      }

      alert("Withdrawal approved successfully!");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function rejectWithdrawal() {
    if (!confirm("Reject this withdrawal request?")) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/withdrawals/${withdrawalId}/reject`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to reject withdrawal.");
        return;
      }

      alert("Withdrawal rejected.");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (status !== "PENDING") {
    return (
      <span
        className={`rounded px-3 py-1 text-sm font-medium ${
          status === "APPROVED"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={approveWithdrawal}
        disabled={loading}
        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Approve"}
      </button>

      <button
        onClick={rejectWithdrawal}
        disabled={loading}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}