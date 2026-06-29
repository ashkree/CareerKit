import Card from "../../../shared/components/cards/Card";
import SectionHeader from "../../../shared/components/sections/SectionHeader";
import TextArea from "../../../shared/components/forms/TextArea";
import TextField from "../../../shared/components/forms/TextField";
import Dropdown from "../../../shared/components/forms/Dropdown";
import { useState } from "react";
import { insertApplication } from "../api";

export default function ApplicationForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactLinkedinUrl, setContactLinkedinUrl] = useState("");
  const [status, setStatus] = useState("saved");

  const saveDisabled = !jobTitle || !jobUrl || !description;
  const today = new Date().toISOString().split("T")[0];

  async function handleSave() {
    await insertApplication({
      job_title: jobTitle,
      job_url: jobUrl,
      company,
      company_website: companyWebsite,
      status,
      date_saved: today,
      date_applied: status === "applied" ? today : "",
      description,
      contact,
      contact_email: contactEmail,
      contact_linkedin_url: contactLinkedinUrl,
    });
  }

  return (
    <>
      <SectionHeader title="New Application" />
      <div className="flex flex-col gap-8">
        <Card variant="form" onSave={handleSave} saveDisabled={saveDisabled}>
          <Card.Section>
            <div className="flex flex-col gap-2">
              <TextField
                id="JobTitleField"
                label="Job Title"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="CTO (Chief Taco Officer)"
              />
              <TextField
                id="JobURLField"
                label="Job Posting URL"
                value={jobUrl}
                onChange={setJobUrl}
                placeholder=""
              />
              <TextArea
                id="JobDescriptionField"
                label="Job Description"
                value={description}
                onChange={setDescription}
                placeholder="Some Place"
              />
            </div>
          </Card.Section>
          <Card.Section>
            <div className="flex flex-col gap-2">
              <Dropdown
                id="StatusField"
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: "saved", label: "Saved" },
                  { value: "applied", label: "Applied" },
                  { value: "rejected", label: "Rejected" },
                  { value: "interview", label: "Interview" },
                  { value: "offer_received", label: "Offer Received" },
                ]}
              />
            </div>
          </Card.Section>
          <Card.Section>
            <div className="flex flex-col gap-2">
              <TextField
                id="CompanyNameField"
                label="Company Name"
                value={company}
                onChange={setCompany}
                placeholder="Some Place"
              />
              <TextField
                id="CompanyUrlField"
                label="Company Website URL"
                value={companyWebsite}
                onChange={setCompanyWebsite}
                placeholder=""
              />
            </div>
          </Card.Section>
          <Card.Section>
            <div className="flex flex-col gap-2">
              <TextField
                id="ContactField"
                label="Contact Name"
                value={contact}
                onChange={setContact}
                placeholder="Some Place"
              />
              <TextField
                id="ContactEmailField"
                label="Contact Email"
                value={contactEmail}
                onChange={setContactEmail}
                placeholder=""
              />
              <TextField
                id="ContactLinkedinURL"
                label="Contact Linkedin URL"
                value={contactLinkedinUrl}
                onChange={setContactLinkedinUrl}
                placeholder=""
              />
            </div>
          </Card.Section>
        </Card>
      </div>
    </>
  );
}
