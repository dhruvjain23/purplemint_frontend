import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ order_id: "", value_rs: "", route_id: "", delivery_time: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch("https://purple-mint-assessment-xyo1.vercel.app/api/order/getAllOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{2}:\d{2}$/.test(formData.delivery_time)) {
      alert("Delivery time must be in HH:MM format");
      return;
    }
    const body = {
      order_id: Number(formData.order_id),
      value_rs: Number(formData.value_rs),
      route_id: Number(formData.route_id),
      delivery_time: formData.delivery_time,
    };
    const url = editingId ? `/api/order/${editingId}` : "/api/order/addOrder";
    const method = editingId ? "PUT" : "POST";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchOrders();
      setFormData({ order_id: "", value_rs: "", route_id: "", delivery_time: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting order:", err.message);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      order_id: order.order_id,
      value_rs: order.value_rs,
      route_id: order.route_id,
      delivery_time: order.delivery_time,
    });
    setEditingId(order._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app/api/order/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="p-4 w-2/3 overflow-hidden">
          <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-col gap-4">
            <input
              type="number"
              placeholder="Order ID"
              value={formData.order_id}
              onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Value (₹)"
              value={formData.value_rs}
              onChange={(e) => setFormData({ ...formData, value_rs: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Route ID"
              value={formData.route_id}
              onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Delivery Time (HH:MM)"
              value={formData.delivery_time}
              onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {editingId ? "Update Order" : "Add Order"}
            </button>
          </form>
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Value (₹)</th>
                  <th className="p-2 text-left">Route ID</th>
                  <th className="p-2 text-left">Delivery Time</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order.order_id}</td>
                    <td className="p-2">{order.value_rs}</td>
                    <td className="p-2">{order.route_id}</td>
                    <td className="p-2">{order.delivery_time}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-yellow-500 text-white p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}