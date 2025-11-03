import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignupForm from "../pages/SignupForm";
import DialogBox from "../pages/Login/DialogBox";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
  });
  const [dialog, setDialog] = useState({ isOpen: false, message: "" });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(
        "https://attendance-backend-bqhw.vercel.app/auth/signup",
        {
          name: data.Name,
          email: data.Email,
          password: data.Password,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setDialog({ isOpen: true, message: "Signup successful! Redirecting..." });
      setTimeout(() => navigate("/"), 1000);
    },
    onError: () =>
      setDialog({ isOpen: true, message: "Signup failed. Please try again." }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <>
      <SignupForm
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
