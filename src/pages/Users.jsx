import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [planType, setPlanType] = useState("3TIME");
  const [vegType, setVegType] = useState("VEG");
  const [days, setDays] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Load failed");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

   const renew = async () => {
    try {
      if (!selectedUser) return;
      if (selectedUser.subscription) {
        await axios.post(`${import.meta.env.VITE_API_URL}/subscriptions/renew`, {
          userId: selectedUser._id, planType, vegType, days,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/subscriptions`, {
          userId: selectedUser._id, planType, vegType,
          startDate: new Date(),
          endDate: new Date(Date.now() + Number(days) * 24 * 60 * 60 * 1000),
        });
      }
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  return (
    <div style={{ 
      minHeight: "100vh", backgroundColor: "#f8fafc", padding: "40px 24px",
      fontFamily: "system-ui, -apple-system, sans-serif" 
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .modal-animate { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .user-row:hover { background-color: #f1f5f9 !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.04em" }}>User Directory</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>Manage subscriptions and QR access</p>
          </div>
          
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "12px 16px", borderRadius: "14px", border: "1px solid #e2e8f0",
                width: "280px", outline: "none", fontSize: "0.95rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div style={{ 
          backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)", overflow: "hidden" 
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={headerStyle}>USER DETAILS</th>
                  <th style={headerStyle}>SUBSCRIPTION</th>
                  <th style={headerStyle}>BALANCE</th>
                  <th style={headerStyle}>END DATE</th>
                  <th style={headerStyle}>STATUS</th>
                  <th style={headerStyle}>QR ACCESS</th>
                  <th style={headerStyle}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const sub = u.subscription;
                  const isActive = sub?.status === "ACTIVE";
                  return (
                    <tr key={u._id} className="user-row" style={{ borderBottom: "1px solid #f1f5f9", transition: "0.2s" }}>
                      <td style={cellStyle}>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{u.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{u.phone}</div>
                      </td>
                      <td style={cellStyle}>
                        {sub ? <span style={subInfoStyle}>{sub.planType} • {sub.vegType}</span> : "-"}
                      </td>
                      <td style={cellStyle}>
                        {sub ? <span style={{ fontWeight: "700", color: "#3b82f6" }}>{sub.totalMeals - sub.usedMeals}</span> : "-"}
                      </td>
                      <td style={cellStyle}>
                        {sub ? new Date(sub.endDate).toLocaleDateString() : "-"}
                      </td>
                      <td style={cellStyle}>
                        <span style={{ 
                          padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "800",
                          backgroundColor: isActive ? "#f0fdf4" : "#fef2f2",
                          color: isActive ? "#16a34a" : "#dc2626"
                        }}>
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={cellStyle}>
                        {isActive ? (
                          <a href={`http://localhost:5000/qr/${u._id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontWeight: "600", fontSize: "0.9rem" }}>
                            Download QR
                          </a>
                        ) : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Blocked</span>}
                      </td>
                      <td style={cellStyle}>
                        <button 
                          onClick={() => setSelectedUser(u)}
                          style={{ 
                            backgroundColor: "#1e293b", color: "#fff", border: "none", 
                            padding: "8px 16px", borderRadius: "10px", fontWeight: "600", cursor: "pointer" 
                          }}
                        >
                          {sub ? "Renew" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Renewal Modal */}
      {selectedUser && (
        <div style={{ 
          position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", 
          backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 
        }}>
          <div className="modal-animate" style={{ 
            backgroundColor: "#fff", padding: "40px", borderRadius: "32px", width: "100%", maxWidth: "400px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.15)"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
              {selectedUser.subscription ? "Renew Plan" : "New Subscription"}
            </h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>Configuring account for <b>{selectedUser.name}</b></p>

            <label style={labelStyle}>Plan Duration</label>
            <select value={planType} onChange={(e) => setPlanType(e.target.value)} style={inputStyle}>
              <option value="3TIME">3 Meals / Day</option>
              <option value="2TIME">2 Meals / Day</option>
              <option value="1TIME">1 Meal / Day</option>
            </select>

            <label style={labelStyle}>Dietary Preference</label>
            <select value={vegType} onChange={(e) => setVegType(e.target.value)} style={inputStyle}>
              <option value="VEG">Vegetarian</option>
              <option value="NON_VEG">Non-Vegetarian</option>
            </select>

            <label style={labelStyle}>Validity (Days)</label>
            <input type="number" value={days} onChange={(e) => setDays(e.target.value)} style={inputStyle} />

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button onClick={() => setSelectedUser(null)} style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "none", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
              <button onClick={renew} style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Confirm Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const headerStyle = { padding: "16px 20px", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", letterSpacing: "0.05em" };
const cellStyle = { padding: "20px", fontSize: "0.95rem" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px", outline: "none", fontSize: "1rem" };
const labelStyle = { display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", marginBottom: "6px", marginLeft: "4px" };

const subInfoStyle = { fontSize: "0.85rem", color: "#475569", fontWeight: "500" };
