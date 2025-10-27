import { LABELS } from "../../constants";
import logo from "../../../src/assets/logo.png";

export default function LoginForm({ handleChange, handleSubmit, formData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6"
      >
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-28 w-auto" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LABELS.EMAIL}
          </label>
          <input
            type="email"
            name="Email"
            placeholder="you@example.com"
            onChange={handleChange}
            value={formData.Email}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LABELS.PASSWORD}
          </label>
          <input
            type="password"
            name="Password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.Password}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
