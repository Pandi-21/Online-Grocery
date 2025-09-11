import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* left menu */}
      <Sidebar />

      {/* right content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        {/* header bar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <button className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </header>

        {/* main page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
