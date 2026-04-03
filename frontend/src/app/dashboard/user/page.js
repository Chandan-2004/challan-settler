"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../../src/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    challan_number: "",
    vehicle_number: "",
    document: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !storedUser || storedUser.role !== "USER") {
      router.push("/login");
      return;
    }

    setUser(storedUser);
    fetchChallans(token);
  }, [router]);

  const fetchChallans = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/challans/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setChallans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Challans Error:", error);
      setChallans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "document") {
      setForm({ ...form, document: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.document) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("challan_number", form.challan_number);
    formData.append("vehicle_number", form.vehicle_number);
    formData.append("document", form.document);

    try {
      const res = await fetch(`${API_URL}/api/challans`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      alert("Challan uploaded successfully");

      setForm({
        challan_number: "",
        vehicle_number: "",
        document: null,
      });

      const fileInput = document.querySelector('input[name="document"]');
      if (fileInput) fileInput.value = "";

      fetchChallans(token);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Server error");
    }
  };

  return (
    <ProtectedRoute allowedRole="USER">
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">User Dashboard</h1>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}</h2>
            <h3 className="text-xl font-bold mb-3">Upload Challan</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="challan_number"
                placeholder="Challan Number"
                className="w-full mb-3 p-3 border rounded-lg"
                value={form.challan_number}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="vehicle_number"
                placeholder="Vehicle Number"
                className="w-full mb-3 p-3 border rounded-lg"
                value={form.vehicle_number}
                onChange={handleChange}
                required
              />

              <input
                type="file"
                name="document"
                className="w-full mb-4 p-2 border rounded-lg"
                onChange={handleChange}
                required
              />

              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Upload Challan
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">My Challans</h3>

            {loading ? (
              <p>Loading...</p>
            ) : challans.length === 0 ? (
              <p>No challans uploaded yet.</p>
            ) : (
              challans.map((c) => (
                <div key={c.id} className="border p-4 mb-3 rounded">
                  <p><strong>Challan:</strong> {c.challan_number}</p>
                  <p><strong>Vehicle:</strong> {c.vehicle_number}</p>
                  <p><strong>Status:</strong> {c.status}</p>
                  {c.document_path && (
                    <div className="mt-2">
                      <a
                        href={`${API_URL}/uploads/${c.document_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mr-3"
                      >
                        View
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}