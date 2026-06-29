import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ExternalLink } from "lucide-react";
import SectionHeader from "../../shared/components/sections/SectionHeader";
import IconButton from "../../shared/components/buttons/IconButton";
import IconPill from "../../shared/components/badges/IconPill";
import { getApplications } from "../../features/application/api";
import { statusConfig } from "../../features/application/status";
import type { Application } from "../../features/application/types";

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const apps = await getApplications();
        setApplications(apps ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <SectionHeader title="Your Applications" />
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <SectionHeader title="Your Applications" />
      <div className="flex flex-col gap-4">
        {applications.length === 0 ? (
          <p className="text-text-secondary">No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="bg-layer-crust p-4 border border-border-subtle rounded-xl cursor-pointer hover:border-interactive-default transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-text-primary font-bold text-xl">
                    {app.job_title}
                  </h3>
                  {(() => {
                    const cfg = statusConfig[app.status];
                    return cfg ? (
                      <IconPill icon={cfg.icon} text={cfg.label} className={cfg.className} />
                    ) : null;
                  })()}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    icon={ExternalLink}
                    onClick={() => { window.open(app.job_url, "_blank"); }}
                    defaultStyle="text-text-secondary"
                    hoverStyle="hover:bg-layer-mantle hover:text-brand-600"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-text-secondary">{app.company}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
