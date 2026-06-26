import type { Experience } from "../types";

type ExperienceCardProps = {
  experience: Experience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div>
      <p>
        <h3> {experience.role}</h3>
        <p>
          ({experience.duration.start} - {experience.duration.end})
        </p>
      </p>
      <p>
        <h4>
          <a>{experience.company}</a>
        </h4>
        <p>
          | {experience.location.city}, {experience.location.country}
        </p>
      </p>
      <p>{experience.description}</p>
      <ul>
        {experience.highlights?.map((highlight) => (
          <li> - {highlight}</li>
        ))}
      </ul>
      <ul>
        {experience.skills?.map((skill) => (
          <li> - {skill}</li>
        ))}
      </ul>
    </div>
  );
}
