import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:5000/user";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    smsNotifications: true,
    emailUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch user data on mount
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          ...formData,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          zip: res.data.zip || "",
          smsNotifications: res.data.smsNotifications ?? true,
          emailUpdates: res.data.emailUpdates ?? false,
        });
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(`${BASE_URL}/update/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(res.data.message || "Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          value={formData.zip}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div className="flex items-center gap-4">
          <label>
            <input
              type="checkbox"
              name="smsNotifications"
              checked={formData.smsNotifications}
              onChange={handleChange}
            />{" "}
            SMS Notifications
          </label>
          <label>
            <input
              type="checkbox"
              name="emailUpdates"
              checked={formData.emailUpdates}
              onChange={handleChange}
            />{" "}
            Email Updates
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Update Profile
        </button>
      </form>

      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
