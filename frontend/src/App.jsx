
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Monitor, Search, Plus, Pencil,
  Trash2, RefreshCw, X, Package, AlertCircle
} from "lucide-react";
import "./App.css";

const API_URL = "https://device-management-backend-v12d.onrender.com/api/devices";

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    deviceId: "",
    name: "",
    deviceType: "",
    room: "",
    brand: "",
    model: "",
    quantity: 1,
    status: "Đang sử dụng",
    description: ""
  };

  const [form, setForm] = useState(emptyForm);

  const loadDevices = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}?search=${encodeURIComponent(search)}`
      );

      if (!response.ok) throw new Error("Cannot load devices");

      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError("Không thể tải dữ liệu. Hãy kiểm tra Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      loadDevices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setForm({
      deviceId: device.deviceId || "",
      name: device.name || "",
      deviceType: device.deviceType || "",
      room: device.room || "",
      brand: device.brand || "",
      model: device.model || "",
      quantity: device.quantity ?? 1,
      status: device.status || "Đang sử dụng",
      description: device.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thiết bị này?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");

      loadDevices();
    } catch (err) {
      alert("Không thể xóa thiết bị.");
    }
  };

  const total = devices.length;
  const totalQuantity = devices.reduce(
    (sum, item) => sum + Number(item.quantity || 0), 0
  );
  const broken = devices.filter(
    (item) => item.status === "Hư hỏng"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <Monitor size={28} />
          <span>DeviceManager</span>
        </div>

        <div className="menu active">
          <LayoutDashboard size={19} />
          <span>Tổng quan</span>
        </div>

        <div className="menu">
          <Package size={19} />
          <span>Quản lý thiết bị</span>
        </div>

        <div className="sidebar-footer">
          CLOUD COMPUTING PROJECT
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>Quản lý thiết bị</h2>
            <p>Hệ thống quản lý thiết bị phòng học</p>
          </div>
          <div className="user">
            <div className="avatar">D</div>
            <span>Administrator</span>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <h1>Tổng quan hệ thống</h1>
              <p>Theo dõi và quản lý thiết bị phòng học</p>
            </div>
            <button className="primary-btn" onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}>
              <Plus size={18} /> Thêm thiết bị
            </button>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-icon blue"><Monitor /></div>
              <p>Tổng số thiết bị</p>
              <h2>{total}</h2>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><Package /></div>
              <p>Tổng số lượng</p>
              <h2>{totalQuantity}</h2>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange"><AlertCircle /></div>
              <p>Thiết bị hư hỏng</p>
              <h2>{broken}</h2>
            </div>
          </div>

          <section className="table-card">
            <div className="table-heading">
              <div>
                <h3>Danh sách thiết bị</h3>
                <p>Thông tin thiết bị trong các phòng học</p>
              </div>

              <div className="actions">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    placeholder="Tìm kiếm thiết bị..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="refresh-btn" onClick={loadDevices}>
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Phòng</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7">Đang tải dữ liệu...</td></tr>
                  ) : devices.length === 0 ? (
                    <tr><td colSpan="7">Không có thiết bị nào.</td></tr>
                  ) : devices.map((device) => (
                    <tr key={device._id}>
                      <td className="device-id">{device.deviceId}</td>
                      <td>{device.name}</td>
                      <td>{device.deviceType}</td>
                      <td>{device.room}</td>
                      <td>{device.quantity}</td>
                      <td>
                        <span className="status">
                          {device.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="edit-btn"
                            onClick={() => handleEdit(device)}>
                            <Pencil size={16} />
                          </button>
                          <button className="delete-btn"
                            onClick={() => handleDelete(device._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Cập nhật thiết bị" : "Thêm thiết bị"}</h2>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {[
                  ["deviceId", "Mã thiết bị"],
                  ["name", "Tên thiết bị"],
                  ["deviceType", "Loại thiết bị"],
                  ["room", "Phòng học"],
                  ["brand", "Thương hiệu"],
                  ["model", "Model"],
                  ["quantity", "Số lượng"]
                ].map(([name, label]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      type={name === "quantity" ? "number" : "text"}
                      min={name === "quantity" ? "0" : undefined}
                      required={["deviceId", "name", "deviceType", "room", "quantity"].includes(name)}
                      value={form[name]}
                      onChange={handleChange}
                    />
                  </label>
                ))}

                <label>
                  Trạng thái
                  <select name="status" value={form.status}
                    onChange={handleChange}>
                    <option>Đang sử dụng</option>
                    <option>Hư hỏng</option>
                    <option>Đang sửa chữa</option>
                    <option>Ngừng sử dụng</option>
                  </select>
                </label>

                <label className="full">
                  Mô tả
                  <textarea name="description"
                    value={form.description}
                    onChange={handleChange} />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn"
                  onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary-btn">
                  Lưu thiết bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
