import SidebarButton from "./SidebarButton";

export default function Sidebar() {
  return (
    <aside className="bg-slate-950 px-8 py-2">
      <div className="p-4 text-2xl font-bold">
        <h1 className="text-sky-100"> CareerKit </h1>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-slate-300 font-bold mb-2"> Career </h2>
        <ul>
          <SidebarButton text="Contact" />
          <SidebarButton text="Skills" />
          <SidebarButton text="Experience" />
          <SidebarButton text="Education" />
          <SidebarButton text="Projects" />
          <SidebarButton text="Certifications" />
        </ul>
      </div>

      <div className="px-4 py-2">
        <h2 className="text-slate-300 font-bold mb-2"> Applications </h2>
        <ul>
          <SidebarButton text="New Application" />
          <SidebarButton text="Application Tracker" />
        </ul>
      </div>
    </aside>
  );
}
