import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import DialogBox from "./DialogBox";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [dialog, setDialog] = useState({ isOpen: false, message: "" });

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // ✅ Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "https://attendance-backend-bqhw.vercel.app/auth/login", // 🔁 Use your local backend for testing
        {
          email: data.Email,
          password: data.Password,
        }
      );
      return res.data; // { access_token, user: { ... } }
    },

    onSuccess: (data) => {
      const user = data.user;
      console.log("✅ User Data:", user);

      // ✅ Save all necessary fields in localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("id", user.id);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role || "employee");
      localStorage.setItem("designation", user.designation || ""); // ✅ store designation
      localStorage.setItem("employeeId", user.employeeId || ""); // ✅ store employeeId

      // ✅ Dialog + redirect
      setDialog({ isOpen: true, message: "Login successful!" });
      setFormData({ Email: "", Password: "" });
      setTimeout(() => navigate("/dashboard"), 1000);
    },

    onError: (error) => {
      console.error("❌ Login failed:", error);
      setDialog({ isOpen: true, message: "Login failed. Please try again." });
    },
  });

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <>
      <LoginForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
      <DialogBox
        isOpen={dialog.isOpen}
        message={dialog.message}
        onClose={() => setDialog({ isOpen: false, message: "" })}
      />
    </>
  );
}
