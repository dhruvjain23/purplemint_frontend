import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({ name: "", shift_hours: "", past_week_hours: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch("https://purple-mint-assessment-xyo1.vercel.app/api/driver/drivers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error("Error fetching drivers:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const past_week_hours = formData.past_week_hours.split("|").map(Number);
    if (past_week_hours.length !== 7 || past_week_hours.some(isNaN)) {
      alert("Past week hours must be 7 numbers separated by |");
      return;
    }
    const body = {
      name: formData.name,
      shift_hours: Number(formData.shift_hours),
      past_week_hours,
    };
    const url = editingId ? `/updateDrivers/${editingId}` : "/registerDriver";
    const method = editingId ? "PUT" : "POST";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app/api/driver${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await fetchDrivers();
      setFormData({ name: "", shift_hours: "", past_week_hours: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting driver:", err.message);
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      shift_hours: driver.shift_hours,
      past_week_hours: driver.past_week_hours.join("|"),
    });
    setEditingId(driver._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      const res = await fetch(`https://purple-mint-assessment-xyo1.vercel.app/api/driver/deleteDriver/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await fetchDrivers();
    } catch (err) {
      console.error("Error deleting driver:", err.message);
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <div className="p-4 w-2/3 overflow-hidden">
          <h1 className="text-2xl font-bold mb-4">Manage Drivers</h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="number"
              placeholder="Shift Hours"
              value={formData.shift_hours}
              onChange={(e) => setFormData({ ...formData, shift_hours: e.target.value })}
              className="border dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              placeholder="Past Week Hours (e.g., 6|8|7|7|7|6|10)"
              value={formData.past_week_hours}
              onChange={(e) => setFormData({ ...formData, past_week_hours: e.target.value })}
              className="border dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              {editingId ? "Update Driver" : "Add Driver"}
            </button>
          </form>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Shift Hours</th>
                  <th className="p-2 text-left">Past Week Hours</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className="border-b dark:border-gray-700">
                    <td className="p-2">{driver.name}</td>
                    <td className="p-2">{driver.shift_hours}</td>
                    <td className="p-2">{driver.past_week_hours.join("|")}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(driver._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
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
