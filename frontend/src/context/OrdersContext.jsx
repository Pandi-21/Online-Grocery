// import { createContext, useContext, useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import {
//   getAllOrders,
//   getOrderById,
//   updateOrderStatus
// } from "../admin/api/ordersService";

// const OrdersContext = createContext();

// export function useOrders() {
//   return useContext(OrdersContext);
// }

// export function OrdersProvider({ children }) {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await getAllOrders();
//       setOrders(data);
//     } catch (err) {
//       console.error("Fetch orders failed:", err);
//       toast.error("Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get single order (by id)
//   const fetchOrder = async (orderId) => {
//     try {
//       const order = await getOrderById(orderId);
//       return order;
//     } catch (err) {
//       console.error("Fetch order failed:", err);
//       toast.error("Failed to fetch order");
//       return null;
//     }
//   };

//   // Update status
//   const changeOrderStatus = async (orderId, status) => {
//     try {
//       const updatedStatus = await updateOrderStatus(orderId, status.toLowerCase());
//       setOrders((prev) =>
//         prev.map((o) => (o._id === orderId ? { ...o, status: updatedStatus } : o))
//       );
//       toast.success("✅ Status updated");
//       return updatedStatus;
//     } catch (err) {
//       console.error("Update status failed:", err);
//       toast.error("❌ Failed to update status");
//       return null;
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <OrdersContext.Provider
//       value={{
//         orders,
//         loading,
//         fetchOrders,
//         fetchOrder,
//         changeOrderStatus
//       }}
//     >
//       {children}
//     </OrdersContext.Provider>
//   );
// }
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders
} from "../admin/api/ordersService";

const OrdersContext = createContext();
export const useOrders = () => useContext(OrdersContext);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders (admin)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async (userId) => {
    setLoading(true);
    try {
      const data = await getUserOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error("Fetch user orders failed:", err);
      toast.error("Failed to fetch user orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single order
  const fetchOrder = async (orderId) => {
    try {
      return await getOrderById(orderId);
    } catch {
      toast.error("Failed to fetch order");
      return null;
    }
  };

  // Update order status
  const changeOrderStatus = async (orderId, status) => {
    try {
      const updatedStatus = await updateOrderStatus(orderId, status.toLowerCase());
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: updatedStatus } : o))
      );
      toast.success("Status updated ✅");
      return updatedStatus;
    } catch {
      toast.error("Failed to update status ❌");
      return null;
    }
  };

  useEffect(() => {
    fetchOrders(); // default: admin view
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        fetchUserOrders,
        fetchOrder,
        changeOrderStatus
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
