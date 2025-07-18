import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth, MainPage } from "@/layouts";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/main/*" element={<MainPage />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/main/mainHome" replace />} />
    </Routes>
  );
}

export default App;
