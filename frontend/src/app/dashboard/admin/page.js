"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://challan-settler.onrender.com";

export default function AdminDashboard() {
  const [challans, setChallans] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    try {
      const challanRes = await fetch(`${API_URL}/api/challans/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const challanData = await challanRes.json();

      const userRes = await fetch(`${API_URL}/api/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userRes.json();

      const lawyersOnly = Array.isArray(userData)
        ? userData.filter((u) => u.role === "LAWYER")
        : [];

      setChallans(Array.isArray(challanData) ? challanData : []);
      setLawyers(lawyersOnly);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignLawyer = async (challan_id, lawyer_id) => {
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
        toast.error("Assignment failed");
        return;
      }

      toast.success("Lawyer assigned");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

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

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          Admin Dashboard
        </h1>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            All Challans
          </h2>

          {challans.length === 0 ? (
            <p className="text-gray-500">No challans found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-3">User</th>
                    <th className="py-3">Challan</th>
                    <th className="py-3">Vehicle</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Lawyer</th>
                    <th className="py-3">Document</th>
                    <th className="py-3">Assign</th>
                  </tr>
                </thead>

                <tbody>
                  {challans.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{c.user_name || "N/A"}</td>
                      <td className="py-3">{c.challan_number}</td>
                      <td className="py-3">{c.vehicle_number}</td>

                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3">
                        {c.lawyer_name || "Not Assigned"}
                      </td>

                      <td className="py-3">
                        {c.document_path ? (
                          <div className="flex gap-2">
                            <a
                              href={`${API_URL}/uploads/${c.document_path}`}
                              target="_blank"
                              className="text-blue-600"
                            >
                              View
                            </a>
                            <a
                              href={`${API_URL}/uploads/${c.document_path}`}
                              download
                              className="text-green-600"
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          "No file"
                        )}
                      </td>

                      <td className="py-3">
                        <select
                          onChange={(e) =>
                            assignLawyer(c.id, e.target.value)
                          }
                          className="border p-2 rounded-xl"
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
          )}
        </div>
      </div>
    </main>
  );
}