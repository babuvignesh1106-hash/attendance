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

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "https://attendance-nine-beryl.vercel.app/auth/login",
        {
          email: data.Email,
          password: data.Password,
        }
      );
      return res.data; // { access_token, user: { id, email, name, password } }
    },
    onSuccess: (data) => {
      // Store token and user info
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);

      setDialog({ isOpen: true, message: "Login successful!" });
      setFormData({ Email: "", Password: "" });
      setTimeout(() => navigate("/dashboard"), 1000);
    },
    onError: () =>
      setDialog({ isOpen: true, message: "Login failed. Please try again." }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
