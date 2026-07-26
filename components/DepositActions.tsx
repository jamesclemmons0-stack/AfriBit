"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DepositActions({
  depositId,
}: {
  depositId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function approveDeposit() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/deposits/${depositId}/approve`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to approve deposit.");
        return;
      }

      alert("Deposit approved successfully!");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={approveDeposit}
        disabled={loading}
        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Approving..." : "Approve"}
      </button>

      <button
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        Reject
      </button>
    </div>
  );
}