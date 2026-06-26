import { type ReactNode } from "react";
import PersonalDetailsCard from "../features/profile/components/PersonalDetailsCard";
import SkillsCard from "../features/skills/components/SkillsCard";

type SectionProps = {
  title: string;
  body: ReactNode;
};

function Section({ title, body }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-md text-text-secondary font-bold">{title}</h2>
      {body}
    </div>
  );
}

export default function ProfileForm() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Career Profile</h1>
      </header>
      <div className="flex flex-col gap-8">
        <Section title="Personal Details" body={<PersonalDetailsCard />} />
        <Section title="Skills" body={<SkillsCard />} />
      </div>
    </>
  );
}
