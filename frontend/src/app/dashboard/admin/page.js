"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../../src/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const router = useRouter();
  const [challans, setChallans] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const challanRes = await fetch(`${API_URL}/api/challans/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersRes = await fetch(`${API_URL}/api/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const challanData = await challanRes.json();
      const usersData = await usersRes.json();

      setChallans(Array.isArray(challanData) ? challanData : []);
      setLawyers(Array.isArray(usersData) ? usersData.filter((u) => u.role === "LAWYER") : []);
    } catch (error) {
      console.error("Fetch Admin Data Error:", error);
      setChallans([]);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const assignLawyer = async (challanId, lawyerId) => {
    const token = localStorage.getItem("token");

    if (!lawyerId) return;

    try {
      const res = await fetch(`${API_URL}/api/challans/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challan_id: Number(challanId),
          lawyer_id: Number(lawyerId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to assign lawyer");
        return;
      }

      alert("Lawyer assigned successfully");
      fetchData(token);
    } catch (error) {
      console.error("Assign Lawyer Error:", error);
      alert("Server error");
    }
  };

  const fetchTimeline = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/challans/timeline/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTimeline(Array.isArray(data) ? data : []);
      setSelectedId(id);
    } catch (error) {
      console.error("Timeline Error:", error);
      setTimeline([]);
    }
  };

  return (
    <ProtectedRoute allowedRole="ADMIN">
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">All Challans</h2>

          {loading ? (
            <p>Loading...</p>
          ) : challans.length === 0 ? (
            <p>No challans found.</p>
          ) : (
            challans.map((c) => (
              <div key={c.id} className="border-b py-3">
                <p><strong>Challan:</strong> {c.challan_number}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <p><strong>User:</strong> {c.user_name}</p>
                <p><strong>Lawyer:</strong> {c.lawyer_name || "Not Assigned"}</p>

                {c.document_path && (
                  <div className="mt-2">
                    <a
                      href={`${API_URL}/uploads/${c.document_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mr-3"
                    >
                      View Document
                    </a>
                    <a
                      href={`${API_URL}/uploads/${c.document_path}`}
                      download
                      className="text-green-600 underline"
                    >
                      Download
                    </a>
                  </div>
                )}

                <select
                  value={c.lawyer_id || ""}
                  onChange={(e) => assignLawyer(c.id, e.target.value)}
                  className="mt-2 border p-2 rounded"
                >
                  <option value="">Assign Lawyer</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => fetchTimeline(c.id)}
                  className="mt-2 ml-3 bg-gray-800 text-white px-2 py-1 rounded"
                >
                  View Timeline
                </button>

                {selectedId === c.id && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <h3 className="font-bold mb-2">Timeline</h3>
                    {timeline.length === 0 ? (
                      <p>No updates yet.</p>
                    ) : (
                      timeline.map((t) => (
                        <div key={t.id} className="mb-2 border-b pb-2">
                          <p><strong>Status:</strong> {t.status}</p>
                          <p><strong>Remark:</strong> {t.remark}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(t.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}