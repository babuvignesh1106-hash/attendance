import React, { useState } from "react";
import AdminForm from "../admin/AdminForm";
import AdminDashboard from "../admin/AdminDashboard";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <AdminForm onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
      )}
    </>
  );
}
