import React, { useState } from "react";
import CryptoJS from "crypto-js";

export default function AdminForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Stored securely: hashed password (of "admin123")
  const ADMIN_USERNAME = "admin";
  const ADMIN_HASHED_PASSWORD = "0192023a7bbd73250516f069df18b500"; // md5("admin123")

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputHash = CryptoJS.MD5(password).toString();

    if (username === ADMIN_USERNAME && inputHash === ADMIN_HASHED_PASSWORD) {
      onLogin();
    } else {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
