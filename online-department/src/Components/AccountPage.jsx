import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Example: remove token/localStorage
    localStorage.removeItem("userToken");
    navigate("/"); // redirect to home or login
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      {/* Personal Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" defaultValue="John Doe" />
          <input
            className="border p-2 rounded"
            defaultValue="john.doe@example.com"
          />
        </div>
        <input
          className="border p-2 rounded w-full mt-4"
          placeholder="Phone Number"
        />
      </div>

      {/* Shipping */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Shipping Address</h2>
        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Street Address"
        />
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="City" />
          <input className="border p-2 rounded" placeholder="State" />
        </div>
        <input
          className="border p-2 rounded w-full mt-3"
          placeholder="Zip / Postal Code"
        />
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked /> Receive email updates
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" /> Receive SMS notifications
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Save Changes
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
