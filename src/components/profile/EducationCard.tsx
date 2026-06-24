import type { Education } from "../../types";

type EducationCardProps = {
  education: Education;
};

export default function EducationCard({ education }: EducationCardProps) {
  return (
    <div>
      <div>
        <h3>{education.degree}</h3>
        <p>{education.field}</p>
      </div>
      <div>
        <h4>
          <a>{education.school}</a>
        </h4>
        <p>
          {education.location.city}, {education.location.country}
        </p>
        <p>
          {education.duration.start}, {education.duration.end}
        </p>
      </div>
      <p>{education.description}</p>
      <ul>
        {education.skills?.map((skill) => (
          <li key={skill}> - {skill}</li>
        ))}
      </ul>
      <ul>
        {education.achievements?.map((achievement) => (
          <li key={achievement}> - {achievement}</li>
        ))}
      </ul>
    </div>
  );
}
