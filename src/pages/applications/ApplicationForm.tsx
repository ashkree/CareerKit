import Card from "../../shared/components/cards/Card";
import TextArea from "../../shared/components/forms/TextArea";
import TextField from "../../shared/components/forms/TextField";
import SectionHeader from "../../shared/components/sections/SectionHeader";

export default function ApplicationForm() {
  return (
    <>
      <SectionHeader title="New Application" />
      <div className="flex flex-col gap-8">
        <Card
          variant="form"
          onSave={() => {}}
        >
          <Card.Section>
            <Card.Section.Edit>
              <div className="flex flex-col gap-2">
                <TextField
                  id="JobTitleField"
                  label="Job Title"
                  onChange={() => {}}
                  placeholder="CTO (Chief Taco Officer)"
                />
                <TextField
                  id="JobURLField"
                  label="Job Posting URL"
                  onChange={() => {}}
                  placeholder=""
                />
                <TextArea
                  id="JobDescriptionField"
                  label="Job Description"
                  onChange={() => {}}
                  placeholder="Some Place"
                />
              </div>
            </Card.Section.Edit>
          </Card.Section>
          <Card.Section>
            <Card.Section.Edit>
              <div className="flex flex-col gap-2">
                <TextField
                  id="CompanyNameField"
                  label="Company Name"
                  onChange={() => {}}
                  placeholder="Some Place"
                />
                <TextField
                  id="CompanyUrlField"
                  label="Company Website URL"
                  onChange={() => {}}
                  placeholder=""
                />
              </div>
            </Card.Section.Edit>
          </Card.Section>
          <Card.Section>
            <Card.Section.Edit>
              <div className="flex flex-col gap-2">
                <TextField
                  id="CompanyNameField"
                  label="Company Name"
                  onChange={() => {}}
                  placeholder="Some Place"
                />
                <TextField
                  id="CompanyUrlField"
                  label="Company Website URL"
                  onChange={() => {}}
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
