import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:8000/team";

export default function AdminForm() {
  const [formData, setFormData] = useState({
    teamName: "",
    members: [""], // simpler structure: just names
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newTeam) => {
      const res = await axios.post(API_URL, newTeam);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teams"]);
      alert("✅ Team created successfully!");
      setFormData({ teamName: "", members: [""] });
    },
    onError: (err) => {
      console.error("❌ Error creating team:", err);
      alert("Failed to create team. Check console for details.");
    },
  });

  const handleMemberChange = (index, value) => {
    const updated = [...formData.members];
    updated[index] = value;
    setFormData({ ...formData, members: updated });
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, ""],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.teamName.trim()) {
      alert("Team name is required");
      return;
    }

    const payload = {
      name: formData.teamName.trim(),
      members: formData.members
        .filter((m) => m.trim() !== "")
        .map((m) => ({ name: m.trim() })), // ✅ send proper object array
    };

    console.log("Sending payload:", payload);
    mutation.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 capitalize">
        Add New Team
      </h2>

      {/* Team Name */}
      <div className="mb-5">
        <label className="block mb-2 font-medium text-gray-600">
          Team Name
        </label>
        <input
          type="text"
          name="teamName"
          value={formData.teamName}
          onChange={(e) =>
            setFormData({ ...formData, teamName: e.target.value })
          }
          required
          placeholder="Enter team name"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-600">
          Team Members
        </label>
        {formData.members.map((member, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              placeholder={`Member ${index + 1}`}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMember}
          className="text-blue-600 text-sm font-medium mt-1 hover:underline"
        >
          + Add another member
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-300"
      >
        Save Team
      </button>
    </form>
  );
}
