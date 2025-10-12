import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/user";

export default function AccountPage() {
  const { logout } = useAuth();
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

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Fetch user data
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/update/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
  };

  // Send Email
  const sendEmailNotification = async () => {
    if (!token) return toast.error("User not authenticated");
    try {
      const res = await axios.post(
        `${BASE_URL}/send-email`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.error || "Failed to send email");
    }
  };

  // Send SMS
  const sendSmsNotification = async () => {
    if (!token) return toast.error("User not authenticated");
    if (!formData.phone || !formData.phone.startsWith("+")) {
      return toast.error("Phone number missing or invalid (+countrycode).");
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/send-sms`,
        { phone: formData.phone },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.error || "Failed to send SMS");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">My Account</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} className="w-full p-2 border rounded" />

        <div className="flex items-center gap-4">
          <label>
            <input type="checkbox" name="smsNotifications" checked={formData.smsNotifications} onChange={handleChange} /> SMS Notifications
          </label>
          <label>
            <input type="checkbox" name="emailUpdates" checked={formData.emailUpdates} onChange={handleChange} /> Email Updates
          </label>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Update Profile</button>
      </form>

      <div className="flex justify-between mt-6">
        <button onClick={sendEmailNotification} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Send Email</button>
        <button onClick={sendSmsNotification} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Send SMS</button>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Logout</button>
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Back</button>
      </div>
    </div>
  );
}
