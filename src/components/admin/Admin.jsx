import AdminForm from "../../components/admin/AdminForm";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        Admin Dashboard
      </h1>

      <AdminForm />
    </div>
  );
}
