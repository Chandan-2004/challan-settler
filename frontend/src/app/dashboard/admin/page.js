"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://challan-settler.onrender.com";

export default function AdminDashboard() {
  const [challans, setChallans] = useState([]);
  const [users, setUsers] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const challanRes = await fetch(`${API_URL}/api/challans/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const challanData = await challanRes.json();

      const userRes = await fetch(`${API_URL}/api/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userRes.json();

      // ✅ Separate users & lawyers
      const usersOnly = Array.isArray(userData)
        ? userData.filter((u) => u.role === "USER")
        : [];

      const lawyersOnly = Array.isArray(userData)
        ? userData.filter((u) => u.role === "LAWYER")
        : [];

      setChallans(Array.isArray(challanData) ? challanData : []);
      setUsers(usersOnly);
      setLawyers(lawyersOnly);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 ASSIGN LAWYER
  const assignLawyer = async (challan_id, lawyer_id) => {
    const token = localStorage.getItem("token");

    if (!lawyer_id) {
      toast.error("Please select a lawyer");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/challans/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challan_id, lawyer_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Assignment failed");
        return;
      }

      toast.success("Lawyer assigned");
      fetchData();
    } catch (err) {
      console.error("Assign Error:", err);
      toast.error("Server error");
    }
  };

  // 🔥 DELETE USER
  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }

      toast.success("User deleted");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // 🔥 STATUS COLORS
  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 🔥 STATS
  const total = challans.length;
  const assigned = challans.filter((c) => c.status === "ASSIGNED").length;
  const inProgress = challans.filter(
    (c) => c.status === "IN_PROGRESS"
  ).length;
  const completed = challans.filter(
    (c) => c.status === "COMPLETED"
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          Admin Dashboard
        </h1>

        {/* 🔥 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p>Total</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>
          <div className="bg-blue-50 p-5 rounded-2xl shadow">
            <p>Assigned</p>
            <h2 className="text-2xl font-bold">{assigned}</h2>
          </div>
          <div className="bg-purple-50 p-5 rounded-2xl shadow">
            <p>In Progress</p>
            <h2 className="text-2xl font-bold">{inProgress}</h2>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl shadow">
            <p>Completed</p>
            <h2 className="text-2xl font-bold">{completed}</h2>
          </div>
        </div>

        {/* 🔥 USERS TABLE */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4">Users</h2>

          <table className="w-full">
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 LAWYERS TABLE */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4">Lawyers</h2>

          <table className="w-full">
            <tbody>
              {lawyers.map((u) => (
                <tr key={u.id} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 CHALLANS */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">All Challans</h2>

          <table className="w-full">
            <tbody>
              {challans.map((c) => (
                <tr key={c.id} className="border-b">
                  <td>{c.user_name}</td>
                  <td>{c.challan_number}</td>
                  <td>{c.vehicle_number}</td>

                  <td>
                    <span className={getStatusColor(c.status)}>
                      {c.status}
                    </span>
                  </td>

                  <td>{c.lawyer_name || "Not Assigned"}</td>

                  <td>
                    {c.document_path && (
                      <a
                        href={c.document_path}
                        target="_blank"
                        className="text-blue-600"
                      >
                        View
                      </a>
                    )}
                  </td>

                  <td>
                    <select
                      onChange={(e) =>
                        assignLawyer(c.id, e.target.value)
                      }
                      defaultValue=""
                    >
                      <option value="">Select</option>
                      {lawyers.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}