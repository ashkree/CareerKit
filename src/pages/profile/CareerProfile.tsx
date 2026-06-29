import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router";
import PersonalDetailsCard from "../../features/profile/components/PersonalDetailsCard";
import SkillsCard from "../../features/skills/components/SkillsCard";
import ExperienceCard from "../../features/experience/components/ExperienceCard";
import ProjectCard from "../../features/project/components/ProjectCard";
import EducationCard from "../../features/education/components/EducationCard";
import SectionHeader from "../../shared/components/sections/SectionHeader";

type SectionProps = {
  id: string;
  title: string;
  body: ReactNode;
};

function Section({ id, title, body }: SectionProps) {
  return (
    <div id={id} className="flex flex-col gap-2">
      <h2 className="text-2xl text-text-secondary font-bold">{title}</h2>
      {body}
    </div>
  );
}

export default function CareerProfile() {
  const location = useLocation();

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (!scrollTo) return;

    const el = document.getElementById(scrollTo);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.state]);

  return (
    <>
      <SectionHeader title="Career Profile" />
      <div className="flex flex-col gap-8">
        <Section
          id="PersonalDetailsSection"
          title="Personal Details"
          body={<PersonalDetailsCard />}
        />
        <Section id="SkillsSection" title="Skills" body={<SkillsCard />} />
        <Section
          id="ExperienceSection"
          title="Experience"
          body={<ExperienceCard />}
        />
        <Section id="ProjectSection" title="Projects" body={<ProjectCard />} />
        <Section
          id="EducationSection"
          title="Education"
          body={<EducationCard />}
        />
      </div>
    </>
  );
}
