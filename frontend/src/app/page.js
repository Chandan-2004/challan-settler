import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-16">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-700">
            Challan Settler
          </h1>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-blue-200 bg-white/80 hover:bg-white shadow-sm transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Smart Traffic Challan Management
            </p>

            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Manage Traffic Challans
              <span className="text-blue-700"> Faster, Smarter</span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-8 max-w-xl">
              Upload challans, track status, assign lawyers, and manage case
              progress — all in one streamlined platform built for users,
              admins, and legal professionals.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="px-7 py-3.5 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 font-semibold transition"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Platform Highlights
            </h3>

            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-1">For Users</h4>
                <p className="text-gray-600">
                  Upload challans, attach documents, and track case progress.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
                <h4 className="font-bold text-indigo-700 mb-1">For Admins</h4>
                <p className="text-gray-600">
                  View all challans and assign lawyers efficiently.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <h4 className="font-bold text-emerald-700 mb-1">For Lawyers</h4>
                <p className="text-gray-600">
                  Review assigned challans and update case status with remarks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100">
            <h3 className="text-xl font-bold mb-3">Secure Authentication</h3>
            <p className="text-gray-600 leading-7">
              Role-based login for users, admins, and lawyers with protected
              access to each dashboard.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100">
            <h3 className="text-xl font-bold mb-3">Document Handling</h3>
            <p className="text-gray-600 leading-7">
              Upload challan files, view them online, and download them when
              needed.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-7 border border-gray-100">
            <h3 className="text-xl font-bold mb-3">Status Tracking</h3>
            <p className="text-gray-600 leading-7">
              Keep challan progress transparent with assignment, review, and
              update workflows.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}