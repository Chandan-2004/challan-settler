"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://challan-settler.onrender.com";

export default function UserDashboard() {
  const [form, setForm] = useState({
    challan_number: "",
    vehicle_number: "",
  });

  const [file, setFile] = useState(null);
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch challans
  const fetchChallans = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/challans/my`, {
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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token"); 
    try {
      const formData = new FormData();
      formData.append("challan_number", form.challan_number);
      formData.append("vehicle_number", form.vehicle_number);
      if (file) formData.append("document", file);

      const res = await fetch(`${API_URL}/api/challans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      toast.success("Challan uploaded successfully");

      setForm({ challan_number: "", vehicle_number: "" });
      setFile(null);
      fetchChallans();
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
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
  const total = challans.length;
const submitted = challans.filter(c => c.status === "SUBMITTED").length;
const assigned = challans.filter(c => c.status === "ASSIGNED").length;
const completed = challans.filter(c => c.status === "COMPLETED").length;
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          User Dashboard
        </h1>
        {/* Stats Cards */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
  <div className="bg-white p-5 rounded-2xl shadow">
    <p className="text-gray-500">Total</p>
    <h2 className="text-2xl font-bold">{total}</h2>
  </div>

  <div className="bg-yellow-50 p-5 rounded-2xl shadow">
    <p className="text-yellow-700">Submitted</p>
    <h2 className="text-2xl font-bold">{submitted}</h2>
  </div>

  <div className="bg-blue-50 p-5 rounded-2xl shadow">
    <p className="text-blue-700">Assigned</p>
    <h2 className="text-2xl font-bold">{assigned}</h2>
  </div>

  <div className="bg-green-50 p-5 rounded-2xl shadow">
    <p className="text-green-700">Completed</p>
    <h2 className="text-2xl font-bold">{completed}</h2>
  </div>
</div>
        {/* Upload Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Upload New Challan
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="challan_number"
              placeholder="Challan Number"
              className="p-3 border rounded-xl"
              value={form.challan_number}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="vehicle_number"
              placeholder="Vehicle Number"
              className="p-3 border rounded-xl"
              value={form.vehicle_number}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              className="p-3 border rounded-xl"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Uploading..." : "Upload Challan"}
            </button>
          </form>
        </div>

        {/* Challan Table */}
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">My Challans</h2>

          {challans.length === 0 ? (
            <p className="text-gray-500">No challans uploaded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-3">Challan</th>
                    <th className="py-3">Vehicle</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Document</th>
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
                          <div className="flex gap-3">
                            <a
                              href={c.document_path}
                              target="_blank"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                            <a
                              href={c.document_path}
                              download
                              className="text-green-600 hover:underline"
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          "No file"
                        )}
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