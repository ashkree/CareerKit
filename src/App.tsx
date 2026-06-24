import CareerProfile from "./pages/CareerProfile.tsx";
import Sidebar from "./components/layout/Sidebar.tsx";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto px-6 py-8">
        <div className="max-w-prose mx-auto bg-color-layer-core">
          <CareerProfile />
        </div>
      </main>
    </div>
  );
}
