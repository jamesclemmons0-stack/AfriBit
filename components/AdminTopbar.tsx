export default function AdminTopbar() {
  return (
    <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-5 shadow">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          AFRIBIT Admin
        </h1>

        <p className="text-sm text-gray-500">
          Crypto Trading Platform Administration
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full bg-gray-100 p-3 hover:bg-gray-200">
          🔔
        </button>

        <button className="rounded-full bg-gray-100 p-3 hover:bg-gray-200">
          ⚙️
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
            A
          </div>

          <div>
            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-xs text-gray-500">
              Online
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}