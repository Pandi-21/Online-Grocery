// import { useOrders } from "../../context/OrdersContext";
// import { useNavigate } from "react-router-dom";

// export default function AdminOrders() {
//   const { orders, loading } = useOrders();
//   const navigate = useNavigate();

//   if (loading) return <p className="text-center text-gray-500">Loading orders...</p>;
//   if (!orders.length) return <p className="text-center text-gray-500">No orders found.</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">All Orders</h1>
//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-300 rounded-lg shadow-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Phone</th>
//               <th className="px-4 py-2 border">Date &amp; Time</th>
//               <th className="px-4 py-2 border">Status</th>
//               <th className="px-4 py-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id} className="hover:bg-gray-50 text-center">
//                 <td className="px-4 py-2 border">{order.delivery_address.name || "Unknown"}</td>
//                 <td className="px-4 py-2 border">{order.delivery_address.phone || "N/A"}</td>
//                 <td className="px-4 py-2 border">
//                   {new Date(order.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
//                 </td>
//                 <td className="px-4 py-2 border">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       order.status.toLowerCase() === "delivered"
//                         ? "bg-green-100 text-green-700"
//                         : order.status.toLowerCase() === "cancelled"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2 border">
//                   <button
//                     onClick={() => navigate(`/admin/orders/${order._id}`)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition duration-200"
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useOrders } from "../../context/OrdersContext";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const { orders, loading } = useOrders();
  const navigate = useNavigate();

  if (loading) return <p className="text-center text-gray-500">Loading orders...</p>;
  if (!orders.length) return <p className="text-center text-gray-500">No orders found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Date &amp; Time</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 text-center">
                <td className="px-4 py-2 border">{order.delivery_address.name || "Unknown"}</td>
                <td className="px-4 py-2 border">{order.delivery_address.phone || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {new Date(order.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status.toLowerCase() === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition duration-200"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
