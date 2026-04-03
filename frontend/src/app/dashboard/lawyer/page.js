"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../../src/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LawyerDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "LAWYER") {
      router.push("/login");
      return;
    }

    fetchCases(token);
  }, [router]);

  const fetchCases = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/challans/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Cases Error:", error);
      setCases([]);
    }
  };

  const updateStatus = async (id) => {
    const token = localStorage.getItem("token");
    const { status, remark } = statusUpdates[id] || {};

    if (!status) {
      alert("Select status");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/challans/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challan_id: id,
          status,
          remark,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      alert("Status updated");
      fetchCases(token);
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Server error");
    }
  };

  return (
    <ProtectedRoute allowedRole="LAWYER">
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Lawyer Dashboard</h1>

        {cases.length === 0 ? (
          <p>No assigned cases.</p>
        ) : (
          cases.map((c) => (
            <div key={c.id} className="bg-white p-4 mb-4 rounded shadow">
              <p><strong>Challan:</strong> {c.challan_number}</p>
              <p><strong>Status:</strong> {c.status}</p>

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
                onChange={(e) =>
                  setStatusUpdates({
                    ...statusUpdates,
                    [c.id]: {
                      ...statusUpdates[c.id],
                      status: e.target.value,
                    },
                  })
                }
                className="border p-2 mr-2 mt-2"
              >
                <option value="">Select Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SETTLED">Settled</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <input
                type="text"
                placeholder="Remark"
                onChange={(e) =>
                  setStatusUpdates({
                    ...statusUpdates,
                    [c.id]: {
                      ...statusUpdates[c.id],
                      remark: e.target.value,
                    },
                  })
                }
                className="border p-2 mr-2 mt-2"
              />

              <button
                onClick={() => updateStatus(c.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Update
              </button>
            </div>
          ))
        )}
      </div>
    </ProtectedRoute>
  );
}