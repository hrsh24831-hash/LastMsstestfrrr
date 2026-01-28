import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10) digits = digits.slice(0, 10);
  return digits;
};

export default function AddUser() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' }); // Custom status messages

  const navigate = useNavigate();

  const submit = async () => {
    if (loading) return;
    setStatus({ type: '', msg: '' });

    if (!name || !phone) {
      setStatus({ type: 'error', msg: "Please fill all fields" });
      return;
    }

    if (phone.length !== 10) {
      setStatus({ type: 'error', msg: "Phone number must be 10 digits" });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, { name, phone });
      setStatus({ type: 'success', msg: "User registered successfully!" });
      
      setTimeout(() => {
        setName("");
        setPhone("");
        navigate("/admin/users");
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      backgroundImage: "linear-gradient(to bottom right, #f8fafc, #eff6ff)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-container { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <div className="form-container" style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        padding: "40px",
        borderRadius: "32px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
        border: "1px solid rgba(255,255,255,0.3)",
        textAlign: "center"
      }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ 
            width: "60px", height: "60px", backgroundColor: "#3b82f615", 
            borderRadius: "20px", display: "flex", alignItems: "center", 
            justifyContent: "center", margin: "0 auto 16px" 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Create Account</h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "0.95rem" }}>Add a new member to the system</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
          {/* Custom Input Field: Name */}
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginLeft: "4px" }}>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              style={{
                width: "100%", marginTop: "6px", padding: "14px 18px", borderRadius: "14px",
                border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "1rem",
                outline: "none", transition: "all 0.3s", boxSizing: "border-box"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.backgroundColor = "#f8fafc"; }}
            />
          </div>

          {/* Custom Input Field: Phone */}
          <div style={{ marginBottom: "28px", textAlign: "left" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginLeft: "4px" }}>Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="10 digit mobile number"
              style={{
                width: "100%", marginTop: "6px", padding: "14px 18px", borderRadius: "14px",
                border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "1rem",
                outline: "none", transition: "all 0.3s", boxSizing: "border-box"
              }}
              onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.backgroundColor = "#fff"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.backgroundColor = "#f8fafc"; }}
            />
          </div>

          {/* Feedback Message */}
          {status.msg && (
            <div style={{ 
              padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "0.9rem",
              backgroundColor: status.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: status.type === 'error' ? '#dc2626' : '#16a34a',
              border: `1px solid ${status.type === 'error' ? '#fee2e2' : '#dcfce7'}`
            }}>
              {status.msg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "16px", borderRadius: "16px", border: "none",
              backgroundColor: loading ? "#94a3b8" : "#1e293b", color: "#fff",
              fontSize: "1rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
            }}
          >
            {loading && (
              <div style={{ 
                width: "18px", height: "18px", border: "2px solid #fff", 
                borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" 
              }} />
            )}
            {loading ? "Processing..." : "Register User"}
          </button>
        </form>

        <button 
          onClick={() => navigate("/")}
          style={{ 
            background: "none", border: "none", color: "#64748b", 
            marginTop: "20px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "500" 
          }}
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}