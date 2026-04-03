"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (allowedRole && user.role !== allowedRole) {
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [router, allowedRole]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  return children;
}