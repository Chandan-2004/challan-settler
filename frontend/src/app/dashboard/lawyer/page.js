"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LawyerDashboard() {
  const [challans, setChallans] = useState([]);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchChallans = async () => {
    try {
      const res = await fetch(`${API_URL}/api/challans/assigned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setChallans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const updateStatus = async () => {
    if (!selectedId || !status) {
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
          challan_id: selectedId,
          status,
          remark,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Update failed");
        return;
      }

      toast.success("Status updated");
      setStatus("");
      setRemark("");
      setSelectedId(null);
      fetchChallans();
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
          Lawyer Dashboard
        </h1>

        {/* Challans Table */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-6">
            Assigned Challans
          </h2>

          {challans.length === 0 ? (
            <p className="text-gray-500">No assigned challans.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-3">Challan</th>
                    <th className="py-3">Vehicle</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Document</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {challans.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
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
                        <button
                          onClick={() => setSelectedId(c.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Status Card */}
        {selectedId && (
          <div className="bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Update Status
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <select
                className="p-3 border rounded-xl"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <input
                type="text"
                placeholder="Remark"
                className="p-3 border rounded-xl"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />

              <button
                onClick={updateStatus}
                className="bg-green-600 text-white rounded-xl px-4"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}