// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// const BASE_URL = "http://localhost:5000/orders";

// export default function OrdersPage() {
//   const { user } = useAuth();
//   const { addToCart } = useCart();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // ✅ Fetch orders
//   useEffect(() => {
//     if (user?._id) {
//       axios
//         .get(`${BASE_URL}/user/${user._id}`)
//         .then((res) => setOrders(res.data))
//         .catch((err) => {
//           console.error("Error fetching orders:", err);
//           toast.error("Failed to load orders");
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   // ✅ Reorder
//   const handleReorder = (order) => {
//     if (!order || !order.items) return;

//     order.items.forEach((item) => {
//       addToCart({
//         productId: item.product_id || item._id,
//         product_name: item.product_name || "Unnamed Product",
//         price: item.price,
//         quantity: item.quantity,
//       });
//     });

//     toast.success("Items added back to cart!");
//     setSelectedOrder(null);
//   };

//   // ✅ Cancel order
//   const handleCancelOrder = async (orderId) => {
//     try {
//       await axios.put(`${BASE_URL}/${orderId}/status`, { status: "cancelled" });
//       setOrders((prev) =>
//         prev.map((o) =>
//           o._id === orderId ? { ...o, status: "cancelled" } : o
//         )
//       );
//       setSelectedOrder((prev) => ({ ...prev, status: "cancelled" }));
//       toast.success("Order cancelled successfully!");
//     } catch (err) {
//       console.error("Error cancelling order:", err);
//       toast.error("Failed to cancel order.");
//     }
//   };

//   if (loading) return <p className="p-6">Loading orders...</p>;
//   if (!orders || orders.length === 0)
//     return <p className="p-6">You have no orders yet.</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

//       {/* ✅ Orders List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="border rounded-xl p-4 shadow hover:shadow-lg transition"
//           >
//             <p>
//               <strong>Order ID:</strong> {order._id}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(order.created_at).toLocaleString()}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 className={`font-semibold ${
//                   order.status === "pending"
//                     ? "text-yellow-600"
//                     : order.status === "delivered"
//                     ? "text-green-600"
//                     : order.status === "cancelled"
//                     ? "text-red-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 {order.status}
//               </span>
//             </p>
//             <p>
//               <strong>Total:</strong> ₹{order.total}
//             </p>
//             <button
//               className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//               onClick={() => setSelectedOrder(order)}
//             >
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* ✅ Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl p-6 w-11/12 max-w-lg relative">
//             <button
//               className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
//               onClick={() => setSelectedOrder(null)}
//             >
//               ×
//             </button>

//             <h3 className="text-xl font-bold mb-4">Order Details</h3>
//             <p>
//               <strong>Order ID:</strong> {selectedOrder._id}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(selectedOrder.created_at).toLocaleString()}
//             </p>
//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 className={`font-semibold ${
//                   selectedOrder.status === "pending"
//                     ? "text-yellow-600"
//                     : selectedOrder.status === "delivered"
//                     ? "text-green-600"
//                     : selectedOrder.status === "cancelled"
//                     ? "text-red-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 {selectedOrder.status}
//               </span>
//             </p>
//             <p>
//               <strong>Total:</strong> ₹{selectedOrder.total}
//             </p>

//             <div className="mt-3">
//               <strong>Items:</strong>
//               <ul className="list-disc list-inside">
//                 {selectedOrder.items.map((item, idx) => (
//                   <li key={idx}>
//                     {item.product_name || "Unnamed Product"} × {item.quantity} – ₹
//                     {item.price}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {selectedOrder.delivery_address && (
//               <div className="mt-3">
//                 <strong>Delivery Address:</strong>
//                 <p>
//                   {selectedOrder.delivery_address.name},{" "}
//                   {selectedOrder.delivery_address.address},{" "}
//                   {selectedOrder.delivery_address.city},{" "}
//                   {selectedOrder.delivery_address.state} -{" "}
//                   {selectedOrder.delivery_address.zip}
//                 </p>
//                 <p>Phone: {selectedOrder.delivery_address.phone}</p>
//               </div>
//             )}

//             {/* ✅ Buttons */}
//             <div className="mt-4 flex justify-end gap-2 flex-wrap">
//               {selectedOrder.status === "pending" && (
//                 <button
//                   className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                   onClick={() => handleCancelOrder(selectedOrder._id)}
//                 >
//                   Cancel Order
//                 </button>
//               )}

//               {(selectedOrder.status === "delivered" ||
//                 selectedOrder.status === "cancelled") && (
//                 <button
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                   onClick={() => handleReorder(selectedOrder)}
//                 >
//                   Reorder
//                 </button>
//               )}

//               <button
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//                 onClick={() => setSelectedOrder(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { orders, loading, fetchUserOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user?._id) fetchUserOrders(user._id);
  }, [user]);

  // Reorder items
  const handleReorder = (order) => {
    if (!order?.items) return;

    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.product_id,
          name: item.product_name,
          price: item.price,
          images: item.images || [],
        },
        item.quantity
      );
    });

    toast.success("Items added to cart!");
    setSelectedOrder(null);
  };

  // Cancel order
  const handleCancelOrder = async (order) => {
    if (!order?._id) return;
    await fetchUserOrders(user._id); // reload orders after cancel
    toast.success("Order cancelled!");
  };

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (!orders?.length) return <p className="p-6">You have no orders yet.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.status === "pending"
                    ? "text-yellow-600"
                    : order.status === "delivered"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setSelectedOrder(order)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-lg"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`font-semibold ${
                selectedOrder.status === "pending"
                  ? "text-yellow-600"
                  : selectedOrder.status === "delivered"
                  ? "text-green-600"
                  : selectedOrder.status === "cancelled"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}>
                {selectedOrder.status}
              </span>
            </p>
            <p><strong>Total:</strong> ₹{selectedOrder.total}</p>

            <div className="mt-3">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product_name} × {item.quantity} – ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>

            {selectedOrder.delivery_address && (
              <div className="mt-3">
                <strong>Delivery Address:</strong>
                <p>
                  {selectedOrder.delivery_address.name},{" "}
                  {selectedOrder.delivery_address.address},{" "}
                  {selectedOrder.delivery_address.city},{" "}
                  {selectedOrder.delivery_address.state} -{" "}
                  {selectedOrder.delivery_address.zip}
                </p>
                <p>Phone: {selectedOrder.delivery_address.phone}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2 flex-wrap">
              {selectedOrder.status === "pending" && (
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={() => handleCancelOrder(selectedOrder)}
                >
                  Cancel Order
                </button>
              )}
              {(selectedOrder.status === "delivered" || selectedOrder.status === "cancelled") && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => handleReorder(selectedOrder)}
                >
                  Reorder
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
