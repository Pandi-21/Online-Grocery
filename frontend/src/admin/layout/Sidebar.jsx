import React from "react";
import { NavLink } from "react-router-dom";
import {LayoutDashboard,Package,List,ShoppingCart,Users,TicketPercent,BarChart3,
} from "lucide-react"; // install: npm i lucide-react

export default function Sidebar() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
     
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
     
    { to: "/admin/coupons", label: "Coupons", icon: TicketPercent },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
