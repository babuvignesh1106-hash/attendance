import { useEffect, useState } from "react";
import Logo from "../assets/logo.png";

export default function EmployeeDetails() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get name and email from localStorage after login
    const storedName = localStorage.getItem("name") || "Employee";
    const storedEmail = localStorage.getItem("email") || "example@mail.com";

    setName(storedName);
    setEmail(storedEmail);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start h-full w-full py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-blue-600 tracking-wide mb-6">
        Employee Details
      </h2>

      {/* Profile Image */}
      <div className="w-50 h-50 rounded-full bg-[#0b2c5d] flex justify-center items-center mb-6 shadow-md">
        <img
          src={Logo}
          alt="Company Logo"
          className="w-50 h-50 object-contain rounded-full"
        />
      </div>

      {/* Employee Info */}
      <div className="text-left w-full max-w-lg px-4 space-y-2 text-xl leading-relaxed">
        <p>
          <span className="font-bold">Name:</span> {name}
        </p>
        <p>
          <span className="font-bold">Email:</span> {email}
        </p>
        <p>
          <span className="font-bold">Role:</span> Software Engineer
        </p>
        <p>
          <span className="font-bold">Employee ID:</span> EMP123
        </p>
      </div>
    </div>
  );
}
