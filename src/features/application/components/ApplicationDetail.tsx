import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ExternalLink } from "lucide-react";
import Card from "../../../shared/components/cards/Card";
import SectionHeader from "../../../shared/components/sections/SectionHeader";
import TextField from "../../../shared/components/forms/TextField";
import TextArea from "../../../shared/components/forms/TextArea";
import Dropdown from "../../../shared/components/forms/Dropdown";
import IconButton from "../../../shared/components/buttons/IconButton";
import IconPill from "../../../shared/components/badges/IconPill";
import { getApplication, updateApplication, deleteApplication } from "../api";
import { statusConfig } from "../status";
import type { Application } from "../types";
import { updateProp } from "../../../shared/utils/data_updates";

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "rejected", label: "Rejected" },
  { value: "interview", label: "Interview" },
  { value: "offer_received", label: "Offer Received" },
];

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [savedApplication, setSavedApplication] = useState<Application | null>(
    null,
  );
  const [draft, setDraft] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplication() {
      try {
        const app = await getApplication(Number(id));
        if (app) {
          setSavedApplication(app);
          setDraft(app);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadApplication();
  }, [id]);

  async function handleSave() {
    if (!draft || !savedApplication?.id) return;
    await updateApplication(savedApplication.id, draft);
    setSavedApplication({ ...draft });
  }

  function handleCancel() {
    if (savedApplication) {
      setDraft({ ...savedApplication });
    }
  }

  async function handleDelete() {
    if (!savedApplication?.id) return;
    await deleteApplication(savedApplication.id);
    navigate("/applications");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!draft) {
    return <p>Application not found.</p>;
  }

  return (
    <>
      <SectionHeader title="Application Details" />
      <div className="flex flex-col gap-8">
        <Card
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          saveDisabled={!draft.job_title || !draft.company}
        >
          <Card.Section>
            <Card.Section.View>
              <div className="flex items-center gap-2">
                <h3 className="text-text-primary font-bold text-xl">
                  {draft.job_title}
                </h3>

                {draft.job_url && (
                  <IconButton
                    icon={ExternalLink}
                    onClick={() => {
                      window.open(draft.job_url, "_blank");
                    }}
                    defaultStyle="text-text-secondary"
                    hoverStyle="hover:text-brand-600"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-text-secondary">{draft.company}</p>

                {draft.job_url && (
                  <IconButton
                    icon={ExternalLink}
                    onClick={() => {
                      window.open(draft.job_url, "_blank");
                    }}
                    defaultStyle="text-text-secondary"
                    hoverStyle="hover:text-brand-600"
                  />
                )}
              </div>
              {(() => {
                const cfg = statusConfig[draft.status];
                return cfg ? (
                  <IconPill
                    icon={cfg.icon}
                    text={cfg.label}
                    className={cfg.className}
                  />
                ) : null;
              })()}
            </Card.Section.View>
            <Card.Section.Edit>
              <div className="flex flex-col gap-2">
                <TextField
                  id="detailJobTitleField"
                  label="Job Title"
                  value={draft.job_title}
                  onChange={(value) =>
                    setDraft(updateProp(draft, "job_title", value))
                  }
                  placeholder="CTO (Chief Taco Officer)"
                />
                <TextField
                  id="detailJobUrlField"
                  label="Job Posting URL"
                  value={draft.job_url}
                  onChange={(value) =>
                    setDraft(updateProp(draft, "job_url", value))
                  }
                  placeholder=""
                />
                <Dropdown
                  id="detailStatusField"
                  label="Status"
                  value={draft.status}
                  onChange={(value) =>
                    setDraft(updateProp(draft, "status", value))
                  }
                  options={statusOptions}
                />
                <div className="flex flex-col gap-2">
                  <TextField
                    id="detailCompanyNameField"
                    label="Company Name"
                    value={draft.company}
                    onChange={(value) =>
                      setDraft(updateProp(draft, "company", value))
                    }
                    placeholder="Some Place"
                  />
                  <TextField
                    id="detailCompanyUrlField"
                    label="Company Website URL"
                    value={draft.company_website}
                    onChange={(value) =>
                      setDraft(updateProp(draft, "company_website", value))
                    }
                    placeholder=""
                  />
                </div>
              </div>
            </Card.Section.Edit>
          </Card.Section>
          <Card.Section title="Description">
            <Card.Section.View>
              <p className="text-text-secondary">{draft.description}</p>
            </Card.Section.View>
            <Card.Section.Edit>
              <TextArea
                id="detailJobDescriptionField"
                value={draft.description}
                onChange={(value) =>
                  setDraft(updateProp(draft, "description", value))
                }
                placeholder="Job description..."
              />
            </Card.Section.Edit>
          </Card.Section>
          <Card.Section title="Contact">
            <Card.Section.View>
              <div className="flex flex gap-2">
                <p className="text-text-secondary">{draft.contact}</p>
                {draft.contact_linkedin_url && (
                  <IconButton
                    icon={ExternalLink}
                    onClick={() => {
                      window.open(draft.contact_linkedin_url, "_blank");
                    }}
                    defaultStyle="text-text-secondary"
                    hoverStyle="hover:text-brand-600"
                  />
                )}
              </div>
              <p className="text-text-secondary">{draft.contact_email}</p>
            </Card.Section.View>
            <Card.Section.Edit>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2"></div>
                <TextField
                  id="detailContactEmailField"
                  label="Contact Email"
                  value={draft.contact_email}
                  onChange={(value) =>
                    setDraft(updateProp(draft, "contact_email", value))
                  }
                  placeholder=""
                />
                <TextField
                  id="detailContactLinkedinUrl"
                  label="Contact Linkedin URL"
                  value={draft.contact_linkedin_url}
                  onChange={(value) =>
                    setDraft(updateProp(draft, "contact_linkedin_url", value))
                  }
                  placeholder=""
                />
              </div>
            </Card.Section.Edit>
          </Card.Section>
        </Card>
      </div>
    </>
  );
}
