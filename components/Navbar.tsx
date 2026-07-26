"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
  alert("Logout button clicked");

  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    alert(`Status: ${response.status}`);

    if (response.ok) {
      router.push("/login");
      router.refresh();
    } else {
      alert("Logout failed.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <h1 className="text-3xl font-bold text-green-500">
        AfriBit
      </h1>

      <div className="flex items-center space-x-6">
        <a href="#" className="hover:text-green-400">
          Home
        </a>

        <a href="#" className="hover:text-green-400">
          Markets
        </a>

        <a href="#" className="hover:text-green-400">
          Signals
        </a>

        <a href="#" className="hover:text-green-400">
          Contact
        </a>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}