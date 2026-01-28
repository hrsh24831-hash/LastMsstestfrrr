import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner() {
  const [mealType, setMealType] = useState("BREAKFAST");
  const [status, setStatus] = useState({ type: '', msg: 'Ready to scan' });
  const scannerRef = useRef(null);
  const startedRef = useRef(false);

  const successSound = useRef(new Audio("/success.mp3"));
  const errorSound = useRef(new Audio("/error.mp3"));

  const markAttendance = async (qrCodeId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/attendance/mark`, {
        userId: qrCodeId,
        mealType,
      });

      successSound.current.play();
      setStatus({ 
        type: 'success', 
        msg: `${res.data.message} | Remaining: ${res.data.remainingMeals}` 
      });

      setTimeout(() => { startScanner(); }, 5000);
    } catch (err) {
      errorSound.current.play();
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.message || "Attendance failed" 
      });

      setTimeout(() => { startScanner(); }, 5000);
    }
  };

  const startScanner = async () => {
    if (startedRef.current) return;
    const el = document.getElementById("qr-reader");
    if (!el) return;

    try {
      startedRef.current = true;
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const devices = await Html5Qrcode.getCameras();
      if (!devices.length) {
        setStatus({ type: 'error', msg: "No camera found" });
        startedRef.current = false;
        return;
      }

      await html5QrCode.start(
        devices[0].id,
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0 // Force square aspect ratio
        },
        async (decodedText) => {
          await stopScanner();
          const qrValue = decodedText.split("/").pop().trim();
await markAttendance(qrValue);

        }
      );
    } catch (e) {
      setStatus({ type: 'error', msg: "Camera access denied" });
      startedRef.current = false;
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) { hardStopCamera(); return; }
    try {
      if (scannerRef.current.getState() === 2) await scannerRef.current.stop();
      await scannerRef.current.clear();
    } catch (e) { console.warn(e); }
    hardStopCamera();
    scannerRef.current = null;
    startedRef.current = false;
  };

  const hardStopCamera = () => {
    try {
      const video = document.querySelector("#qr-reader video");
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    } catch (e) {}
  };

  const scanFromImage = async (file) => {
    try {
      if (!scannerRef.current) scannerRef.current = new Html5Qrcode("qr-reader");
      const result = await scannerRef.current.scanFile(file, true);
      await markAttendance(result);
    } catch (err) {
      setStatus({ type: 'error', msg: "QR not detected in image" });
    }
  };

  useEffect(() => {
    const t = setTimeout(() => startScanner(), 300);
    return () => { clearTimeout(t); stopScanner(); };
  }, []);

  useEffect(() => {
    const safeRestart = async () => {
      await stopScanner();
      setTimeout(() => startScanner(), 500);
    };
    safeRestart();
  }, [mealType]);

  return (
    <div style={{ 
      minHeight: "100vh", backgroundColor: "#0f172a", 
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px", fontFamily: "system-ui, sans-serif", color: "#fff" 
    }}>
      <style>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
        
        /* Forces the camera video to fill the square and stay centered */
        #qr-reader video { 
          width: 100% !important; 
          height: 100% !important; 
          object-fit: cover !important; 
          border-radius: 24px; 
        }
        #qr-reader { border: none !important; }
      `}</style>

      {/* Header HUD */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
          Terminal <span style={{ color: "#3b82f6" }}>Scanner</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", animation: "pulse 2s infinite" }}></div>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px" }}>SYSTEM LIVE</span>
        </div>
      </div>

      {/* Meal Selection Tabs */}
      <div style={{ 
        display: "flex", backgroundColor: "#1e293b", padding: "6px", 
        borderRadius: "16px", marginBottom: "30px", width: "100%", maxWidth: "340px" 
      }}>
        {["BREAKFAST", "LUNCH", "DINNER"].map((type) => (
          <button 
            key={type}
            onClick={() => setMealType(type)}
            style={{
              flex: 1, padding: "10px", border: "none", borderRadius: "12px",
              fontSize: "0.75rem", fontWeight: "700", cursor: "pointer",
              transition: "0.3s",
              backgroundColor: mealType === type ? "#3b82f6" : "transparent",
              color: mealType === type ? "#fff" : "#64748b"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Viewfinder Container - FIXED CENTERING */}
      <div style={{ 
        position: "relative", 
        width: "320px", 
        height: "320px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto" 
      }}>
        {/* Corner Brackets */}
        <div style={{ position: "absolute", top: -2, left: -2, width: 40, height: 40, borderTop: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "12px 0 0 0", zIndex: 10 }}></div>
        <div style={{ position: "absolute", top: -2, right: -2, width: 40, height: 40, borderTop: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 12px 0 0", zIndex: 10 }}></div>
        <div style={{ position: "absolute", bottom: -2, left: -2, width: 40, height: 40, borderBottom: "4px solid #3b82f6", borderLeft: "4px solid #3b82f6", borderRadius: "0 0 0 12px", zIndex: 10 }}></div>
        <div style={{ position: "absolute", bottom: -2, right: -2, width: 40, height: 40, borderBottom: "4px solid #3b82f6", borderRight: "4px solid #3b82f6", borderRadius: "0 0 12px 0", zIndex: 10 }}></div>
        
        {/* Scanning Line */}
        <div style={{ 
          position: "absolute", left: 0, width: "100%", height: "2px", 
          background: "linear-gradient(to right, transparent, #3b82f6, transparent)",
          boxShadow: "0 0 15px #3b82f6", zIndex: 5, animation: "scan 3s linear infinite" 
        }}></div>

        <div id="qr-reader" style={{ 
          width: "100%", 
          height: "100%", 
          backgroundColor: "#000", 
          borderRadius: "24px", 
          overflow: "hidden", 
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }} />
      </div>

      {/* Status HUD - Matched width for balance */}
      <div style={{ 
        marginTop: "40px", width: "320px", padding: "20px",
        borderRadius: "20px", backgroundColor: "#1e293b", textAlign: "center",
        border: `1px solid ${status.type === 'success' ? '#10b981' : status.type === 'error' ? '#ef4444' : '#334155'}`,
        boxSizing: "border-box"
      }}>
        <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: "8px", fontWeight: "700", letterSpacing: "1px" }}>OUTPUT TERMINAL</div>
        <div style={{ 
          fontSize: "1rem", fontWeight: "600", 
          color: status.type === 'success' ? '#10b981' : status.type === 'error' ? '#ef4444' : '#fff' 
        }}>
          {status.msg}
        </div>
      </div>

      {/* Control Buttons - Centered and matched width */}
      <div style={{ marginTop: "30px", display: "flex", gap: "12px", width: "320px" }}>
        <label style={{ 
          flex: 1, backgroundColor: "#334155", color: "#fff", padding: "12px 0", 
          borderRadius: "14px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", textAlign: "center"
        }}>
          Upload Image
          <input type="file" accept="image/*" hidden onChange={(e) => scanFromImage(e.target.files[0])} />
        </label>
        <button 
          onClick={() => { stopScanner(); setTimeout(() => startScanner(), 500); }}
          style={{ flex: 1, backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 0", borderRadius: "14px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}
        >
          Reset Camera
        </button>
      </div>
    </div>
  );

}
