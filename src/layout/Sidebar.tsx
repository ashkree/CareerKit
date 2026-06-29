import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  User,
  Zap,
  LucideIcon,
  Plus,
  List,
} from "lucide-react";
import IconButton from "../shared/components/buttons/IconButton";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

type SidebarButtonProps = {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
};

function SidebarButton({ icon, text, onClick }: SidebarButtonProps) {
  return (
    <li>
      <IconButton
        icon={icon}
        iconClass="text-brand-500"
        text={text}
        onClick={onClick}
        defaultStyle="text-text-inverted-secondary text-lg"
        hoverStyle="hover:text-text-inverted hover:bg-chrome-mantle w-full"
      />
    </li>
  );
}

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="py-2">
      <h2 className="text-text-inverted-secondary font-bold mb-2">{title}</h2>
      <ul>{children}</ul>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  function goToSection(sectionId: string) {
    navigate("/", { state: { scrollTo: sectionId } });
  }

  return (
    <aside className="bg-chrome-core px-8 py-2">
      <div className="p-4 text-3xl font-bold">
        <h1 className="text-3xl text-text-inverted"> CareerKit </h1>
        <h2 className="text-xl text-brand-500"> Your Career Dashboard </h2>
      </div>

      <SidebarSection title="Career">
        <SidebarButton
          icon={User}
          text="Contact"
          onClick={() => goToSection("PersonalDetailsSection")}
        />
        <SidebarButton
          icon={Zap}
          text="Skills"
          onClick={() => goToSection("SkillsSection")}
        />
        <SidebarButton
          icon={BriefcaseBusiness}
          text="Experience"
          onClick={() => goToSection("ExperienceSection")}
        />
        <SidebarButton
          icon={FileText}
          text="Projects"
          onClick={() => goToSection("ProjectSection")}
        />
        <SidebarButton
          icon={GraduationCap}
          text="Education"
          onClick={() => goToSection("EducationSection")}
        />
      </SidebarSection>

      <SidebarSection title="Applications">
        <SidebarButton
          icon={Plus}
          text="New Application"
          onClick={() => navigate("/applications/new")}
        />
        <SidebarButton
          icon={List}
          text="My Applications"
          onClick={() => navigate("/applications")}
        />
      </SidebarSection>
    </aside>
  );
}
