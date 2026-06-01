import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ScannerPage from "./pages/ScannerPage";
import NavigationResultPage from "./pages/NavigationResultPage";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/result" element={<NavigationResultPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
