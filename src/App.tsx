import CareerProfile from "./pages/profile/CareerProfile.tsx";
import Sidebar from "./layout/Sidebar.tsx";
import { Routes, Route, BrowserRouter } from "react-router";
import ApplicationDashboard from "./pages/applications/ApplicationDashboard.tsx";
import ApplicationForm from "./features/application/components/ApplicationForm.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <main className="flex-1 overflow-auto px-6 py-8">
          <div className="max-w-prose mx-auto bg-color-layer-core">
            <Routes>
              <Route index element={<CareerProfile />} />
              <Route path="/applications">
                <Route index element={<ApplicationDashboard />} />
                <Route path="new" element={<ApplicationForm />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
