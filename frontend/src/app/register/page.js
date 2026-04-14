"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://challan-settler.onrender.com";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success(data.message || "Registration successful");
      router.push("/login");
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/70">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Register to start managing challans
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full mb-4 p-3.5 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            className="w-full mb-4 p-3.5 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full mb-4 p-3.5 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
  type="text"
  name="phone"
  placeholder="Phone Number"
  className="w-full mb-4 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
  value={form.phone}
  onChange={handleChange}
/>
<input
  type="text"
  name="address"
  placeholder="Address"
  className="w-full mb-4 p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500"
  value={form.address}
  onChange={handleChange}
/>
          <input name="specialization" placeholder="Specialization (for lawyers)" />
          <select
            name="role"
            className="w-full mb-5 p-3.5 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={form.role}
            onChange={handleChange}
          >
            <option value="USER">User</option>
            <option value="LAWYER">Lawyer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold shadow-lg transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}