import React from "react";
import { Outlet } from "react-router-dom"; // <-- import Outlet
import Header from "../Components/Headers/Header";
import Footer from "../Components/Footer";

export default function UserLayout() {
  return (
    <div className="font-sans text-gray-800">
      <Header />
      <main>
        <Outlet /> {/* <-- Render nested routes here */}
      </main>
      <Footer />
    </div>
  );
}
