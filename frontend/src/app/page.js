import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Challan Settler Platform
        </h1>
        <p className="text-gray-600 mb-8">
          Upload and manage your traffic challans easily.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}