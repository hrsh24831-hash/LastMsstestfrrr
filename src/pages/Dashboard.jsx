import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard`),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/attendance`)
        ]);
        setStats(statsRes.data);
        setRecords(logsRes.data);
      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc", 
      padding: "40px 24px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .stagger-in { animation: fadeIn 0.5s ease-out forwards; }
        @media (max-width: 768px) { .grid-cols { grid-template-columns: 1fr 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.04em", margin: 0 }}>
            System <span style={{ color: "#3b82f6" }}>Overview</span>
          </h1>
          <p style={{ color: "#64748b", marginTop: "8px", fontWeight: "500" }}>Real-time statistics for today's services</p>
        </header>

        {/* Stats Grid */}
        <div className="grid-cols" style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "24px", 
          marginBottom: "40px" 
        }}>
          <StatCard title="Breakfast" value={stats.breakfast} icon="🍳" color="#f97316" />
          <StatCard title="Lunch" value={stats.lunch} icon="🍱" color="#10b981" />
          <StatCard title="Dinner" value={stats.dinner} icon="🍽️" color="#3b82f6" />
          <StatCard title="Total Today" value={stats.totalMeals} icon="📊" color="#6366f1" />
        </div>

        {/* Attendance Table Section */}
        <div style={{ 
          background: "#ffffff", 
          borderRadius: "32px", 
          padding: "32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "24px" 
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Recent Activity</h2>
            <button style={{ 
              backgroundColor: "#f1f5f9", border: "none", padding: "8px 16px", 
              borderRadius: "12px", color: "#64748b", fontWeight: "600", cursor: "pointer" 
            }}>View All</button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={thStyle}>TIMESTAMP</th>
                  <th style={thStyle}>NAME</th>
                  <th style={thStyle}>MEAL</th>
                  <th style={thStyle}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 10).map((r, i) => (
                  <tr key={r._id} style={{ borderTop: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ ...tdStyle, fontWeight: "600", color: "#0f172a" }}>{r.userId?.name || "Guest"}</td>
                    <td style={tdStyle}>{r.mealType}</td>
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: "6px 12px", borderRadius: "8px", fontSize: "0.75rem", 
                        fontWeight: "700", backgroundColor: "#f0fdf4", color: "#16a34a",
                        textTransform: "uppercase", letterSpacing: "0.05em"
                      }}>Verified</span>
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

function StatCard({ title, value, icon, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#ffffff",
        padding: "32px",
        borderRadius: "28px",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered ? "0 20px 25px -5px rgba(0,0,0,0.05)" : "0 4px 6px -1px rgba(0,0,0,0.02)",
        textAlign: "left"
      }}
    >
      <div style={{ 
        width: "48px", height: "48px", borderRadius: "14px", 
        backgroundColor: `${color}15`, display: "flex", alignItems: "center", 
        justifyContent: "center", fontSize: "1.5rem", marginBottom: "20px"
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b", marginBottom: "4px" }}>{title}</div>
      <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>{value || 0}</div>
    </div>
  );
}

const thStyle = {
  padding: "16px 12px",
  fontSize: "0.75rem",
  color: "#94a3b8",
  fontWeight: "700",
  letterSpacing: "0.05em"
};

const tdStyle = {
  padding: "20px 12px",
  fontSize: "0.95rem",
  color: "#64748b"
};